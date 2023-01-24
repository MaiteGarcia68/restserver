const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require ('../models/usuario');
const generarJWT = require ('../helpers/generar-jwt');

const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {
            const usuario = await Usuario.findOne({correo});

            // Verificar si el email existe
    
            if (!usuario) {
                return res.status(400).json({
                    msg: "Usuario/contraseña No con correctos - correo"
                })
            }

            // Verificar que usuario este activo
            if (!usuario.estado) {
                return res.status(400).json({
                    msg: "Usuario/contraseña No con correctos - estado"
                })
            }

            // Verificar la contraseña
            const validaPassword = bcryptjs.compareSync( password, usuario.password);
            if (!validaPassword) {
                return res.status(400).json({
                    msg: "Usuario/contraseña No con correctos - password"
                })
            }

        // enviar jwt
        const token = await generarJWT( usuario.id);
        
        res.json({
            usuario,
            token
        })
    

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo salio mal, hable con el administrador'
        });
        
    }

}

module.exports = { 
    login 
}
