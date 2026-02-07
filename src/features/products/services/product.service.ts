import { functions } from "../../../services/firebase/firebase";
import { httpsCallable } from "firebase/functions";
import type { IProduct, IBatchUploadStats } from "../../../shared/types";

export const ProductService = {
    /**
     * Bulk Upload Products via Cloud Function
     */
    uploadBulkProducts: async (products: Partial<IProduct>[]): Promise<IBatchUploadStats> => {
        const bulkImport = httpsCallable(functions, 'v1-products-products-bulkImportProducts');
        // Function expects "products: []"
        const result = await bulkImport({ products });
        return result.data as IBatchUploadStats;
    },

    /**
     * Generate Static QR Value (SKU Based)
     * Format: https://app.pay/scan?s={sellerId}&p={sku|productId}&v={variant}
     */
    generateQRValue: (sellerId: string, productId: string, amount: number = 0, variantId?: string) => {
        const baseUrl = window.location.origin + "/pay";
        const params = new URLSearchParams({
            s: sellerId,
            p: productId, // Treat ID as SKU for now if SKU not separate
        });

        if (variantId) params.append('v', variantId);
        if (amount > 0) params.append('a', amount.toString());

        return `${baseUrl}?${params.toString()}`;
    }
};
