import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase.ts";

interface ProductForm {
    name: string;
    price: string;
    category: string;
    stock: string;
    description: string;
    image: string;
}

const AddProductForm = () => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<ProductForm>({
        name: "",
        price: "",
        category: "",
        stock: "",
        description: "",
        image: "",
    });
    // const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!auth.currentUser) {
            alert("User not authenticated");
            return;
        }

        if (!form.name || !form.price || !form.category || !form.stock || !form.image) {
            alert("Please fill all required fields");
            return;
        }

        setLoading(true);

        try {
            await addDoc(collection(db, "products"), {
                sellerId: auth.currentUser.uid,
                name: form.name,
                price: Number(form.price),
                stock: Number(form.stock),
                category: form.category,
                description: form.description,
                imageUrl: form.image,
                createdAt: Timestamp.now(),
            });

            alert("Product added successfully 🚀");

            setForm({
                name: "",
                price: "",
                category: "",
                stock: "",
                description: "",
                image: "",
            });
        } catch (error) {
            console.error("Firestore error:", error);
            alert("Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Add New Product</h1>
                    <p className="text-gray-400">Fill in the details to list your product</p>
                </div>

                {/* Form */}
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-8">
                    <div className="space-y-6">
                        {/* Product Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter product name"
                                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                                value={form.name}
                                onChange={handleChange}
                                autoComplete="off"
                            />
                        </div>

                        {/* Price and Stock */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
                                    Price ($) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="price"
                                    name="price"
                                    type="number"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                                    value={form.price}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                            </div>

                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-300 mb-2">
                                    Stock Quantity <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="stock"
                                    name="stock"
                                    type="number"
                                    placeholder="0"
                                    min="0"
                                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                                    value={form.stock}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="category"
                                name="category"
                                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                                value={form.category}
                                onChange={handleChange}
                            >
                                <option value="">Select a category</option>
                                <option value="Footwear">Footwear</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Accessories">Accessories</option>
                                <option value="Home & Living">Home & Living</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                                Product Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Describe your product..."
                                rows={4}
                                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all resize-none"
                                value={form.description}
                                onChange={handleChange}
                                autoComplete="off"
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Product Image <span className="text-red-500">*</span>
                            </label>

                            {form.image ? (
                                <div className="relative">
                                    <img
                                        src={form.image}
                                        alt="Preview"
                                        className="w-full h-64 object-cover rounded-lg border border-gray-700"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setForm((prev) => ({ ...prev, image: "" }));
                                        }}
                                        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            ): (
                                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer bg-black hover:bg-gray-900 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-12 h-12 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-400">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                                    </div>
                                    <input
                                        type="text"
                                        name="image"
                                        placeholder="Paste image URL"
                                        className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg"
                                        value={form.image}
                                        onChange={handleChange}
                                    />
                                </label>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-black"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Product...
                </span>
                            ) : (
                                "Add Product"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProductForm;