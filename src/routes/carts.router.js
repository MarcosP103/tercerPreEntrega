const express = require("express");
const router = express.Router();
const fs = require('fs').promises

router.post('/carts', async (req, res) => {
    try{
        const cartsData = await fs.readFile('../manager/cartsData.json')
        let carts = JSON.parse(cartsData)

        const newCartId = generateId()

        const newCart = {
            id: newCartId,
            products: req.body.products
        }

        carts.push(newCart)

        await fs.writeFile('cartsData.json', JSON.stringify(carts, null, 2))

        res.status(201).json({ message: 'Carrito creado correctamente.', cart: newCart})
    } catch (error){
        console.error(error)
        res.status(400).json({ error: 'Error al crear el carrito.'})
    }
}) 

function generateId() {
    return Math.random().toString(36).substring(2, 11)
}

router.get("/:cid", async (req, res) => {
    try{
        const cartsData = await fs.readFile('cartsData.json', 'utf8')
        const carts = JSON.parse(cartsData)

        const cartId = req.params.cid
        const cart = carts.find(cart => cart.id == cartId)

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado con ese Id.' })
        }

        res.status(200).json({ products: cart.products })
    } catch(error){
        console.error(error)
        res.status(500).json({ error: 'Error en el servidor' })
    }
})

router.post("/:cid/product/:pid", async(req, res) => {
    try {
        const cartsData = await fs.readFile('cartsData.json', 'utf8')
        const carts = JSON.parse(cartsData)

        const cartId = req.params.cid
        const cartIndex = carts.findIndex(cart => cart.id == cartId)

        if(cartIndex === -1) {
            return res.status(404).json({ error: 'Carrito no econtrado.' })
        }

        const productId = req.params.pid
        const quantity = req.body.quantity || 1

        const existProductIndex = carts[cartIndex].products.findIndex(product => product.id == productId)

        if (existProductIndex !== -1) {
            carts[cartIndex].products[existProductIndex].quantity += quantity
        } else {
            carts[cartIndex].products.push({ id: productId, quantity})
        }

        await fs.writeFile('cartsData.json', JSON.stringify(carts, null, 2))

        res.status(201).json({ message: 'Producto agregado al carrito correctamente.' })    
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al agregar el producto al carrito.' })
    }
})

module.exports = router