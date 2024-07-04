import messagesModel from "../../../models/messages.model.js";

export default class ChatService {
  constructor() {}

  // OBTENER LOS MENSAJES
  async getChat() {
    return await messagesModel.find().lean();
  }

  // AGREGAR MENSAJES
  async add(newMessage) {
    // Guardar mensaje en DB
    return messagesModel.create(newMessage);
  }
}
