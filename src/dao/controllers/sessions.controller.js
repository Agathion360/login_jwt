
import userModel from '../models/user.models.js';

class SessionsController {
  async registerUser(req, res) {
    try {
      const { first_name, last_name, email, age, password } = req.body;
     
      res.status(201).send({ status: 'OK', data: 'Usuario registrado correctamente' });
    } catch (err) {
      res.status(500).send({ status: 'ERR', data: err.message });
    }
  }


  async loginUser(req, res) {
    try {
      const { user, pass } = req.body;

      const foundUser = await userModel.findOne({ email: user, password: pass });

      if (foundUser) {
        req.session.user = { username: user, role: foundUser.role };
        res.redirect('/products');
      } else {
        res.status(401).send({ status: 'ERR', data: 'Datos no válidos' });
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err.message);
      res.status(500).send({ status: 'ERR', data: err.message });
    }
  }

  


  async logoutUser(req, res) {
    try {
      req.session.destroy((err) => {
        if (err) {
          res.status(500).send({ status: 'ERR', data: err.message });
        } else {
          res.redirect('/login'); 
        }
      });
    } catch (err) {
      res.status(500).send({ status: 'ERR', data: err.message });
    }
  }
}

export default SessionsController;
