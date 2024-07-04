import { readFile, writeFile, createHash, isValidPassword } from '../../utils/utils.js'
import CartService from '../mdb/cart.service.fs.js'

//INIT
const cartService = new CartService();

export default class UsersService {
    constructor() {
        this.path = './src/utils/users.json';
        this.users = [];
    }

    // Obtener todos
    async getAll() {
        try {
            this.users = await readFile(this.path);
            return this.users;
        } catch (error) {
            console.log(error);
        }
    }

    // Obtener por id
    async getById(id) {
        try {
            this.users = await readFile(this.path);
            const user = this.users.find((user) => user.uid === id);
            if (!user) throw new Error("Usuario no encontrado");
            return user;
        } catch (error) {
            console.log(error);
        }
    }

    // getOne
    async getOne(query) {
        try {
            this.users = await readFile(this.path);
            const user = this.users.find((user) =>
                Object.keys(query).every((key) => user[key] === query[key])
            );
            if (!user) throw new Error("Usuario no encontrado");
            delete user.password;
            return user;
        } catch (error) {
            console.log(error);
        }
    }

    // Crear
    async create(user) {
        try {
            // validar email
            const existingUser = this.users.find((user) => user.email === user.email);
            if (existingUser) throw new Error("Email ya registrado");
            // crear hash de contraseña
            user.password = createHash(user.password);

            // crear carrito asignarlo al usuario
            const newCart = await cartService.create();
            user.cart = newCart._id;

            // crear usuario
            this.users.push(user);
            await writeFile(this.path, this.users);
            return user;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // Actualizar
    async update(uid, user) {
        try {
            this.users = await readFile(this.path);
            const i = this.users.findIndex((item) => item.uid === uid);
            // verificar que exista el ID
            if (i < 0) {
                throw new Error(`Usuario con ID: ${uid} no encontrado`);
        }    
            // verificar que no elimine el ID
            if ("uid" in user) {
                delete user.uid;
            }
            // modificar usuario y actualizar DB
            this.users[i] = { ...this.users[i], ...user };
            await writeFile(this.path, this.users);
            return this.users[i];
        } catch (error) {
            console.log(error);
        }
    }

    //  Eliminar
    async delete(uid) {
        try {
            this.users = await readFile(this.path);
            const i = this.users.findIndex((item) => item.uid === uid);

            // verificar que exista el ID
            if (i < 0) {
                throw new Error(`Usuario con ID: ${uid} no encontrado`);
            }
            // Quitar usuario del array y actualizar DB
            this.users.splice(i, 1);
            await writeFile(this.path, this.users);
            return console.log(`Usuario de ID: ${uid} eliminado`);
        } catch (error) {
            console.log(error);
        }
    }

    // Login
    async login(email, enteredPassword) {
        try {
            this.users = await readFile(this.path);
            const user = this.users.find((user) => user.email === email);

            if (!user || !isValidPassword(enteredPassword, user.password))
                throw new Error("Datos de acceso no válidos");

            delete user.password;
            return user;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}
