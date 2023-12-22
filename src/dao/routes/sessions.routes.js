import { Router } from 'express'
import SessionsController from '../controllers/sessions.controller.js'
import RegisterController from '../controllers/register.controller.js';


const router = Router()
const sessionsController = new SessionsController();
const registerController = new RegisterController();


const auth = (req, res, next) => {
    try {
        if (req.session.user && req.session.user.admin === true) {
            next();
        } else {
            res.status(403).send({ status: 'ERR', data: 'Usuario no admin' });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message });
    }
};


router.get('/', async (req, res) => {
    try {
        if (req.session.visits) {
            req.session.visits++
            res.status(200).send({ status: 'OK', data: `Cantidad de visitas: ${req.session.visits}` })
        } else {
            req.session.visits = 1
            res.status(200).send({ status: 'OK', data: 'Bienvenido al site!' })
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})



router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error al destruir la sesión:', err);
            res.status(500).redirect('/'); 
        } else {
            res.redirect('/login'); 
        }
    });
});
  

router.get('/admin', auth, async (req, res) => {
    try {
        res.status(200).send({ status: 'OK', data: 'Estos son los datos privados' })
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})


router.post('/login', sessionsController.loginUser);
router.post('/register', registerController.registerUser);


export default router