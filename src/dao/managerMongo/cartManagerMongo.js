import cartModel from '../models/carts.model.js'
import productModel from '../models/products.model.js'

class CartManagerMongoose {
    async createCart() {
        try {
            const newCart = new cartModel({ products: [] })
            await newCart.save()
            console.log("Carrito crado correctamente")
            return newCart
        } catch (error) {
            console.error("Error al crear el carrito: ", error)
            throw error
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await cartModel.findById(cartId)
            if (!cart) {
                console.error("Carrito no encontrado por ID: ", cartId)
                return null
            }

            const product = await productModel.findById(productId)
            if (!product) {
                console.error("Producto no encontrado por ID: ", productId)
                return null
            }

            const productInCart = cart.products.find((item) => item.productId.equals(productId))
            if (productInCart) {
                productInCart.quantity += quantity
            } else {
                cart.products.push({ productId, quantity })
            }

            await cart.save()
            console.log("Producto agregado al carrito correctamente")
            return cart
        } catch (error) {
            console.error("Error al agregar el producto al carrito: ", error)
            throw error
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await cartModel.findById(cartId).populate("products.productId").lean()
            if (!cart) {
                console.error("Carrito no encontrado por ID: ", error)
                return null
            }
            return cart
        } catch (error) {
            console.error("Error al obtener el carrito por ID: ". error)
            throw error
        }
    }

    async updateCart(cartId, products) {
        try {
            const cart = await cartModel.findById(cartId)
            if (!cart) {
                console.error("Carrito no encontrado por ID: ", cartId)
                return null
            }

            cart.products = products
            await cart.save()
            console.log("Carrito actualizado correctamente")
            return cart
        } catch (error) {
            console.error("Error al actualizar el carrito: ", error)
            throw error
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await cartModel.findById(cartId)
            if (!cart) {
                console.error("Carrito no encontrado por ID: ", cartId)
                return null
            }

            const productInCart = cart.products.find((item) => item.productId.equals(productId))
            if (!productInCart) {
                console.error("Producto no encontrado en el carrito: ", productId)
                return null
            }

            productInCart.quantity = quantity
            await cart.save()
            console.log("Cantidad del producto actualizada correctamente")
            return cart
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carrito: ", error)
            throw error
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId)
            if (!cart) {
                console.error("Carrito no encontrado por ID: ", cartId)
                return null
            }

            cart.products = cart.products.filter((item) => !item.productId.equals(productId))
            await cart.save()
            console.log("Producto eliminado del carrito correctamente")
            return cart
        } catch (error) {
            console.error("Error al eliminar el producto del carrito: ", error)
            throw error
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await cartModel.findById(cartId)
            if (!cart) {
                console.error("Carrito no encontrado por ID: ", cartId)
                return null
            }

            cart.products = []
            await cart.save()
            console.log("Carrito vaciado correctamente")
            return cart
        } catch (error) {
            console.error("Erro al vaciar el carrito: ", error)
            throw error
        }
    }
}

export default CartManagerMongoose