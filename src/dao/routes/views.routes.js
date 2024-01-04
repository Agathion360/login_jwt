import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js'
import { authToken } from '../../utils.js'
import {UserController} from '../controllers/user.controller.js'
import {CartsController} from '../controllers/carts.controller.js'



const router = Router()
const controller = new ProductController()
const userController = new UserController()
const cartController = new CartsController();



// PRODUCTS
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



// LOGIN
router.get('/login', async (req, res) => {
    res.locals.showNavbar = false

    if (req.session.user) {
        res.redirect('/profile')
    } else {
        res.render('login', { showNavbar: false })
    }
})




// router.get('/profile', async (req, res) => {
//     // Si el usuario tiene sesión activa, mostramos su perfil
//     if (req.session.user) {
//         res.render('profile', { user: req.session.user })
//     } else {
//         // sino volvemos al login
//         res.redirect('/login')
//     }
// })



// router.get('/profilejwt', authToken, async (req, res) => {
//     res.render('profile', { user: req.user })
// })


router.get('/profilejwt', authToken, async (req, res) => {
    // Verificar si req.user está definido
    if (!req.user) {
        return res.status(401).send({ status: 'ERR', data: 'Usuario no autorizado' });
    }

    // Verificar si la vista 'profile' existe
    try {
        res.render('profile', { user: req.user });
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: 'Error al renderizar la vista de perfil' });
    }
});


router.get('/register', async (req, res) => {
    res.render('register', {})
})

router.get('/restore', async (req, res) => {
    if (req.session.user) {
        res.redirect('/profile')
    } else {
        res.render('restore', {})
    }
})


//REGISTER
router.get('/register', (req, res) => {
    res.locals.showNavbar = false
    res.render('register');
  });

//CART
router.get('/cart', async (req, res) => {
    const products = await cartController.getProducts();
    res.render('carts', {
        title: 'Carrito de compras',
        rutaJs: 'carts',
        products,
    });
});


export default router;
