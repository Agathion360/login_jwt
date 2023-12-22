import { Router } from 'express'
import { ProductController } from '../controllers/product.controller.js'
import {UserController} from '../controllers/user.controller.js'

const router = Router()
const controller = new ProductController()
const userController = new UserController()


router.get('/products', async (req, res) => {

    const { limit, page, sort } = req.query;
    if (req.session.user) {
        try {
            const productsData = await controller.getProducts(limit, page, sort, req.session.user.username, req.session.user.role);

            res.locals.showNavbar = true
            res.render('products', {
                title: 'Listado de Productos',
                rutaJs: 'products',
                products: productsData.products,
                totalProducts: productsData.pagination.total,
                totalPages: productsData.pagination.pages,
                currentPage: productsData.pagination.currentPage,
                hasPrevPage: productsData.pagination.hasPrevPage,
                hasNextPage: productsData.pagination.hasNextPage,
                prevPage: productsData.pagination.prevPage,
                nextPage: productsData.pagination.nextPage,
                email: productsData.email,
                role: productsData.role,
            });
            

            
        } catch (err) {
            res.status(500).render('error', {
                message: 'Error al obtener productos',
                error: { status: 500 }
            });
        }
    } else {
        res.locals.showNavbar = false
        res.redirect('/login')
    }
});

router.get('/login', async (req, res) => {
    res.locals.showNavbar = false

    if (req.session.user) {
        res.redirect('/profile')
    } else {
        res.render('login', { showNavbar: false })
    }
})




export default router