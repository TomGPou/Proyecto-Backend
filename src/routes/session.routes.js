import { Router } from 'express';

import config from '../config.js';
import UsersManager from '../dao/managersDB/usersManager.js';

const router = Router();
const usersManager = new UsersManager();

//* ENDPOINTS (/api/session)
/**
 * Implementar este endpoint
 * RECORDAR verificar que NO EXISTA el email antes de cargar el nuevo usuario
 */
router.post('/register', async (req, res) => {
});

router.post('/login', async (req, res) => {
    try {
        // Aquí luego se deberían agregar otras validaciones
        const { email, password } = req.body;
        
        const user = await usersManager.login(email, password);

        if (!user) {
            return res.status(401).send({ origin: config.SERVER, payload: 'Datos de acceso no válidos' });
        }
        
        req.session.user = user;
        // res.status(200).send({ origin: config.SERVER, payload: 'Bienvenido!' });
        res.redirect('/');
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