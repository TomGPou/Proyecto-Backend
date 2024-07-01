import fs from 'fs'

export default class ChatManager {
    constructor() {
        this.path = './src/utils/chatLog.json',
        this.messages = []
    }

    async readFile() {
        try {
          const data = await fs.promises.readFile(this.path);
          this.messages = JSON.parse(data);
        } catch (err) {
          console.error(err);
          throw err;
        }
    }
    
    async writeFile() {
        try {
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(this.messages),
            "utf-8"
          );
        } catch (err) {
          console.error(err);
          throw err;
        }
    }

    // OBTENER LOS MENSAJES
    async getMessages() {
      if (!this.messages.length) await this.readFile();
      return this.messages;
    }

    // AGREGAR MENSAJES
    async addMessage(newMessage){
        await this.readFile()
        // Validar mensaje vacio
        if (!newMessage.message){
            throw new Error ('El mensaje no puede estar vacio');
        }
        // carga al array y guardado de archivo
        this.messages.push(newMessage);
        await this.writeFile();
        return newMessage
    }
}