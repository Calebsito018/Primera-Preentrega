import { Router } from "express";
import cartManager from "../CartManager.js";

const router = Router();
//ruta get para todos los carritos
router.get("/", async(req, res) => {
    try {
        const allCarts = await cartManager.getAllCarts();
        if (!allCarts.length){
            return res.status(400).send({ message: "No cart found"})
        }
        res.status(200).json({ message:"carts", data: allCarts });
        return
    } catch (error) {
        res.status(500).json({error})
    }
})
//ruta get que muestra el carrito segun el id
router.get("/:cid", async(req, res) =>{
    const {cid} = req.params;
    if(!Number.isInteger(+cid)){
        return res.status(400).send( {messaje: "Invalid cart ID. Must be an integer"});
    }
    try {
        const cart = await cartManager.getCartById(+cid);
        if(!cart){
            return res.status(400).send({ message: "No cart found with that ID"});
        }
        res.status(200).json({ message:"Cart", cart});
    } catch (error) {
        res.status(500).json({error})
    }
})
// ruta post para crear un nuevo carrito
router.post("/", async(req, res) =>{
    try {
        const newCart = await cartManager.createCart(req.body);
        if(newCart === "ALL_FIELDS_ARE_REQUIRED"){
            return res.status(400).send({ message: "All fields are required"});
        }
        res.status(200).json({message: "Cart created successfully.", cart: newCart});
    } catch (error) {
        res.status(500).json({ error })
    }
})
//ruta post que agrega el producto al array del carrito seleccionado
router.post("/:cid/product/:pid", async(req, res) => {
    const {cid, pid} = req.params;
    if(!Number.isInteger(+cid) || !Number.isInteger(+pid)){
        return res.status(400).send({ message: "Invalid cart ID or product ID. Both must be integers."})
    }
    try {
        //check para ver si no existe el cart id dentro del Carts.json
        const allCarts = await cartManager.getAllCarts();
        const cart = allCarts.find(c => c.id === +cid);
        if(!cart){
            return res.status(400).send({message: "Cart ID not found"});
        };
        const addProduct = await cartManager.addProduct(+cid, +pid);
        return res.status(200).json({message: "Product added successfully", cart: addProduct});
        
    } catch (error) {
        res.status(500).json({error})
    }
})

export default router;