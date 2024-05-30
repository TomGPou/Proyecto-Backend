import { Router } from 'express';

import config from '../config.js';

const router = Router();

// Validacion admin
const adminAuth = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'admin')
        return res.status(401).send({ origin: config.SERVER, payload: 'Acceso no autorizado: se requiere autenticación y nivel de admin' });

    next();
}
//* ENDPOINTS (/api/session)
/**
 * Implementar este endpoint
 * RECORDAR verificar que NO EXISTA el email antes de cargar el nuevo usuario
 */
router.post('/register', async (req, res) => {
});

router.post('/login', async (req, res) => {
    try {
        // Recuperamos los campos que llegan del formulario
        // Aquí luego se deberían agregar otras validaciones
        const { email, password } = req.body;
        
        // Esto simula datos existentes en base de datos
        // Reemplazar por llamada a método del manager que busque un usuario
        // filtrando por email y clave.
        const savedFirstName = 'José';
        const savedLastName = 'Perez';
        const savedEmail = 'idux.net@gmail.com';
        const savedPassword = 'abc123';
        const savedRole = 'admin';

        if (email !== savedEmail || password !== savedPassword) {
            return res.status(401).send({ origin: config.SERVER, payload: 'Datos de acceso no válidos' });
        }
        
        req.session.user = { firstName: savedFirstName, lastName: savedLastName, email: email, role: savedRole };
        res.status(200).send({ origin: config.SERVER, payload: 'Bienvenido!' });
        // res.redirect('/profile');
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

/**
 * Utilizamos el middleware adminAuth (ver arriba) para verificar si el usuario
 * está autenticado (tiene una sesión activa) y es admin
 */
router.get('/private', adminAuth, async (req, res) => {
    try {
        res.status(200).send({ origin: config.SERVER, payload: 'Bienvenido ADMIN!' });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

router.get('/logout', async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) return res.status(500).send({ origin: config.SERVER, payload: 'Error al ejecutar logout', error: err });
            // res.status(200).send({ origin: config.SERVER, payload: 'Usuario desconectado' });
            res.redirect('/login');
        });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

export default router;