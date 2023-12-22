// import userModels from "../models/user.models";

// class RegisterController {
//     async registerUser(req, res) {
//       try {
//         const { first_name, last_name, email, age, password } = req.body;
  
  
//         res.status(201).send({ status: 'OK', data: 'Usuario registrado correctamente' });
//       } catch (err) {
//         res.status(500).send({ status: 'ERR', data: err.message });
//       }
//     }
//   }
  
//   export default RegisterController;
  
import userModel from '../models/user.models.js';

class RegisterController {
  constructor() {}

  async registerUser(req, res) {
    try {
      const { first_name, last_name,gender, email, age, password } = req.body;

      const existingUser = await userModel.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ status: 'ERR', data: 'El usuario ya existe' });
      }

      const newUser = new userModel({
        first_name,
        last_name,
        gender,
        email,
        age,
        password,

      });

      await newUser.save();

      res.status(201).json({ status: 'OK', data: 'Usuario registrado exitosamente' });
    } catch (error) {
      console.error('Error al registrar usuario:', error.message);
      res.status(500).json({ status: 'ERR', data: 'Error interno del servidor' });
    }
  }
}

export default RegisterController;
