import cartModel from '../models/carts.model.js'
import productModel from '../models/products.model.js'
import userModel from '../models/user.model.js'
import { sendProductAdded } from '../../services/mail.service.js'


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

    async addProductToCart(cid, pid, quantity) {
        try {
            const cart = await cartModel.findById(cid)
            if (!cart) {
                console.error("Carrito no encontrado por ID: ", cid)
                return null
            }

            const product = await productModel.findById(pid)
            if (!product) {
                console.error("Producto no encontrado por ID: ", pid)
                return null
            }

            const productInCart = cart.products.find((item) => item.productId.equals(pid))
            if (productInCart) {
                productInCart.quantity += quantity
            } else {
                cart.products.push({ productId: pid, quantity })
            }

            await cart.save()
            console.log("Producto agregado al carrito correctamente")

            const user = await userModel.findOne({ cid: cart._id })

            if (user) {
                await sendProductAdded(user.email, {
                    title: product.title,
                    description: product.description,
                    price: product.price,
                    quantity: quantity
                })
            }
            
            return cart
        } catch (error) {
            console.error("Error al agregar el producto al carrito: ", error)
            throw error
        }
    }

    async getCartById(cid) {
        try {
            const cart = await cartModel.findById(cid).populate("products.pid").lean()
            if (!cart) {
                console.error("Carrito no encontrado por ID: ", cid)
                return null
            }
            return cart
        } catch (error) {
            console.error("Error al obtener el carrito por ID: ". error)
            throw error
        }
    }

    async updateCart(cid, products) {
        try {
            const cart = await cartModel.findById(cid)
            if (!cart) {
                console.error("Carrito no encontrado por ID: ", cid)
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

    async updateProductQuantity(cid, pid, quantity) {
        try {
            const cart = await cartModel.findById(cid)
            if (!cart) {
                console.error("Carrito no encontrado por ID: ", cid)
                return null
            }

            const productInCart = cart.products.find((item) => item.pid.equals(pid))
            if (!productInCart) {
                console.error("Producto no encontrado en el carrito: ", pid)
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

    async removeProductFromCart(cid, pid) {
        try {
            const cart = await cartModel.findById(cid)
            if (!cart) {
                console.error("Carrito no encontrado por ID: ", cid)
                return null
            }

            cart.products = cart.products.filter((item) => !item.pid.equals(pid))
            await cart.save()
            console.log("Producto eliminado del carrito correctamente")
            return cart
        } catch (error) {
            console.error("Error al eliminar el producto del carrito: ", error)
            throw error
        }
    }

    async clearCart(cid) {
        try {
            const cart = await cartModel.findById(cid)
            if (!cart) {
                console.error("Carrito no encontrado por ID: ", cid)
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