import { toast } from "@/hooks/use-toast";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
    size: string;
    image: any;
    totalPrice: number;
    average_rating: number;
    brand: string;
    category: number;
    color: string;
    comments: Array<any>; // specify a structure if available for comments
    country: string;
    created_at: string;
    degree_of_extensibility: string;
    description: string;
    discount_price: number;
    firm: string;
    in_stock: boolean;
    is_discount: boolean;
    is_new_product: boolean;
    outer_diameter_of_the_head: string;
    reviews: Array<any>; // specify a structure if available for reviews
    size_of_brackets: string;
    the_height_of_the_closing_brackets: string;
    vendor_code: string;
    volume: string;
}

interface CartState {
    cart: Product[];
    totalPrice: number;
}

const initialState: CartState = {
    cart: [],
    totalPrice: 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addProduct: (state, action: PayloadAction<Product>) => {
            const existingProduct = state.cart.find(
                (item) =>
                    item.id === action.payload.id &&
                    item.size === action.payload.size
            );

            if (existingProduct) {
                existingProduct.quantity += action.payload.quantity;
                existingProduct.totalPrice =
                    existingProduct.price * existingProduct.quantity;
                toast({
                    variant: "success",
                    title: `Cart updated: ${action.payload.name}`,
                });
            } else {
                const newProduct = {
                    ...action.payload,
                    totalPrice: action.payload.totalPrice,
                };
                state.cart.push(newProduct);
                toast({
                    variant: "success",
                    title: `Product added: ${action.payload.name}`,
                });
            }

            state.totalPrice = calculateTotalPrice(state.cart);
        },
        increaseQuantity: (
            state,
            action: PayloadAction<{ id: number; size: string }>
        ) => {
            const product = state.cart.find(
                (item) =>
                    item.id === action.payload.id &&
                    item.size === action.payload.size
            );

            if (product) {
                product.quantity += 1;
                product.totalPrice = product.price * product.quantity;
            }

            state.totalPrice = calculateTotalPrice(state.cart);
        },
        decreaseQuantity: (
            state,
            action: PayloadAction<{ id: number; size: string }>
        ) => {
            const product = state.cart.find(
                (item) =>
                    item.id === action.payload.id &&
                    item.size === action.payload.size
            );

            if (product && product.quantity > 1) {
                product.quantity -= 1;
                product.totalPrice = product.price * product.quantity;
            } else if (product) {
                state.cart = state.cart.filter(
                    (item) =>
                        !(
                            item.id === action.payload.id &&
                            item.size === action.payload.size
                        )
                );
            }

            state.totalPrice = calculateTotalPrice(state.cart);
        },
        removeProduct: (
            state,
            action: PayloadAction<{ id: number; size: string }>
        ) => {
            state.cart = state.cart.filter(
                (item) =>
                    !(
                        item.id === action.payload.id &&
                        item.size === action.payload.size
                    )
            );
            toast({
                variant: "info",
                title: "Product removed from cart",
            });
            state.totalPrice = calculateTotalPrice(state.cart);
        },
        clearCart: (state) => {
            state.cart = [];
            state.totalPrice = 0;
            toast({
                variant: "warning",
                title: "Cart cleared",
            });
        },
    },
});

const calculateTotalPrice = (cart: Product[]) => {
    return cart.reduce(
        (total, product) => total + product.price * product.quantity,
        0
    );
};

export const {
    addProduct,
    increaseQuantity,
    decreaseQuantity,
    removeProduct,
    clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;