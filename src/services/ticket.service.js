import ticketModel from "../dao/models/ticket.model.js";

class TicketService {
    async createTicket(ticketData) {
        if (!ticketData.code || !ticketData.purchase_datetime || typeof ticketData.amount !== 'number') {
            throw new Error("Datos del ticket incompletos o inválidos: code, purchase_datetime y amount son obligatorios.");
        }

        if (!Array.isArray(ticketData.products) || ticketData.products.length === 0) {
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

        // Creación del ticket
        const ticket = new ticketModel(ticketData);
        return await ticket.save();
    }

    async getTicketById(id) {
        const ticket = await ticketModel.findById(id);
        if (!ticket) {
            throw new Error(`Ticket con ID ${id} no encontrado`);
        }
        return ticket;
    }

    async getAllTickets() {
        return await ticketModel.find();
    }

    async updateTicket(id, ticketData) {
        const ticket = await ticketModel.findByIdAndUpdate(id, ticketData, { new: true });
        if (!ticket) {
            throw new Error(`No se pudo actualizar el ticket con ID ${id}, no encontrado.`);
        }
        return ticket;
    }

    async deleteTicket(id) {
        const ticket = await ticketModel.findByIdAndDelete(id);
        if (!ticket) {
            throw new Error(`No se pudo eliminar el ticket con ID ${id}, no encontrado.`);
        }
        return ticket;
    }
}

export default TicketService;
