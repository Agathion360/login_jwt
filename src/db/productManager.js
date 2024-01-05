import fs from 'fs';


export default class ProductManager {

    constructor(path) {
        this.path = path
        this.products = []
        this.initProduct().catch(error => console.error("Error al inicializar el archivo:", error.message))
    }



//lectura de archivo products.json
async initProduct(){
    try {
        const productData = await fs.promises.readFile(this.path, 'utf-8') 
        this.products = JSON.parse(productData)
    } catch (error) {
        console.error("Error al leer el archivo:", error.message)
    }
    
}





async addProduct(product) {
    try {

        product.status = true;

         if (!product.title || !product.description || !product.price || !product.code || !product.stock) {
            console.log('Error, todos los campos son obligatorios');
            return;
        } else {
            const maxId = Math.max(...this.products.map(prod => prod.id));
            product.id = maxId + 1;

            this.products.push(product);
            console.log('Producto agregado correctamente');
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
        }
    } catch (error) {
        console.error("Error al agregar producto:", error.message);
    }
}


async getProducts() {
    try{
        return this.products

    }
    catch(error){
        console.error("Error al obtener la lista de productos:", error.message)
    }
}

async getProductsById(id) {
    try{
       return this.products.find(prod => prod.id === id)     
      }
      catch(error){
          console.error("Error al obtener la lista de productos:", error.message)
      }
  }
     

async updateProduct(id, product) {
    try {
        const index = this.products.findIndex(prod => prod.id === id)
        if (index === -1) {
            throw new Error("Producto no encontrado")
        }
        delete product.id; 
        this.products[index] = { ...this.products[index], ...product }
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
    } catch (error) {
        console.error("Error al actualizar el producto:", error.message)
    }
}

async deleteProduct(id) {
    try {
        const index = this.products.findIndex(prod => prod.id === id)
        if (index === -1) {
            throw new Error("Producto no encontrado")
        }
        this.products.splice(index, 1)
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
    } catch (error) {
        console.error("Error al eliminar el producto:", error.message)
    }
}


}