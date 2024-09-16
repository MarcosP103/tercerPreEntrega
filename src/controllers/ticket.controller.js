import TicketService from "../services/ticket.service.js";

const ticketService = new TicketService();

export const createTicket = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }
    const purchaser = user.email
    const { products } = req.body

    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: "Debe proporcionar un arreglo de productos no vacío" });
      }

    const amount = products.reduce((total, item) => {
        if (typeof item.price !== 'number' || typeof item.quantity !== 'number') {
            throw new Error("Precio y cantidad deben ser números");
          }
        return total + item.price * item.quantity
    }, 0)

    const newTicket = {
      amount,
      purchaser,
      products: products.map(item => ({
        product: item.product,
        title: item.title,
        price: item.price,
        quantity: item.quantity
      })),
    };

    const savedTicket = await ticketService.createTicket(newTicket);
    res.status(201).json({ status: "success", ticket: savedTicket });
  } catch (error) {
    console.error("Error al crear ticket:", error);
    res.status(500).json({ error: "Error al crear ticket" });
  }
};

export const getTicketById = async (req, res) => {
  const { id } = req.params;

  try {
    const ticket = await ticketService.getTicketById(id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }
    res.status(200).json({ status: "success", ticket });
  } catch (error) {
    console.error("Error al obtener ticket:", error);
    res.status(500).json({ error: "Error al obtener ticket" });
  }
};

export const getAllTickets = async (req, res) => {
  try {
    const tickets = await ticketService.getAllTickets();
    res.status(200).json({ status: "success", tickets });
  } catch (error) {
    console.error("Error al obtener tickets:", error);
    res.status(500).json({ error: "Error al obtener tickets" });
  }
};

export const updateTicket = async (req, res) => {
  const { id } = req.params;
  const ticketData = req.body;

  try {
    const updatedTicket = await ticketService.updateTicket(id, ticketData);
    if (!updatedTicket) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }
    res.status(200).json({ status: "success", ticket: updatedTicket });
  } catch (error) {
    console.error("Error al actualizar ticket:", error);
    res.status(500).json({ error: "Error al actualizar ticket" });
  }
};

export const deleteTicket = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTicket = await ticketService.deleteTicket(id);
    if (!deletedTicket) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }
    res.status(200).json({ status: "success", message: "Ticket eliminado" });
  } catch (error) {
    console.error("Error al eliminar ticket:", error);
    res.status(500).json({ error: "Error al eliminar ticket" });
  }
};
