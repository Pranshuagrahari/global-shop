import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react"

/* ---------------- TYPES ---------------- */
interface Product {
    id: string;
    name: string;
    price: string;
    desc: string;
    image: string;
}

/* ---------------- DATA ---------------- */
const products: Product[] = [
    {
        id: "prod_001",
        name: "Cyber Keyboard",
        price: "₹8,499",
        desc: "Mechanical RGB Board with tactile switches.",
        image:
            "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: "prod_002",
        name: "Instant Cam",
        price: "₹12,999",
        desc: "Retro Analog Series for vintage photography.",
        image:
            "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: "prod_003",
        name: "Leather Bag",
        price: "₹4,500",
        desc: "Handcrafted Minimalist genuine leather.",
        image:
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: "prod_004",
        name: "Smart Watch",
        price: "₹18,000",
        desc: "Next-gen Health Tracker with OLED display.",
        image:
            "https://images.unsplash.com/photo-1544117518-30dd0f7358a2?auto=format&fit=crop&w=400&q=80",
    },
];

const BASE_URL = `${window.location.origin}${window.location.pathname}`;

/* ---------------- COMPONENT ---------------- */
const QrCodesPage: React.FC = () => {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        const checkId = () => {
            const hash = window.location.hash;
            let foundId: string | null = null;

            if (hash.includes("productId=")) {
                foundId = hash.split("productId=")[1];
                localStorage.setItem("active_scan", foundId);
                window.history.replaceState(null, "", window.location.pathname);
            }

            if (!foundId) {
                foundId = localStorage.getItem("active_scan");
            }

            if (foundId) {
                const product = products.find((p) => p.id === foundId);
                if (product) setSelectedProduct(product);
            }
        };

        checkId();
        window.addEventListener("hashchange", checkId);
        return () => window.removeEventListener("hashchange", checkId);
    }, []);

    const handleReset = (): void => {
        localStorage.removeItem("active_scan");
        setSelectedProduct(null);
        window.location.hash = "";
    };

    return (
        <div style={styles.container}>
            <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.6); }
          70% { box-shadow: 0 0 0 12px rgba(99, 102, 241, 0); }
          100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
        }
        @keyframes glow {
          0% { filter: brightness(1); box-shadow: 0 0 0 rgba(99, 102, 241, 0.5); }
          50% { filter: brightness(1.2); box-shadow: 0 0 15px rgba(99, 102, 241, 0.8); }
          100% { filter: brightness(1); box-shadow: 0 0 0 rgba(99, 102, 241, 0.5); }
        }
        @keyframes fadeUpIn {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }
        .qr-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          animation: fadeUpIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>

            <main style={styles.main}>
                {!selectedProduct ? (
                    <div style={styles.grid}>
                        {products.map((p, i) => (
                            <div
                                key={p.id}
                                className="qr-card"
                                style={{
                                    ...styles.glassCard,
                                    animationDelay: `${i * 0.15}s`,
                                }}
                            >
                                <div style={styles.qrContainer}>
                                    <QRCodeCanvas
                                        value={`${BASE_URL}#productId=${p.id}`}
                                        size={160}
                                        fgColor="#312e81"
                                        level="H"
                                        includeMargin
                                    />
                                </div>
                                <div style={styles.productName}>{p.name}</div>
                                <div style={styles.idLabel}>ID: {p.id}</div>
                                <div style={styles.productPrice}>{p.price}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={styles.productCard}>
                        <img
                            src={selectedProduct.image}
                            alt={selectedProduct.name}
                            style={styles.prodImage}
                        />
                        <div style={styles.cardContent}>
                            <div style={styles.statusBadge}>✓ Product Verified</div>
                            <h1 style={styles.prodTitle}>{selectedProduct.name}</h1>
                            <p style={styles.prodDesc}>{selectedProduct.desc}</p>
                            <div style={styles.priceTag}>{selectedProduct.price}</div>
                            <button style={styles.btn} onClick={handleReset}>
                                Scan New Item
                            </button>
                        </div>
                    </div>
                )}
            </main>

        </div>
    );
};

/* ---------------- STYLES ---------------- */
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        minHeight: "100vh",
        backgroundColor: "#050505",
        color: "#fff",
        fontFamily: "Inter, sans-serif",
    },
    header: {
        padding: "25px",
        textAlign: "center",
    },
    bannerTitle: {
        fontWeight: 900,
        letterSpacing: "6px",
    },
    main: {
        padding: "40px 20px",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "30px",
    },
    glassCard: {
        padding: "30px",
        borderRadius: "28px",
        textAlign: "center",
    },
    qrContainer: {
        background: "#fff",
        padding: "10px",
        borderRadius: "16px",
    },
    productName: { marginTop: "15px" },
    idLabel: { fontSize: "0.75rem" },
    productPrice: { fontWeight: "bold" },
    productCard: {
        maxWidth: "400px",
        margin: "auto",
    },
    prodImage: {
        width: "100%",
        height: "250px",
        objectFit: "cover",
    },
    cardContent: {
        padding: "30px",
        textAlign: "center",
    },
    statusBadge: {
        fontSize: "0.7rem",
    },
    prodTitle: {
        fontSize: "1.8rem",
    },
    prodDesc: {
        color: "#9ca3af",
    },
    priceTag: {
        fontSize: "1.6rem",
    },
    btn: {
        padding: "16px",
        borderRadius: "15px",
        cursor: "pointer",
    },
    footer: {
        padding: "25px",
        textAlign: "center",
    },
};

export default QrCodesPage;
