import { useState, useEffect } from "react";
import { SellerService } from "../services/seller.service";
import { useAuth } from "../../auth/AuthContext";
import type { IProduct } from "../../../shared/types";
import DashboardLayout from "../../dashboard/layouts/DashboardLayout";

import { BulkImportModal } from "../components/BulkImportModal";

const ProductsPage = () => {
    const { user, loading: authLoading } = useAuth();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    // Form State
    const [formData, setFormData] = useState({
        name: "",
        price: 0,
        stock: 0,
        category: "General",
        description: "",
        imageUrl: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [editingId, setEditingId] = useState<string | null>(null);

    const loadProducts = async () => {
        if (!user?.uid) return;
        setLoading(true);
        try {
            const data = await SellerService.getProducts(user.uid);
            setProducts(data);
        } catch (error) {
            console.error("Failed to load products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && user?.uid) {
            loadProducts();
        } else if (!authLoading && !user) {
            setLoading(false);
        }
    }, [user, authLoading]);

    const handleEditClick = (product: IProduct) => {
        setFormData({
            name: product.name,
            price: product.price,
            stock: product.stock,
            category: product.category,
            description: product.description,
            imageUrl: product.imageUrl,
        });
        setEditingId(product.id);
        setIsModalOpen(true);
    };

    const handleAddClick = () => {
        setFormData({ name: "", price: 0, stock: 0, category: "General", description: "", imageUrl: "" });
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.uid) return;

        try {
            if (editingId) {
                await SellerService.updateProduct(editingId, { ...formData, sellerId: user.uid }, imageFile);
            } else {
                await SellerService.addProduct(formData, user.uid, imageFile);
            }
            setIsModalOpen(false);
            setFormData({ name: "", price: 0, stock: 0, category: "General", description: "", imageUrl: "" });
            setImageFile(null);
            setEditingId(null);
            loadProducts(); // Refresh
        } catch (error) {
            console.error("Failed to save product", error);
            alert("Failed to save product");
        }
    };

    return (
        <DashboardLayout title="Product Catalog">
            <div className="p-8">
                {/* Header Action */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-white">Your Products</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsBulkModalOpen(true)}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Bulk Import
                        </button>
                        <button
                            onClick={handleAddClick}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Product
                        </button>
                    </div>
                </div>

                <BulkImportModal
                    isOpen={isBulkModalOpen}
                    onClose={() => setIsBulkModalOpen(false)}
                    onSuccess={() => {
                        loadProducts();
                        setIsBulkModalOpen(false);
                    }}
                />

                {/* List */}

                {/* Product List */}
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading products...</div>
                    ) : products.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="inline-block p-4 rounded-full bg-gray-800/50 mb-4">
                                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-white">No Products Yet</h3>
                            <p className="text-gray-500 mt-2">Start by adding your first product to the catalog.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-[#111] text-gray-200 uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Stock</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">
                                            <div className="flex items-center gap-4">
                                                {product.imageUrl ? (
                                                    <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded object-cover bg-gray-700" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-xs">No Img</div>
                                                )}
                                                <div>
                                                    <div>{product.name}</div>
                                                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">₹{product.price}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                                ${product.stock > 10 ? 'bg-green-500/10 text-green-400' :
                                                    product.stock > 0 ? 'bg-yellow-500/10 text-yellow-400' :
                                                        'bg-red-500/10 text-red-400'}`}>
                                                {product.stock} in stock
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{product.category}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => handleEditClick(product)}
                                                    className="text-indigo-400 hover:text-indigo-300"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (confirm('Delete product?')) {
                                                            await SellerService.deleteProduct(product.id);
                                                            loadProducts();
                                                        }
                                                    }}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Add/Edit Product Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg max-w-lg w-full p-6">
                            <h2 className="text-xl font-bold text-white mb-6">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Product Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:ring-indigo-500 focus:border-indigo-500"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Price (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Stock</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
                                            value={formData.stock}
                                            onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                                    <select
                                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>General</option>
                                        <option>Electronics</option>
                                        <option>Fahion</option>
                                        <option>Food</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                    <textarea
                                        required
                                        rows={3}
                                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Product Image</label>
                                    <div className="flex flex-col gap-2">
                                        {formData.imageUrl && !imageFile && (
                                            <div className="text-xs text-gray-500">Current image will be kept if no new file selected.</div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="w-full text-gray-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-indigo-400 hover:file:bg-gray-700"
                                            onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-gray-400 hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium"
                                    >
                                        {editingId ? 'Save Changes' : 'Add Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ProductsPage;
