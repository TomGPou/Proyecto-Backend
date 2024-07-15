import { purchaseMail } from "../../utils/nodemailer.js";
import ticketModel from "./models/tickets.model.js";
import mongoose from "mongoose";

export default class TicketService {
  constructor() {
    this.tickets = [];
  }

  async getAll() {
    const tickets = await ticketModel.find();
    return tickets;
  }

  async getById(id) {
    const ticket = await ticketModel.findById(id);
    if (!ticket) throw new Error(`Ticket con ID: ${id} no encontrado`);
    return ticket;
  }

  async getByCode(code) {
    const ticket = await ticketModel.findOne({ code });
    return ticket;
  }

  async create(newTicket) {
    try {
      // Validar la carga de datos
      if (!newTicket.code || !newTicket.amount || !newTicket.purchaser) {
        throw new Error("Falta datos del ticket");
      }
      // Validar ticket code
      let maxTries = 10;
      let tries = 0;
      const exists = await this.getByCode(newTicket.code);
      while (exists && tries < maxTries) {
        newTicket.code = generateCode();
        tries++;
      }
      if (tries === maxTries) {
        throw new Error("No se pudo generar el código del ticket");
      }
      // Crear
      const ticket = await ticketModel.create(newTicket);
      await purchaseMail(ticket);
      return ticket;
    } catch (error) {
      return { error: error.message };
    }
  }

  async updateAmount(id, amount) {
    // validar id
    this.getById(id);
    // actualizar
    const ticket = await ticketModel.findByIdAndUpdate(
      id,
      { amount },
      { new: true }
    );
    return ticket;
  }

  // async update(id, data) {
  //     // validar id
  //     this.getById(id);
  //     // actualizar
  //     const ticket = await ticketModel.findByIdAndUpdate(id, data, { new: true });
  //     return ticket;
  // }

  async delete(id) {
    // validar id
    this.getById(id);
    // borrar
    const ticket = await ticketModel.findByIdAndDelete(id);
    return ticket;
  }
}
