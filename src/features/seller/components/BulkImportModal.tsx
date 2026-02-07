import { useState, useRef } from "react";
import { ProductService } from "../../products/services/product.service";
import type { IBatchUploadStats } from "../../../shared/types";

interface BulkImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const BulkImportModal = ({ isOpen, onClose, onSuccess }: BulkImportModalProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<IBatchUploadStats | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setError(null);
        setStats(null);

        try {
            const text = await file.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                throw new Error("Invalid JSON file");
            }

            if (!Array.isArray(data)) {
                // Handle wrapped structure { products: [...] }
                if (data.products && Array.isArray(data.products)) {
                    data = data.products;
                } else {
                    throw new Error("File must contain an array of products");
                }
            }

            // Limit check (client-side first)
            if (data.length > 500) {
                throw new Error("Batch limit is 500 products per upload.");
            }

            const result = await ProductService.uploadBulkProducts(data);
            setStats(result);
            if (result.success > 0) {
                onSuccess(); // Trigger refresh on parent
            }
        } catch (err: any) {
            console.error("Upload failed", err);
            setError(err.message || "Failed to upload products");
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-xl font-bold mb-4">Bulk Import Products</h2>

                {!stats ? (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Upload a JSON file containing an array of products.
                            <br />
                            <a href="#" onClick={(e) => {
                                e.preventDefault();
                                const example = [
                                    { name: "Chips", price: 20, stock: 100, category: "Snacks", description: "Tasty", sku: "CHIPS-001" }
                                ];
                                const blob = new Blob([JSON.stringify(example, null, 2)], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'example_products.json';
                                a.click();
                            }} className="text-blue-600 hover:underline">Download Template</a>
                        </p>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}>
                            {loading ? (
                                <div className="text-gray-500">Uploading...</div>
                            ) : (
                                <>
                                    <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <span className="text-gray-600">Click to Select JSON File</span>
                                </>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".json"
                                onChange={handleFileChange}
                                disabled={loading}
                            />
                        </div>
                        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className={`p-4 rounded-lg ${stats.failed === 0 ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                            <h3 className="font-bold">Upload Complete</h3>
                            <p>Total: {stats.total}</p>
                            <p>Success: {stats.success}</p>
                            <p>Failed: {stats.failed}</p>
                        </div>

                        {stats.errors.length > 0 && (
                            <div className="max-h-40 overflow-y-auto border rounded p-2 text-xs text-red-600 bg-red-50">
                                {stats.errors.map((err, i) => (
                                    <div key={i} className="mb-1">
                                        Row {err.row}: {err.error}
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => { setStats(null); onClose(); }}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
