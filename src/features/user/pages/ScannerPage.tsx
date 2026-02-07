import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";

const ScannerPage = () => {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Prevent double initialization
        if (scannerRef.current) return;

        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );
        scannerRef.current = scanner;

        scanner.render(
            (decodedText) => {
                setScanResult(decodedText);
                scanner.clear();
                // Parse URL to extract sellerId/amount
                // Expected format: https://app.com/pay?sellerId=...
                try {
                    const url = new URL(decodedText);
                    const sellerId = url.searchParams.get("sellerId");
                    const amount = url.searchParams.get("amount");
                    if (sellerId) {
                        navigate(`/pay?sellerId=${sellerId}${amount ? `&amount=${amount}` : ''}`);
                    } else {
                        alert("Invalid QR Code: No Seller ID found");
                        window.location.reload();
                    }
                } catch (e) {
                    // Handle raw text or invalid URL
                    alert(`Scanned: ${decodedText}`);
                    window.location.reload();
                }
            },
            (error) => {
                console.warn(error);
            }
        );

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => console.error("Failed to clear html5-qrcode scanner. ", error));
            }
        };
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-full bg-black">
            <div id="reader" className="w-full max-w-sm"></div>

            {scanResult && (
                <div className="mt-4 p-4 bg-white rounded-lg shadow-lg text-center">
                    <p className="text-green-600 font-bold mb-2">Success!</p>
                    <p className="text-xs text-gray-500 break-all">{scanResult}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg w-full"
                    >
                        Scan Again
                    </button>
                </div>
            )}

            <div className="absolute top-10 left-0 w-full text-center text-white/80 z-20 pointer-events-none">
                <p className="font-medium text-lg">Scan to Pay</p>
                <p className="text-sm">Align QR code within the frame</p>
            </div>
        </div>
    );
};

export default ScannerPage;
