//* IMPORTS
import TicketService from "../services/dao/mdb/ticket.service.mdb.js";
// import TicketService from "../services/dao/fileSystem/ticket.service.fs.js";
//* INIT
const ticketService = new TicketService();

//* DTO

//* CONTROLLER
export default class TicketController {
  constructor() {}

  // OBTENER TODOS LOS TICKETS
  getAll = async () => {
    try {
      return await ticketService.getAll();
    } catch (error) {
      return { error: error.message };
    }
  };

  // OBTENER TICKET POR ID
  getById = async (id) => {
    try {
      return await ticketService.getById(id);
    } catch (error) {
      return { error: error.message };
    }
  };

  // OBTENER TICKET POR CODE
  getByCode = async (code) => {
    try {
      return await ticketService.getByCode(code);
    } catch (error) {
      return { error: error.message };
    }
  };

  // CREAR TICKET
  create = async (newTicket) => {
    try {
      return await ticketService.create(newTicket);
    } catch (error) {
      return { error: error.message };
    }
  };

  // ACTUALIZAR AMOUNT
  updateAmount = async (id, amount) => {
    try {
      return await ticketService.updateAmount(id, amount);
    } catch (error) {
      return { error: error.message };
    }
  };

  // BORRAR TICKET
  delete = async (id) => {
    try {
      return await ticketService.delete(id);
    } catch (error) {
      return { error: error.message };
    }
  };
}
