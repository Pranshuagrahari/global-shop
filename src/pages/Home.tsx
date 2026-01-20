import {Link} from "react-router-dom";

const Home = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            {/*<nav className="border-b border-gray-200 bg-white">*/}
            {/*    <div className="mx-auto max-w-7xl px-6">*/}
            {/*        <div className="flex h-20 items-center justify-between">*/}
            {/*            <div className="flex items-center space-x-2">*/}
            {/*                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">*/}
            {/*                    <span className="text-white font-bold text-lg">G</span>*/}
            {/*                </div>*/}
            {/*                <span className="text-2xl font-bold text-black">GlobalShop</span>*/}
            {/*            </div>*/}
            {/*            <div className="flex items-center space-x-4">*/}
            {/*                <button className="px-6 py-2.5 font-medium text-gray-700 hover:text-black transition-colors">*/}
            {/*                    Login*/}
            {/*                </button>*/}
            {/*                <button className="px-6 py-2.5 font-medium text-white bg-black rounded hover:bg-gray-800 transition-colors">*/}
            {/*                    Start free trial*/}
            {/*                </button>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</nav>*/}

            {/* Hero Section */}
            <div className="mx-auto max-w-7xl px-6 py-24">
                <div className="text-center mb-20">
                    <h1 className="text-7xl font-bold text-black mb-8 leading-tight">
                        The multi-vendor<br />marketplace for<br />entrepreneurs
                    </h1>
                    <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
                        Register your shop, list unlimited products, and grow your business.<br />
                        Join thousands of shop owners already selling on GlobalShop.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button className="px-8 py-4 text-lg font-medium text-white bg-black rounded hover:bg-gray-800 transition-colors">
                            Start selling today →
                        </button>
                        <Link to="/dashboard" className="px-8 py-4 text-lg font-medium text-black border-2 border-black rounded hover:bg-gray-50 transition-colors">
                            View demo
                        </Link>
                    </div>
                </div>

                {/* Feature Image/Poster */}
                <div className="mb-32">
                    <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-2xl p-1 shadow-2xl">
                        <div className="bg-black rounded-xl p-12 text-white">
                            <div className="grid grid-cols-3 gap-8 mb-8">
                                <div>
                                    <div className="text-5xl font-bold mb-2">5,000+</div>
                                    <div className="text-gray-400 text-lg">Active Shops</div>
                                </div>
                                <div>
                                    <div className="text-5xl font-bold mb-2">50K+</div>
                                    <div className="text-gray-400 text-lg">Products Listed</div>
                                </div>
                                <div>
                                    <div className="text-5xl font-bold mb-2">$2M+</div>
                                    <div className="text-gray-400 text-lg">Revenue Generated</div>
                                </div>
                            </div>
                            <div className="h-48 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-white/10"></div>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
                    <div>
                        <div className="w-14 h-14 bg-black rounded-lg flex items-center justify-center mb-6">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-black mb-4">Lightning fast setup</h3>
                        <p className="text-lg text-gray-600">Get your shop online in minutes. No technical knowledge required.</p>
                    </div>

                    <div>
                        <div className="w-14 h-14 bg-black rounded-lg flex items-center justify-center mb-6">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-black mb-4">Powerful analytics</h3>
                        <p className="text-lg text-gray-600">Track sales, monitor performance, and grow your business with data.</p>
                    </div>

                    <div>
                        <div className="w-14 h-14 bg-black rounded-lg flex items-center justify-center mb-6">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-black mb-4">Secure & reliable</h3>
                        <p className="text-lg text-gray-600">Bank-level security with 99.9% uptime guarantee.</p>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-black rounded-2xl p-16 text-center text-white">
                    <h2 className="text-5xl font-bold mb-6">Ready to start selling?</h2>
                    <p className="text-xl text-gray-400 mb-10">Join thousands of entrepreneurs building their business with GlobalShop</p>
                    <button className="px-10 py-4 text-lg font-medium text-black bg-white rounded hover:bg-gray-100 transition-colors">
                        Start your free trial →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;