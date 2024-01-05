import CartsModel from '../models/carts.models.js';

export class CartsController {
    constructor() {}

    getCarts = async () => {
        try {
            const carts = await CartsModel.find().lean();
            return carts;
        } catch (err) {
            return { error: err.message };
        }
    }

    getCartById = async (cid) => {
        try {
            const cart = await CartsModel.findById(cid).lean();
            return cart === null ? { error: 'Carrito no encontrado' } : cart;
        } catch (err) {
            return { error: err.message };
        }
    }

    addCarts = async (products) => {
        try {
            const newCart = await CartsModel.create({ products });
            return { cartId: newCart._id, products: newCart.products };
        } catch (error) {
            return { error: error.message };
        }
    }

    addProductInCart = async (cartId, productId) => {
        try {
            const cart = await CartsModel.findById(cartId);
    
            if (!cart) {
                return { error: 'Carrito no encontrado' };
            }

            const existingProduct = cart.products.find(item => item._id.equals(productId._id));

            if (existingProduct) {
                existingProduct.quantity += productId.quantity;
            } else {
                cart.products.push({ _id: productId._id, quantity: productId.quantity });
            }

            const updatedCart = await cart.save();
            return { cartId: updatedCart._id, products: updatedCart.products };
        } catch (err) {
            return { error: err.message };
        }
    }


    //nuevas funcuones

    deleteProductFromCart = async (cid, pid) => {
        try {
            const updatedCart = await CartsModel.findByIdAndUpdate(
                cid,
                { $pull: { products: { _id: pid } } },
                { new: true }
            ).populate('products._id'); // Modificación: Agregar populate para traer productos completos
            return updatedCart === null ? { error: 'Carrito o producto no encontrado' } : updatedCart;
        } catch (err) {
            return { error: err.message };
        }
    }

    updateCart = async (cid, cart) => {
        try {
            const updatedCart = await CartsModel.findByIdAndUpdate(cid, cart, { new: true }).populate('products._id');
            return updatedCart === null ? { error: 'Carrito no encontrado' } : updatedCart;
        } catch (err) {
            return { error: err.message };
        }
    }

    updateProductQuantityInCart = async (cid, pid, quantity) => {
        try {
            const updatedCart = await CartsModel.findOneAndUpdate(
                { _id: cid, 'products._id': pid },
                { $set: { 'products.$.quantity': quantity } },
                { new: true }
            ).populate('products._id'); // Modificación: Agregar populate para traer productos completos
            return updatedCart === null ? { error: 'Carrito o producto no encontrado' } : updatedCart;
        } catch (err) {
            return { error: err.message };
        }
    }

    deleteAllProductsFromCart = async (cid) => {
        try {
            const updatedCart = await CartsModel.findByIdAndUpdate(cid, { $set: { products: [] } }, { new: true });
            return updatedCart === null ? { error: 'Carrito no encontrado' } : updatedCart;
        } catch (err) {
            return { error: err.message };
        }
    }

}


