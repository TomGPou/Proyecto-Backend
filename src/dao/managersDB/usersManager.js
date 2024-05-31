import usersModel from "../models/users.model.js"

export default class UsersManager {
    // Obtener todos
    async getAll() {
        try {
            const users = await usersModel.find()
            return users
        } catch (error) {
            console.log(error)
        }
    }

    // Obtener por id
    async getById(id) {
        try {
            const user = await usersModel.findById(id)
            if (!user) throw new Error("Usuario no encontrado")
            return user
        } catch (error) {
            console.log(error)
        }
    }
    // Crear
    async create(user) {
        try {
            // validar email
            const existingUser = await usersModel.findOne({ email: user.email })
            if (existingUser) throw new Error("Email ya registrado")
            // crear usuario
            const newUser = await usersModel.create(user)
            return newUser
        } catch (error) {
            console.log(error)
        }
    }
    // Actualizar
    async update(uid, user) {
        try {
            const updatedUser = await usersModel.findByIdAndUpdate(uid, user, { new: true })
            if (!updatedUser) throw new Error("Usuario no encontrado")
            return updatedUser
        } catch (error) {
            console.log(error)
        }
    }
    // Eliminar
    async delete(uid) {
        try {
            const deletedUser = await usersModel.findByIdAndDelete(uid)
            if (!deletedUser) throw new Error("Usuario no encontrado")
            return deletedUser
        } catch (error) {
            console.log(error)
        }
    }

    // Login
    async login(email, password) {
        try {
            const user = await usersModel.findOne({ email })
            if (!user) throw new Error("Usuario no encontrado")
            if (user.password !== password) throw new Error("Contraseña incorrecta")
            return user
        } catch (error) {
            console.log(error)
        }
    }
}