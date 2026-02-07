import { z } from "zod";

// User Schemas
export const CreateUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    displayName: z.string().optional(),
});

// Seller Schemas
export const OnboardSellerSchema = z.object({
    businessName: z.string().min(3),
    businessAddress: z.string().optional(),
});

// Product Schemas
export const CreateProductSchema = z.object({
    name: z.string().min(1),
    price: z.number().min(0),
    stock: z.number().int().min(0),
    category: z.string().min(1),
    description: z.string().optional(),
    imageUrl: z.string().url(),
});

// Order Schemas
export const CreateOrderSchema = z.object({
    sellerId: z.string(),
    items: z.array(z.object({
        productId: z.string(),
        quantity: z.number().min(1),
    })).min(1),
});

// Helper type for validation error
export const formatZodError = (error: any) => {
    if (error instanceof z.ZodError) {
        return (error as any).errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
    }
    return 'Validation error';
};
