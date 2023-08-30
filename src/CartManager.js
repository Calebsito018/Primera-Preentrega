import fs from 'fs';

class CartManager{
    constructor(){
        this.path = "Carts.json"
    }
    //metodo para obtener todos los Carts y guardarlos en data, sino existe retorna un array vacio
    async getAllCarts(){
        try {
            if(fs.existsSync(this.path)){
                const data = await fs.promises.readFile(this.path, "utf8");
                return JSON.parse(data);
            }else{
                return [];
            }
        } catch (error) {
            return error
        }
    }
    //metodo para mostrar un cart en especifico
    async getCartById(id){
        try {
            const dataPrev = await this.getAllCarts();
            const cartById = dataPrev.find(el => el.id === id);
            if(!cartById){
                console.log("No cart found with that ID")
                return null;
            }
            if(!cartById.products.length){
                console.log("No products in cart");
            }
            return cartById
        } catch (error) {
            return error
        }
    }
    //metodo para crear nuevos carritos
    async createCart(cartData){
        try {
            const { products } = cartData;
            if(!Array.isArray(products)){
                console.log("All fields are required")
                return "ALL_FIELDS_ARE_REQUIRED"
            }   
            const dataPrev = await this.getAllCarts();
            let id
            if(!dataPrev.length){
                id = 1
            }else{
                id = dataPrev[dataPrev.length - 1].id +1
            }
            const newCart = { products: [], id };
            dataPrev.push(newCart);
            await fs.promises.writeFile(this.path, JSON.stringify(dataPrev));
            return newCart;
        } catch (error) {
            return error
        }
    }
    //metodo para agregar productos en el carrito mediante id
    async addProduct(idCart, idProduct){
        try {
            const allCarts = await this.getAllCarts();
            const cart = allCarts.find(c => c.id === idCart)
            const productIndex = cart.products.findIndex(el => el.product === idProduct);
            if(productIndex === -1){
                cart.products.push({product: idProduct, quantity: 1});
            }else{
                cart.products[productIndex].quantity++;
            }
            await fs.promises.writeFile(this.path, JSON.stringify(allCarts));
            return cart
        } catch (error) {
            return error
        }
    }
}

const cartManager = new CartManager("Carts.json");
export default cartManager;