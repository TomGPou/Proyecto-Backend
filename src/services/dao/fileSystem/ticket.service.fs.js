import { readFile, writeFile } from "../../utils/utils.js";

export default class TicketService {
  constructor() {
    this.path = "./src/services/utils/tickets.json";
  }

  async getAll() {
    const tickets = await readFile(this.path);
    return tickets;
  }

  async getById(id) {
    try {
      const ticketsList = await this.getAll();
      const ticket = ticketsList.find((t) => t.id === id);

      return ticket || null;
    } catch (err) {
      console.log(err.message);
      return new CustomError(errorsDictionary.UNHANDLED_ERROR);
    }
  }

  async getByCode(code) {
    try {
      const ticketsList = await this.getAll();
      const ticket = ticketsList.find((t) => t.code === code);

      return ticket || null;
    } catch (err) {
      console.log(err.message);
      return new CustomError(errorsDictionary.UNHANDLED_ERROR);
    }
  }

  async create(newTicket) {
    try {
      // Validar la carga de datos
      if (!newTicket.code || !newTicket.amount || !newTicket.purchaser) {
        return new CustomError(errorsDictionary.FEW_PARAMETERS);
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
        return new CustomError(errorsDictionary.RECORD_CREATION_ERROR);
      }
      // Crear
      const ticketsList = await this.getAll();
      const tickets = [...ticketsList, newTicket];
      await writeFile(this.path, tickets);
      return newTicket;
    } catch (err) {
      console.log(err.message);
      return new CustomError(errorsDictionary.UNHANDLED_ERROR);
    }
  }

  async updateAmount(id, amount) {
    try {
      const ticket = await this.getById(id);
      if (!ticket) {
        return new CustomError(errorsDictionary.ID_NOT_FOUND);
      }

      const tickets = await this.getAll();
      // buscar ticket
      const i = tickets.findIndex((item) => item.id === id);
      // actualizar
      tickets[i].amount = amount;

      await writeFile(this.path, tickets);
      return tickets[i];
    } catch (err) {
      console.log(err.message);
      return new CustomError(errorsDictionary.UNHANDLED_ERROR);
    }
    // validar id
  }

  // async update(id, data) {
  //   // validar id
  //   this.getById(id);

  //   const ticketsList = await this.getAll();
  //   // buscar ticket
  //   const i = ticketsList.findIndex((item) => item.id === id);
  //   // verificar que no se borre el ID
  //   if( ("tid" in data) ) {
  //     delete data.tid;
  //   }
  //   this.tickets[i] = { ...this.tickets[i], ...data };

  //   await writeFile(this.path, this.tickets)
  //   return this.tickets[i];
  // }

  async delete(id) {
    try {
      // validar id
      const ticket = await this.getById(id);
      if (!ticket) {
        return new CustomError(errorsDictionary.ID_NOT_FOUND);
      }

      const tickets = await this.getAll();
      // buscar ticket
      const i = tickets.findIndex((item) => item.id === id);
      // borrar
      tickets.splice(i, 1);

      await writeFile(this.path, tickets);
      return console.log(`Ticket de ID: ${id} eliminado`);
    } catch (err) {
      console.log(err.message);
      return new CustomError(errorsDictionary.UNHANDLED_ERROR);
    }
  }
}
