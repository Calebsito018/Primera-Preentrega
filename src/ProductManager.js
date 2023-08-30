import fs from "fs"

class ProductManager {
    constructor() {
        this.path = "Products.json";
    }
    //consulto si existen productos y guardo en data, si no existe retorno array vacio
    async getProducts(limit) {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, "utf-8")
                let allProducts = JSON.parse(data);
                if(limit){
                    return allProducts.slice(0, limit);
                }else{
                    return allProducts;
                }
            }else{
                return [];
            }
        } catch (error) {
            return error
        }
    }
    //consulto y sobreescribo los productos con un id autoincrementable
    async addProduct( obj ) { 
        try {
            const productsPrev = await this.getProducts()
            const { title, description, price, code, stock, status = true, category } = obj;
            //valido que todos los campos sean obligatorios
            if (!title || !description || !price || !code || !stock || !category){
                return console.log("All fields are required")
            }
            //valido que no se repita el campo code
            const validateCode = productsPrev.find((product) => product.code === code);
            if (validateCode){
                return console.log("Product code already exists")
            }
            //asigno id autoincrementable
            let id
            if(!productsPrev.length){
                id = 1
            }else{
                id = productsPrev[productsPrev.length - 1].id +1
            }
            const newProduct = {...obj, status, id}
            productsPrev.push(newProduct)
            await fs.promises.writeFile(this.path,JSON.stringify(productsPrev));
            return newProduct
        } catch (error) {
            return error
        }
    }
    //Busco un producto por id y lo muestro como objeto
    async getProductById(id){
        try {
            const productsPrev = await this.getProducts()
            const productById = productsPrev.find((item) => item.id === id)
            if(!productById){
                return console.log("Id doesn't exists")
            }
            return productById
        } catch (error) {
            return error
        }
    }
    //busco un producto por id y lo actualizo sobreescribiendo sus campos
    async updateProduct(id, newDataObj){
        try {
            const productsPrev = await this.getProducts()
            const productIndex = productsPrev.findIndex((item)=>item.id === id)
            if(productIndex === -1){
                console.log("ID doesn't exists")
                return "ID_NOT_EXIST"
            }
            // Evito que se cambie el ID por metodo put
            if (newDataObj.hasOwnProperty('id') && newDataObj.id !== id) {
                console.log("Changing the ID is not allowed");
                return "ID_NOT_ALLOWED";
            }
            const product = productsPrev[productIndex]
            productsPrev[productIndex] = {...product, ...newDataObj}
            await fs.promises.writeFile(this.path, JSON.stringify(productsPrev))
        } catch (error) {
            return error
        }
    }
    //filtro por id generando un nuevo array de productos con el id solicitado
    async deleteProduct(id){
        try {
            const productsPrev = await this.getProducts()
            //busco el producto con el ID 
            const productIndex = productsPrev.findIndex((item) => item.id === id);
            // Si no se encuentra el producto devuelvo un mensaje
            if (productIndex === -1) {
                console.log("Product deletion unsuccessful. Product ID not found.")
                return "PRODUCT_NOT_FOUND"
            }
            //elimino el producto del array newDataProducts
            const newDataProducts = productsPrev.filter((item) => item.id !== id)
            // sobreescribo el archivo JSON con la nueva lista de productos
            await fs.promises.writeFile(this.path, JSON.stringify(newDataProducts))
            return console.log("Product deleted successfully");
        } catch (error) {
            return error
        }
    }
}
//productos y nueva data de prueba
const product1 = {
    title: "iphone 12 mini",
    description: "descripcion de producto",
    price: 500000,
    // thumbnail: "imagen001.jpg",
    code: "001",
    stock: 10,
    category: "smartphones"
}
const product2 = {
    title: "iphone 11 ",
    description: "descripcion de producto",
    price: 405000,
    // thumbnail: "image02.jpg",
    code: "002",
    stock: 20
}
const newData = {
    title: "celular"
}

//Para hacer las pruebas
async function prueba (){
    //
    const manager = new ProductManager("Products.json")
    // await manager.addProduct(product1)
    // const products = await manager.getProducts()
    // const products = await manager.getProductById(2)
    // console.log(products)
    // await manager.deleteProduct(1)
    // await manager.updateProduct(1, newData)

}
prueba()
const productManager = new ProductManager("Products.json")
export default productManager