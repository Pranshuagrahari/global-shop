import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    getDocs,
    onSnapshot
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../services/firebase/firebase";
import type { IProduct, IOrder, ISellerProfile } from "../../../shared/types";

export const SellerService = {
    // --- Products ---
    getProductById: async (productId: string): Promise<IProduct | null> => {
        const docRef = doc(db, "products", productId);
        // const snapshot = await getDocs(query(collection(db, "products"), where("__name__", "==", productId)));
        // Ideally use getDoc(docRef), but let's stick to consistent pattern
        const d = await import("firebase/firestore").then(m => m.getDoc(docRef));
        if (d.exists()) {
            return { id: d.id, ...d.data() } as IProduct;
        }
        return null;
    },

    getProducts: async (sellerId: string): Promise<IProduct[]> => {
        const q = query(
            collection(db, "products"),
            where("sellerId", "==", sellerId)
        );
        const snapshot = await getDocs(q);
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IProduct));
        // Sort in memory to avoid index requirement
        return products.sort((a, b) => b.createdAt - a.createdAt);
    },

    addProduct: async (product: Omit<IProduct, "id" | "createdAt" | "sellerId">, sellerId: string, imageFile: File | null) => {
        let imageUrl = product.imageUrl;

        if (imageFile) {
            const storageRef = ref(storage, `products/${sellerId}/${Date.now()}_${imageFile.name}`);
            const uploadResult = await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(uploadResult.ref);
        }

        const docRef = await addDoc(collection(db, "products"), {
            ...product,
            imageUrl,
            sellerId,
            createdAt: Date.now(), // Use number for consistency with type
        });
        return docRef.id;
    },

    deleteProduct: async (productId: string) => {
        await deleteDoc(doc(db, "products", productId));
    },

    updateProduct: async (productId: string, updates: Partial<IProduct>, imageFile: File | null) => {
        let imageUrl = updates.imageUrl;

        if (imageFile) {
            // In a real app, delete old image if it exists to save space
            const storageRef = ref(storage, `products/${updates.sellerId}/${Date.now()}_${imageFile.name}`);
            const uploadResult = await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(uploadResult.ref);
        }

        const docRef = doc(db, "products", productId);
        await updateDoc(docRef, { ...updates, imageUrl, updatedAt: Date.now() });
    },

    // --- Orders ---
    // Returns an unsubscribe function
    subscribeToOrders: (sellerId: string, callback: (orders: IOrder[]) => void) => {
        const q = query(
            collection(db, "orders"),
            where("sellerId", "==", sellerId) // MVP: 1 Order = 1 Seller
        );

        return onSnapshot(q, (snapshot) => {
            const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IOrder));
            // Sort in memory
            const sortedOrders = orders.sort((a, b) => b.createdAt - a.createdAt);
            callback(sortedOrders);
        });
    },

    // --- Profile & Onboarding ---
    getProfile: async (uid: string): Promise<ISellerProfile | null> => {
        // In real app, seller profile might be in 'users' or separate 'sellers' collection
        // Assuming it's merged in 'users' for now based on previous AdminService
        const snapshot = await getDocs(query(collection(db, "users"), where("uid", "==", uid)));
        if (snapshot.empty) return null;
        return snapshot.docs[0].data() as ISellerProfile;
    },

    // Mock connecting to Razorpay
    connectRazorpay: async (uid: string) => {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, {
            razorpayAccountId: `acc_${Math.random().toString(36).substr(2, 9)}`,
            isVerified: true
        });
    }
};
