import ticketModel from "../dao/models/ticket.model.js";

class TicketService {
    async createTicket(ticketData) {
        if(!Array.isArray(ticketData.products) || ticketData.products.length === 0) {
            throw new Error("Debe ser un arreglo de productos no vacío.");
        }
    
        ticketData.products = ticketData.products.map(product => {
            if (!product.product || !product.title || typeof product.price !== 'number' || typeof product.quantity !== 'number') {
                throw new Error("Cada producto debe tener product, title, price (número) y quantity (número)");
            }
            return {
                product: product.product,
                title: product.title,
                price: product.price,
                quantity: product.quantity
            };
        });
    
        const ticket = new ticketModel(ticketData);
        return await ticket.save();
    }

    async getTicketById(id) {
        return await ticketModel.findById(id);
    }

    async getAllTickets() {
        return await ticketModel.find();
    }

    async updateTicket(id, ticketData) {
        return await ticketModel.findByIdAndUpdate(id, ticketData, { new: true });
    }

    async deleteTicket(id) {
        return await ticketModel.findByIdAndDelete(id);
    }
}

export default TicketService;