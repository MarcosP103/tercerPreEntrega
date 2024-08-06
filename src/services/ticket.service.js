import ticketModel from "../dao/models/ticket.model.js";

class TicketService {
    async createTicket(ticketData) {
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