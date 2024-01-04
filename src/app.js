import express from 'express';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import session from 'express-session'
import FileStore from 'session-file-store'
import MongoStore from 'connect-mongo'
import passport from 'passport'

import { __dirname } from './utils.js';
import productRouter from './dao/routes/products.routes.js';
import carts from './dao/routes/carts.routes.js';
import Carts from './dao/models/carts.models.js';
import path from 'path';
import productsModel from './dao/models/products.model.js';
import viewRouter from './dao/routes/products.views.routes.js';
import cartViews from './dao/routes/carts.views.routes.js';
import chatRouter from './dao/routes/chat.routes.js';
import ChatMessage from './dao/models/chat.models.js';
import usersRouter from './dao/routes/users.routes.js';
import ProfileController from './dao/controllers/profile.controller.js';
import registerRoutes from './dao/routes/register.routes.js';
import registerViews from './dao/routes/register.views.routes.js';
import sessionRoutes from './dao/routes/sessions.routes.js';




const chat_messages = []
const PORT = 8080;
const MONGOOSE = 'mongodb+srv://carrizo38:Parana149@cluster0.z2rdlx9.mongodb.net/ecomerce'

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
const fileStorage = FileStore(session)
const profileController = new ProfileController();


app.use(session({
   
    store: MongoStore.create({ mongoUrl: MONGOOSE, mongoOptions: {}, ttl: 60, clearInterval: 5000 }), // MONGODB
    secret: 'secretKeyAbc123',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())



app.use((req, res, next) => {
    res.locals.showNavbar = true; 
    next();
  });
  
  const auth = (req, res, next) => {
    try {
      if (req.session.user) {
        next();
      } else {
        res.status(401).send({ status: 'ERR', data: 'Usuario no autenticado' });
      }
    } catch (err) {
      res.status(500).send({ status: 'ERR', data: err.message });
    }
  };
  



app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')


app.use('/', viewRouter)
app.use('/', cartViews)
app.use('/', chatRouter)
app.use('/', registerViews)
app.get('/profile', profileController.showProfile);



app.use('/api/carts',carts)
app.use('/api/products', productRouter)
app.use('/api/users', usersRouter)
app.use('/api/sessions', sessionRoutes);
app.use('/api/register', registerRoutes); 
app.get('/profile', auth, profileController.showProfile);

  

try{
    await mongoose.connect(MONGOOSE)
    
    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`http://localhost:${PORT}`);
    });
 
    const io = new Server(server);
 
    io.on('connection', socket => {
        console.log('Conexión con Socket.io');


        const itemsPerPage = 10;
        socket.on('load', async ({ page }) => {
            try {
              const options = {
                limit: itemsPerPage,
                page,
                lean: true,
              };
        
              const products = await productsModel.paginate({}, options);
              const totalPages = Math.ceil(products.total / itemsPerPage);
        
              socket.emit('products', { products: products.docs, totalPages });
            } catch (error) {
              console.error('Error al obtener productos paginados:', error);
              socket.emit('error', { message: 'Error al obtener productos paginados' });
            }
          });
        
        
        socket.on('pageChanged', async newPage => {
            try {
                const options = {
                    limit: itemsPerPage,
                    page: newPage,
                    lean: true
                };
        
                const products = await productsModel.paginate({}, options);
                io.emit('products', products);
            } catch (error) {
                console.error('Error al obtener productos paginados:', error);
            }
        });
        

        socket.on('carts', async () => {
            const carts = await Carts.find();
            socket.emit('carts', carts);
        });

        socket.on('message', data => {
            chat_messages.push(data)
            io.emit('messageLogs', chat_messages)
        });
        socket.on('message', async data => {
            const chatMessage = new ChatMessage(data);
            await chatMessage.save();        
            socket.broadcast.emit('newMessage', data);

        });

        socket.on('addToCart', async data => {
            if (data.product) {
                cart.push(data.product);
                io.emit('cartUpdated', cart);
            } else if (data.productId) {
                const product = await controller.getProductById(data.productId);
                if (!product.error) {
                    cart.push(product);
                    io.emit('cartUpdated', cart);
                }
            }
        });
        
   

        
        
    });
 
 }catch(error){
     console.error("Error al conectar a la base de datos:", error.message)
}




app.get('*', (req, res) => {
    res.status(400).send(`<h1 style="color:red">Pagina no encontrada</h1>`)
});




