import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { z } from "zod";

const db = admin.firestore();

// Input Schema
const BulkImportSchema = z.object({
    products: z.array(z.object({
        name: z.string().min(1),
        price: z.number().positive(),
        stock: z.number().int().nonnegative(),
        category: z.string().optional().default('General'),
        description: z.string().optional().default(''),
        sku: z.string().optional(),
    })).max(500) // Firestore batch limit
});

export const bulkImportProducts = onCall({ cors: true }, async (request) => {
    // 1. Auth Check
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "User must be logged in.");
    }
    const { uid } = request.auth;

    // Check if seller (add claims check if strict)
    // if (request.auth.token.role !== 'seller') ...

    // 2. Validate Input
    const parseResult = BulkImportSchema.safeParse(request.data);
    if (!parseResult.success) {
        throw new HttpsError("invalid-argument", "Invalid product data", parseResult.error);
    }

    const { products } = parseResult.data;
    const batch = db.batch();
    const stats = { success: 0, failed: 0 };

    // 3. Prepare Batch
    products.forEach(product => {
        const docRef = db.collection("products").doc(); // Auto ID
        batch.set(docRef, {
            ...product,
            sellerId: uid,
            createdAt: Date.now(),
            // Basic search keywords or other metadata can be added here
        });
        stats.success++;
    });

    // 4. Commit
    try {
        await batch.commit();
        return {
            success: true,
            message: `Successfully imported ${stats.success} products.`,
            count: stats.success
        };
    } catch (error) {
        console.error("Bulk import failed", error);
        throw new HttpsError("internal", "Failed to commit batch import");
    }
});
