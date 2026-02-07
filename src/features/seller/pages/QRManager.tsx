import { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas } from "qrcode.react";
import DashboardLayout from "../../dashboard/layouts/DashboardLayout";
import { useAuth } from "../../auth/AuthContext";
import { SellerService } from "../services/seller.service";
import type { IProduct } from "../../../shared/types";

const QRManager = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'shop' | 'product'>('shop');
    const [products, setProducts] = useState<IProduct[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<string>('');
    const canvasRef = useRef<HTMLDivElement>(null);

    // Load Products for dropdown
    useEffect(() => {
        if (user?.uid && activeTab === 'product') {
            SellerService.getProducts(user.uid).then(setProducts);
        }
    }, [user, activeTab]);

    const downloadQR = () => {
        const canvas = canvasRef.current?.querySelector("canvas");
        if (canvas) {
            const url = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = url;
            link.download = `qr-${activeTab}-${Date.now()}.png`;
            link.click();
        }
    };

    const getQRValue = () => {
        const baseUrl = window.location.origin + "/pay"; // e.g., https://app.com/pay
        if (activeTab === 'shop') {
            return `${baseUrl}?sellerId=${user?.uid}`;
        } else {
            const product = products.find(p => p.id === selectedProduct);
            return `${baseUrl}?sellerId=${user?.uid}&productId=${selectedProduct}&amount=${product?.price || 0}`;
        }
    };

    return (
        <DashboardLayout title="QR Manager">
            <div className="p-8">
                <div className="max-w-2xl mx-auto">

                    {/* Tabs */}
                    <div className="flex space-x-1 bg-[#1a1a1a] p-1 rounded-lg border border-gray-800 mb-8">
                        {['shop', 'product'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab
                                    ? "bg-indigo-600 text-white"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                                    }`}
                            >
                                {tab === 'shop' ? 'Shop QR' : 'Product QR'}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        {/* QR Display */}
                        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-8 flex flex-col items-center justify-center space-y-8">

                            {activeTab === 'product' && (
                                <div className="w-full max-w-sm">
                                    <label className="block text-sm text-gray-500 mb-2">Select Product to Generate QR</label>
                                    <select
                                        value={selectedProduct}
                                        onChange={(e) => setSelectedProduct(e.target.value)}
                                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
                                    >
                                        <option value="">-- Choose a Product --</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="bg-white p-4 rounded-xl shadow-lg" ref={canvasRef}>
                                {user?.uid && (selectedProduct || activeTab === 'shop') ? (
                                    <QRCodeCanvas
                                        value={getQRValue()}
                                        size={256}
                                        level="H"
                                        includeMargin={true}
                                    />
                                ) : (
                                    <div className="w-64 h-64 flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-300 rounded">
                                        Select a product first
                                    </div>
                                )}
                            </div>

                            <div className="text-center">
                                <h3 className="text-xl font-medium text-white mb-2">
                                    {activeTab === 'shop' ? "Your Shop QR Code" : "Specific Product QR"}
                                </h3>
                                <p className="text-gray-500 text-sm max-w-md">
                                    {activeTab === 'shop'
                                        ? "Customers can scan this to pay any amount to your shop."
                                        : "Scanning this will pre-fill the product details and price."}
                                </p>
                            </div>

                            <div className="flex justify-center">
                                <button
                                    onClick={downloadQR}
                                    disabled={activeTab === 'product' && !selectedProduct}
                                    className="px-6 py-2 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Download PNG
                                </button>
                                <button
                                    onClick={() => {
                                        if (!activeTab || (activeTab === 'product' && !selectedProduct)) return;

                                        // Open print window
                                        const printWindow = window.open('', '', 'width=800,height=600');
                                        if (!printWindow) return;

                                        const canvas = canvasRef.current?.querySelector("canvas");
                                        const dataUrl = canvas?.toDataURL("image/png");
                                        if (!dataUrl) return;

                                        printWindow.document.write(`
                                        <html>
                                            <head>
                                                <title>Print QR Sheet</title>
                                                <style>
                                                    body { margin: 0; padding: 20px; }
                                                    .grid { 
                                                        display: grid; 
                                                        grid-template-columns: repeat(3, 1fr); 
                                                        gap: 20px; 
                                                    }
                                                    .item { 
                                                        text-align: center; 
                                                        border: 1px dashed #ccc; 
                                                        padding: 10px; 
                                                        page-break-inside: avoid;
                                                    }
                                                    img { width: 150px; height: 150px; }
                                                    .label { font-family: sans-serif; margin-top: 5px; font-size: 12px; }
                                                    @media print {
                                                        .no-print { display: none; }
                                                    }
                                                </style>
                                            </head>
                                            <body>
                                                <div class="no-print" style="margin-bottom: 20px;">
                                                    <button onclick="window.print()" style="padding: 10px 20px; background: blue; color: white; border: none; cursor: pointer;">Print Now</button>
                                                </div>
                                                <div class="grid">
                                                    ${Array(30).fill(0).map(() => `
                                                        <div class="item">
                                                            <img src="${dataUrl}" />
                                                            <div class="label">SCAN TO PAY</div>
                                                        </div>
                                                    `).join('')}
                                                </div>
                                            </body>
                                        </html>
                                    `);
                                        printWindow.document.close();
                                    }}
                                    disabled={activeTab === 'product' && !selectedProduct}
                                    className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ml-4"
                                >
                                    Print Sheet (30x)
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default QRManager;
