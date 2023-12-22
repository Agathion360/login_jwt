import fs from 'fs';
import ProductManager from './productManager.js';

export default class Carts {
  constructor(pathToJSON) {
    this.path = pathToJSON;
    this.productManager = new ProductManager('./src/json/productos.json');
  }

  async generateCartId() {
    try {
      const carts = await this.initCart();
      if (carts.length === 0) {
        return 1;
      }
      const lastCart = carts[carts.length - 1];
      return lastCart.id + 1;
    } catch (error) {
      console.error("Error al generar el id del carrito:", error.message);
    }
  }

  async initCart() {
    try {
      if (!fs.existsSync(this.path)) {
        fs.writeFileSync(this.path, JSON.stringify([]));
      }
      const cartData = await fs.promises.readFile(this.path, 'utf-8');
      const cart = JSON.parse(cartData);
      return cart;
    } catch (error) {
      console.error("Error al leer el archivo:", error.message);
      return [];
    }
  }

  async getCarts() {
    try {
      const carts = await this.initCart();
      return carts;
    } catch (error) {
      console.error("Error al obtener la lista de carritos:", error.message);
      return [];
    }
  }

  async exist(cid) {
    try {
      const cart = await this.initCart();
      const findCart = cart.find(cart => cart.id === cid);
      return findCart ? true : false;
    } catch (error) {
      console.error("Error al buscar el carrito:", error.message);
      return false;
    }
  }

  async writeCart(cart) {
    try {
      const write = await fs.promises.writeFile(this.path, JSON.stringify(cart, null, 2));
      return write;
    } catch (error) {
      console.error("Error al escribir el carrito:", error.message);
    }
  }

  async getCartById(cid) {
    try {
      const cart = await this.initCart();
      const findCart = cart.find(cart => cart.id === cid);
      return findCart || null;
    } catch (error) {
      console.error("Error al buscar el carrito:", error.message);
      return null;
    }
  }

  async addCart() {
    try {
      const oldcarts = await this.initCart();
      const newId = await this.generateCartId();
      
      const newCart = {
        id: newId,
        products: []
      };
      
      await this.writeCart([...oldcarts, newCart]);
      return newCart;
    } catch (error) {
      console.error("Error al agregar el carrito:", error.message);
    }
  }


async addProductInCart(cid, pid, quantity) {
  try {
    const cart = await this.initCart();
    const findCart = cart.find(cart => cart.id === cid);
    
    if (!findCart) {
      return null;
    }

    const findProductIndex = findCart.products.findIndex(product => product.product === pid);

    if (findProductIndex !== -1) {
      findCart.products[findProductIndex].quantity += 1;
    } else {
      findCart.products.push({ product: pid, quantity: 1 });
    }

    await this.writeCart(cart);
    return findCart;
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error.message);
    return null;
  }
}






}
