import { readFile, writeFile } from "../../utils/utils.js";

export default class ChatService {
  constructor() {
    this.path = "./src/services/utils/chatLog.json";
  }

  // OBTENER LOS MENSAJES
  async getChat() {
    if (!this.messages.length) {
      const messages = await readFile(this.path);
    }
    return messages;
  }

  // AGREGAR MENSAJES
  async add(newMessage) {
    if (!this.messages.length) {
      const messages = await readFile(this.path);
    }
    // Validar mensaje vacio
    if (!newMessage.message) {
      throw new Error("El mensaje no puede estar vacio");
    }
    // carga al array y guardado de archivo
    messages.push(newMessage);
    await writeFile(this.path, messages);
    return newMessage;
  }
}
