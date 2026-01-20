import {useEffect, useState} from "react";
import {fetchAllProducts} from "../../firebase/product.service.ts";
import type {Timestamp} from "firebase/firestore";
import { auth } from "../../firebase/firebase.ts";

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    stock: number;
    imageUrl: string;
    sellerId: string;
    description: string;
    createdAt: Timestamp;
}

const AllProductPage = () => {
    const [product,setProducts] = useState<Product[]>([])
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await fetchAllProducts();

                if (!auth.currentUser) {
                    setProducts([]);
                    return;
                }

                const myProducts = response.filter(
                    (product) => product.sellerId === auth.currentUser!.uid
                );

                setProducts(myProducts);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        loadProducts();
    }, []);


    // const getStatusColor = (status: string) => {
    //     switch (status) {
    //         case "active":
    //             return "bg-green-500/20 text-green-400 border-green-500/30";
    //         case "draft":
    //             return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    //         case "outofstock":
    //             return "bg-red-500/20 text-red-400 border-red-500/30";
    //         default:
    //             return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    //     }
    // };
    //
    // const getStatusText = (status: string) => {
    //     switch (status) {
    //         case "active":
    //             return "Active";
    //         case "draft":
    //             return "Draft";
    //         case "outofstock":
    //             return "Out of Stock";
    //         default:
    //             return status;
    //     }
    // };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">All Products</h1>
                    <p className="text-gray-400">Manage your product inventory</p>
                </div>

                {/* Filters and Search */}
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                                />
                                <svg
                                    className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                            >
                                <option value="all">All Categories</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Footwear">Footwear</option>
                                <option value="Accessories">Accessories</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                                <option value="outofstock">Out of Stock</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-1">Total Products</div>
                        <div className="text-2xl font-bold">{product.length}</div>
                    </div>
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-1">Active</div>
                        <div className="text-2xl font-bold text-green-400">
                            {/*{product.filter(p => p.status === "active").length}*/}
                        </div>
                    </div>
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-1">Draft</div>
                        <div className="text-2xl font-bold text-yellow-400">
                            {/*{product.filter(p => p.status[1] === "draft").length}*/}
                        </div>
                    </div>
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-1">Out of Stock</div>
                        <div className="text-2xl font-bold text-red-400">
                            {/*{product.filter(p => p.status[2] === "outofstock").length}*/}
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {product.map((product) => (
                        <div
                            key={product.id}
                            className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all group"
                        >
                            {/* Product Image */}
                            <div className="relative h-48 bg-gray-900 overflow-hidden">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                  {/*              <div className="absolute top-3 right-3">*/}
                  {/*<span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.status[0])}`}>*/}
                  {/*  {getStatusText(product.status[0])}*/}
                  {/*</span>*/}
                  {/*              </div>*/}
                            </div>

                            {/* Product Info */}
                            <div className="p-5">
                                <div className="mb-3">
                                    <h3 className="text-lg font-semibold mb-1 line-clamp-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">{product.category}</p>
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-2xl font-bold text-white">
                                        ${product.price.toFixed(2)}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        Stock: <span className="font-semibold text-white">{product.stock}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium">
                                        Edit
                                    </button>
                                    <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                    <button className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State (if no products) */}
                {product.length === 0 && (
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-12 text-center">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No products found</h3>
                        <p className="text-gray-500 mb-6">Start by adding your first product</p>
                        <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium">
                            Add Product
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllProductPage;