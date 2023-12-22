import { Router } from 'express';
import { CartsController } from '../controllers/carts.controller.js';

const cartsRouter = Router();
const cartController = new CartsController();

cartsRouter.post('/', async (req, res) => {
    try {
        const newCart = await cartController.addCarts(req.body.products);
        return res.status(200).send({ status: 'OK', data: newCart });
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message });
    }
});

cartsRouter.get('/', async (req, res) => {
    try {
        const carts = await cartController.getCarts();
        return res.status(200).send({ status: 'OK', data: carts });
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message });
    }
});

cartsRouter.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const foundCart = await cartController.getCartById(cid);
        return res.status(200).send({ status: 'OK', data: foundCart });
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message });
    }
});

cartsRouter.post('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;

        const result = await cartController.addProductInCart(cartId, { _id: productId, quantity });
        return res.status(200).send({ status: 'OK', data: result });
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message });
    }
});

//nuevas rutas
cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartController.deleteProductFromCart(cid, pid);
        const status = updatedCart.error ? 'Error' : 'Success';
        res.status(status === 'Success' ? 200 : 404).send({ status, data: updatedCart });
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message });
    }
});

cartsRouter.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = req.body;
        const updatedCart = await cartController.updateCart(cid, cart);
        const status = updatedCart.error ? 'Error' : 'Success';
        res.status(status === 'Success' ? 200 : 404).send({ status, data: updatedCart });
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message });
    }
});

cartsRouter.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const quantity = parseInt(req.body.quantity);
        const updatedCart = await cartController.updateProductQuantityInCart(cid, pid, quantity);
        const status = updatedCart.error ? 'Error' : 'Success';
        res.status(status === 'Success' ? 200 : 404).send({ status, data: updatedCart });
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message });
    }
});

cartsRouter.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const updatedCart = await cartController.deleteAllProductsFromCart(cid);
        const status = updatedCart.error ? 'Error' : 'Success';
        res.status(status === 'Success' ? 200 : 404).send({ status, data: updatedCart });
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message });
    }
});


export default cartsRouter;
