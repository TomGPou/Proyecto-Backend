import { purchaseMail } from "../../utils/nodemailer.js";
import ticketModel from "./models/tickets.model.js";
import CustomError from "../../errors/CustomErrors.class.js";
import errorsDictionary from "../../errors/errrosDictionary.js";

export default class TicketService {
  constructor() {
    this.tickets = [];
  }

  async getAll() {
    const tickets = await ticketModel.find();
    return tickets;
  }

  async getById(id) {
    try {
      const ticket = await ticketModel.findById(id);
      if (!ticket) throw new CustomError(errorsDictionary.ID_NOT_FOUND);
      return ticket;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  async getByCode(code) {
    try {
      const ticket = await ticketModel.findOne({ code: code });
      if (!ticket) throw new CustomError(errorsDictionary.NOT_FOUND);
      return ticket;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  async create(newTicket) {
    try {
      // Validar la carga de datos
      if (!newTicket.code || !newTicket.amount || !newTicket.purchaser) {
        throw new CustomError(errorsDictionary.FEW_PARAMETERS);
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
        throw new CustomError(errorsDictionary.RECORD_CREATION_ERROR);
      }
      // Crear
      const ticket = await ticketModel.create(newTicket);
      await purchaseMail(ticket);
      return ticket;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  async updateAmount(id, amount) {
    try {
      // validar id
      this.getById(id);
      // actualizar
      const ticket = await ticketModel.findByIdAndUpdate(
        id,
        { amount },
        { new: true }
      );
      return ticket;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  // async update(id, data) {
  //     // validar id
  //     this.getById(id);
  //     // actualizar
  //     const ticket = await ticketModel.findByIdAndUpdate(id, data, { new: true });
  //     return ticket;
  // }

  async delete(id) {
    try {
      // validar id
      this.getById(id);
      // borrar
      const ticket = await ticketModel.findByIdAndDelete(id);
      return ticket;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }
}
