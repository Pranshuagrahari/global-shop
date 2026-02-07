import { collection, getDocs, query, orderBy, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

/* ---------- Product Type ---------- */
export interface Product {
    id: string;
    sellerId: string;
    name: string;
    price: number;
    stock: number;
    category: string;
    description: string;
    imageUrl: string;
    createdAt: Timestamp;
}

/* ---------- Fetch All Products ---------- */
export const fetchAllProducts = async (): Promise<Product[]> => {
    try {
        const productsRef = collection(db, "products");

        // Optional: order by latest
        const q = query(productsRef, orderBy("createdAt", "desc"));

        const snapshot = await getDocs(q);

        const products: Product[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Product, "id">),
        }));

        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

/* ---------- Add New Product ---------- */
export const addProduct = async (productData: Omit<Product, "id" | "createdAt">) => {
    try {
        const docRef = await addDoc(collection(db, "products"), {
            ...productData,
            createdAt: Timestamp.now(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding product:", error);
        throw error;
    }
};
