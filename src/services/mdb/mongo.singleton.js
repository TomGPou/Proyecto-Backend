import mongoose from 'mongoose';
import config from '../../config.js'

export default class MongoSingleton {
    static #instance;

    constructor() {
        this.connect();
    }

    async connect() {
        await mongoose.connect(config.MONGODB_URI);
    }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new MongoSingleton();
            console.log('Conexión a la DB creada');
        } else {
            console.log('Conexión a la DB recuperada');
        }
        return this.#instance;
    }
}
