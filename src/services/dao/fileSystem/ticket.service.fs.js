import { readFile, writeFile } from "../../utils/utils.js";

export default class TicketService {
  constructor() {
    (this.path = "./src/utils/tickets.json"), (this.tickets = []);
  }

  async getAll() {
    if (!this.tickets.length) {
      this.tickets = await readFile(this.path);
    }
    return this.tickets;
  }

  async getById(id) {
    const ticketsList = await this.getAll();
    const ticket = ticketsList.find((t) => t.id === id);

    return ticket || null;
  }

  async getByCode(code) {
    const ticketsList = await this.getAll();
    const ticket = ticketsList.find((t) => t.code === code);

    return ticket || null;
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
      const ticketsList = await this.getAll();
      this.tickets = [...ticketsList, newTicket];
      await writeFile(this.path, this.tickets);
      return newTicket;
    } catch (error) {
      return { error: error.message };
    }
  }

  async updateAmount(id, amount) {
    // validar id
    this.getById(id);

    const ticketsList = await this.getAll();
    // buscar ticket
    const i = ticketsList.findIndex((item) => item.id === id);
    // actualizar
    this.tickets[i].amount = amount;

    await writeFile(this.path, this.tickets);
    return this.tickets[i];
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
    // validar id
    this.getById(id);

    const ticketsList = await this.getAll();
    // buscar ticket
    const i = ticketsList.findIndex((item) => item.id === id);
    // borrar
    ticketsList.splice(i, 1);
    this.tickets = [...ticketsList];

    await writeFile(this.path, this.tickets);
    return console.log(`Ticket de ID: ${id} eliminado`);
  }
}
