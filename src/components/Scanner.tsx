import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { useCart } from "../context/CartContext";
import { SellerService } from "../features/seller/services/seller.service";
import { useNavigate } from 'react-router-dom';

const Scanner = () => {
    const [lastScanned, setLastScanned] = useState<string | null>(null);
    const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error' | 'permission_denied'>('idle');
    const [scannedProductName, setScannedProductName] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const scannerRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(err => console.warn("Failed to stop scanner", err));
            }
        };
    }, []);

    const startScanning = async () => {
        setScanStatus('scanning');
        setErrorMessage(null);

        try {
            const tempScanner = new Html5Qrcode("reader", {
                formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
                verbose: false
            });
            scannerRef.current = tempScanner;

            await tempScanner.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0
                },
                onScanSuccess,
                onScanFailure
            );
        } catch (err: any) {
            console.error("Error starting scanner", err);
            setScanStatus('permission_denied');
            setErrorMessage(err?.message || "Failed to access camera. Please check permissions.");
        }
    };

    const onScanSuccess = async (decodedText: string) => {
        if (decodedText === lastScanned) return;
        setLastScanned(decodedText);
        setScanStatus('success');

        try {
            // Decoded Text Format: https://app.pay/scan?s={sellerId}&p={productId}&v={variantId}
            // Or simple JSON: {"s": "...", "p": "..."}
            let productId: string | null = null;
            let sellerId: string | null = null;

            try {
                const url = new URL(decodedText);
                productId = url.searchParams.get('p');
                sellerId = url.searchParams.get('s');
            } catch {
                // Try JSON parsing if URL fails
                try {
                    const data = JSON.parse(decodedText);
                    productId = data.p;
                    sellerId = data.s;
                } catch {
                    // Fail
                }
            }

            if (!productId || !sellerId) {
                console.warn("Invalid QR Data:", decodedText);
                setScanStatus('error');
                setTimeout(() => {
                    setScanStatus('scanning');
                    setLastScanned(null);
                }, 2000);
                return;
            }

            // Play Beep
            const audio = new Audio('/beep.mp3');
            audio.play().catch(() => { });

            // Fetch Product
            const product = await SellerService.getProductById(productId);

            if (product) {
                setScannedProductName(product.name);
                addToCart({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    sellerId: product.sellerId,
                    imageUrl: product.imageUrl
                });

                // Keep showing success state briefly then reset
                setTimeout(() => {
                    setScanStatus('scanning');
                    setScannedProductName(null);
                    setLastScanned(null);
                }, 1500);
            } else {
                setScanStatus('error');
                setTimeout(() => {
                    setScanStatus('scanning');
                    setLastScanned(null);
                }, 2000);
            }
        } catch (err) {
            console.error("Scan Error", err);
            setScanStatus('error');
            setTimeout(() => {
                setScanStatus('scanning');
                setLastScanned(null);
            }, 2000);
        }
    };

    const onScanFailure = (_error: any) => {
        // quiet failure
    };

    return (
        <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col">
            {/* Header / Overlay */}
            <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white">
                    ← Back
                </button>
                <div className="text-white font-bold tracking-wider">SCANNER</div>
                <button onClick={() => navigate('/checkout')} className="p-2 rounded-full bg-indigo-600 text-white text-xs font-bold px-4">
                    Cart
                </button>
            </div>

            {/* Scanner Container */}
            <div className="flex-1 relative flex items-center justify-center bg-gray-900">
                <div id="reader" className="w-full h-full object-cover [&>video]:w-full [&>video]:h-full [&>video]:object-cover"></div>

                {/* Idle / Error State with Button */}
                {(scanStatus === 'idle' || scanStatus === 'permission_denied') && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-30 p-6">
                        <div className="text-white mb-4 text-center">
                            {scanStatus === 'permission_denied'
                                ? <span className="text-red-400 block mb-2">Camera Access Denied/Failed</span>
                                : "Ready to Scan"}
                            {errorMessage && <p className="text-xs text-gray-400 mt-2">{errorMessage}</p>}
                        </div>
                        <button
                            onClick={startScanning}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform active:scale-95"
                        >
                            {scanStatus === 'permission_denied' ? 'Retry Camera' : 'Start Camera'}
                        </button>
                    </div>
                )}

                {/* Scanning Overlay */}
                {scanStatus === 'scanning' && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-64 h-64 border-2 border-white/50 rounded-xl relative">
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white -mt-1 -ml-1 rounded-tl-sm"></div>
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-white -mt-1 -mr-1 rounded-tr-sm"></div>
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-white -mb-1 -ml-1 rounded-bl-sm"></div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white -mb-1 -mr-1 rounded-br-sm"></div>
                            <div className="absolute left-0 right-0 h-0.5 bg-blue-500 top-1/2 animate-scan shadow-[0_0_10px_#3b82f6]"></div>
                        </div>
                    </div>
                )}

                {/* Success Overlay */}
                {scanStatus === 'success' && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/40 backdrop-blur-sm z-30">
                        <div className="bg-white p-6 rounded-2xl flex flex-col items-center animate-bounce-in">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-3 text-white text-3xl">✓</div>
                            <div className="text-gray-900 text-xl font-bold mb-1">Added!</div>
                            <div className="text-gray-600 text-sm">{scannedProductName}</div>
                        </div>
                    </div>
                )}

                {/* Error Overlay */}
                {scanStatus === 'error' && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/40 backdrop-blur-sm z-30">
                        <div className="bg-white p-6 rounded-2xl flex flex-col items-center animate-shake">
                            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-3xl">!</div>
                            <div className="text-gray-900 text-xl font-bold mb-1">Invalid QR</div>
                            <p className="text-gray-600 text-sm">Please try scanning again.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Styles moved to index.css */}
        </div>
    );
};

export default Scanner;
