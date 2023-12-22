import { Router } from "express";
import {CartsController} from '../controllers/carts.controller.js'

const router = Router();
const controller = new CartsController();

router.get('/cart', async (req, res) => {
    const products = await controller.getProducts();
    res.render('carts', {
        title: 'Carrito de compras',
        rutaJs: 'carts',
        products,
    });
});

export default router;