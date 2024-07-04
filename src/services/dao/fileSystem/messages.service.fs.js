import { readFile, writeFile } from '../../utils/utils.js'

export default class ChatService {
  constructor() {
    this.path = './src/utils/chatLog.json',
      this.messages = []
  }

  // OBTENER LOS MENSAJES
  async getChat() {
    if (!this.messages.length) {
      this.messages = await readFile(this.path);
    }
    return this.messages;
  }

  // AGREGAR MENSAJES
  async add(newMessage) {
    if (!this.messages.length) {
      this.messages = await readFile(this.path);
    }
    // Validar mensaje vacio
    if (!newMessage.message) {
      throw new Error('El mensaje no puede estar vacio');
    }
    // carga al array y guardado de archivo
    this.messages.push(newMessage);
    await writeFile(this.path, this.messages);
    return newMessage
  }
}