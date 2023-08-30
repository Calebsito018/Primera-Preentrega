import { Router } from "express";
import productManager from "../ProductManager.js";

const router = Router()

//mostrar todos los productos o cantidad por limit
router.get("/",async(req, res) =>{
    const limit = req.query.limit;
    if(!Number.isInteger(+limit)){
        return res.status(400).send({ message: "Invalid limit. Must be an integer"});
    }
    try {
        const products = await productManager.getProducts(limit);
        if(!products.length){
            return res.status(404).send({ message: "Products not found"});
        };
        res.status(200).json({ message:"products", products});
    } catch (error) {
        res.status(500).json({error});
    }
})
//mostrar productos por id
router.get("/:pid",async(req, res) =>{
    const {pid} = req.params;
    if(!Number.isInteger(+pid)){
        return res.status(400).send({ message: "Invalid product ID. Must be an integer"})
    }
    try {
        const product = await productManager.getProductById(+pid);
        if(!product){
            return res.status(404).send({ message: "Product not found"});
        };
        res.status(200).json({ message:"product", product});
    } catch (error) {
        res.status(500).json({error});
    }
})
//agregar un nuevo producto
router.post("/",async(req, res) =>{
    const {title, description, price, code, category } = req.body
    if(!title || !description || !price || !code || !category){
        return res.status(400).send({ message: "All fields are required"});
    }
    if(typeof code !== "string" || code === ""){
        return res.status(400).send({ message: "Code must be a string"})
    }
    try {
        const newProduct = await productManager.addProduct(req.body)
        res.status(200).json({ message:"Product added successfully.", newProduct})
    } catch (error) {
        res.status(500).json({error})
    }
})
//actuaizar producto por id
router.put("/:pid",async(req, res)=>{
    const {pid} = req.params;
    const {title, description, price, category} = req.body;
    if(!title || !description || !price || !category){
        return res.status(400).send({ message: "All fields are required"});
    }
    if(!Number.isInteger(+pid)){
        return res.status(400).send({ message: "Invalid product ID. Must be an integer"});
    }
    try {
        const productUpdate = await productManager.updateProduct(+pid, req.body);
        if(productUpdate === "ID_NOT_EXIST"){
            return res.status(404).send({message: "ID doesn't exist"});
        };
        if(productUpdate === "ID_NOT_ALLOWED"){
            return res.status(401).send({message: "Changing the ID is not allowed"});
        };
        res.status(200).json({message: "Product updated successfully."});
    } catch (error) {
        res.status(500).json({error});
    }
})
// eliminar producto por id
router.delete("/:pid",async(req, res) =>{
    const {pid} = req.params
    if(!Number.isInteger(+pid)){
        return res.status(400).send({ message: "Invalid product ID. Must be an integer"})
    }
    try {
        const response = await productManager.deleteProduct(+pid)
        if(response === "PRODUCT_NOT_FOUND"){
            return res.status(404).send({ message: "Product deletion unsuccessful. Product ID not found."})
        }
        res.status(200).json({ message:"Product deleted successfully"})
    } catch (error) {
        res.status(500).json({error})
    }
})

export default router;