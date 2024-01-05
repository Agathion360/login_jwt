import { Router } from 'express';
import { authToken } from '../utils.js'
import { ProductController } from '../controllers/product.controller.js'
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

//USER
router.get('/users', async (req, res) => {
    if (req.session.user && req.session.user.admin === true) {
        const data = await userController.getUsersPaginated(req.query.page || 1, req.query.limit || 50)
        
        
        data.pages = []
        for (let i = 1; i <= data.totalPages; i++) data.pages.push(i)

        res.render('users', {
            title: 'Listado de USUARIOS',
            data: data
        })
    } else if (req.session.user) {
        // Si hay un usuario logueado pero no es admin
        res.redirect('/profile')
    } else {
        // caso contrario volvemos al login
        res.redirect('/login')
    }
})

// LOGIN
router.get('/login', async (req, res) => {
    res.locals.showNavbar = false
    
    if (req.session.user) {
        res.redirect('/profile')
    } else {
        res.render('login', {})
    }
})


router.get('/profile', async (req, res) => {
    

    if (req.session.user) {
        res.render('profile', { user: req.session.user })
    } else {
        // sino volvemos al login
        res.redirect('/login')
    }
})



// Ruta de perfil
router.get('/profilejwt', authToken, async (req, res) => {
    try {
        res.render('profile', { user: req.user });
    } catch (error) {
        console.error('Error al renderizar la página de perfil:', error);
        res.status(500).send('<h1>Error interno del servidor</h1>');
    }
});



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
    const products = await cartController.getCarts();
    res.render('carts', {
        title: 'Carrito de compras',
        rutaJs: 'carts',
        products,
    });
});


export default router;
