//* IMPORTS
import ChatManager from "./controllersDB/messagesManager.mdb.js";
//* INIT
const chatManager = new ChatManager();

//* OBTENER LOS MENSAJES
export const getChat = () => {
  return chatManager.getMessages();
};

//* AGREGAR MENSAJES
export const addMessage = (newMessage) => {
  // Validar mensaje vacio
  if (!newMessage.message) {
    throw new Error("El mensaje no puede estar vacio");
  }
  return chatManager.addMessage(newMessage);
};
