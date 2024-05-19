import messagesModel from "../models/messages.model.js";

export default class ChatManager {
  // constructor() {
  //     this.path = './src/utils/chatLog.json',
  //     this.messages = []
  // }

  // OBTENER LOS MENSAJES
  async getMessages() {
    return await messagesModel.find().lean();
  }

  // AGREGAR MENSAJES
  async addMessage(newMessage) {
    // Validar mensaje vacio
    if (!newMessage.message) {
      throw new Error("El mensaje no puede estar vacio");
    }
    // Guardar mensaje en DB
    return messagesModel.create(newMessage);
  }
}
