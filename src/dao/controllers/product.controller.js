import productsModel from "../models/products.model.js"
import mongoose from "mongoose"


export class ProductController {

    constructor() {
       
    }


async addProduct(product) {
    try {
        await productsModel.create(product)
        return "Producto agregado correctamente"
           
    } catch (error) {
            return error.message
    }
}


async getProducts(limit, page, sort, email,role) {
    try {
        const options = this.buildPaginationOptions(limit, page, sort);

        const products = await productsModel.paginate({}, options);

        return {
            pagination: {
                total: products.totalDocs,
                pages: products.totalPages,
                currentPage: products.page,
                hasNextPage: products.hasNextPage,
                hasPrevPage: products.hasPrevPage,
                nextPage: products.nextPage,
                prevPage: products.prevPage,
            },
            products: products.docs,
            email: email || "",
            // role: req.session.user.role || "", 
            role: role || "", 

        };
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw new Error('Error al obtener productos');
    }
}





buildPaginationOptions(limit, page, sort) {
    const options = {
        limit: parseInt(limit, 10),
        page: parseInt(page, 10),
        lean: true,
    };

    if (sort && (sort.toLowerCase() === 'asc' || sort.toLowerCase() === 'desc')) {
        options.sort = { price: sort.toLowerCase() };
    }

    return options;
}




async getProductsById(id) {
    try{
        const product = await productsModel.findById(id).lean()
        return product === null ? { message: "Producto no encontrado" } : product;
    }
      catch(error){
        return error.message
    }
  }

  async addToCart(productId) {
    try {
        const product = await this.getProductById(productId);

        if (product.error) {
            return product; 
        }

        socket.emit('addToCart', { product });

        return { message: "Producto agregado al carrito" };
    } catch (error) {
        return { error: error.message };
    }
}
     

async updateProduct(id, product) {
    try {
     const productUpdated = await productsModel.findByIdAndUpdate(id, product)
    return productUpdated === null ? {error: "Producto no encontrado"} : productUpdated
    } catch (error) {
        return error.message
    }
}

async deleteProduct(id) {
    try {
        const productDeleted = await productsModel.findByIdAndDelete(id)
        return productDeleted === null ? {error: "Producto no encontrado"} : productDeleted
    } catch (error) {
        return error.message
    }
}


}