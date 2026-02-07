import QRCode from 'qrcode';
import type { IProduct } from '../shared/types';
import { ProductService } from '../features/products/services/product.service';

/**
 * Generate a single QR Data URL
 */
export const generateQRDataUrl = async (text: string): Promise<string> => {
    try {
        return await QRCode.toDataURL(text, {
            errorCorrectionLevel: 'H',
            margin: 1,
            width: 300
        });
    } catch (err) {
        console.error("QR Generation failed", err);
        throw err;
    }
};

/**
 * Generate Batch QR Data URLs for a Product
 * Useful for generating a printable sheet
 */
export const generateProductQRBatch = async (product: IProduct, count: number = 30): Promise<string[]> => {
    // Generate the static SKU-based URL
    // Note: We use the same URL for all items because it's SKU-based!
    // The previous prompt asked for SKU-based static QRs.
    // So we just generate the same QR 'count' times? 
    // Yes, for the printable sheet.

    const qrValue = ProductService.generateQRValue(
        product.sellerId,
        product.sku || product.id,
        product.price,
        product.variantId
    );

    const dataUrl = await generateQRDataUrl(qrValue);

    // Return array of same Data URL (optimization: frontend can just repeat one image)
    return Array(count).fill(dataUrl);
};
