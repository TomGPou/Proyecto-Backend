//* IMPORTS
import ChatService from "../services/dao/mdb/messages.service.mdb.js";
// import ChatService from "../services/dao/fileSystem/messages.service.fs.js";
//* INIT
const service = new ChatService();

export default class MessagesController {
  constructor() {}

  //* METHODS
  //* OBTENER LOS MENSAJES
  getChat = () => {
    return service.getChat();
  };

  //* AGREGAR MENSAJES
  add = (newMessage) => {
    // Validar mensaje vacio
    if (!newMessage.message) {
      throw new Error("El mensaje no puede estar vacio");
    }
    return service.add(newMessage);
  };
}
