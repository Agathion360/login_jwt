import { Router } from 'express';

const router = Router();

router.get('/register', (req, res) => {
  res.locals.showNavbar = false
  res.render('register');
});

export default router;
