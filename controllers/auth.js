const { response, json } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require ('../models/usuario');
const generarJWT = require ('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async(req, res = response) => {

    const {id_token} = req.body;

    try {

        // console.log('googleSignIn -- id_token...', id_token);

        //const googleUser = await googleVerify( id_token );
        //console.log('googleSignIn - googleUser...',googleUser);

        const {nombre, img, correo} = await googleVerify( id_token );

        let usuario = await Usuario.findOne({correo});

        console.log('googleSignIn - usuario', usuario)

        if (!usuario) {
            // Crear usuario autentificado que no existe en BD
            const data = {
                nombre,
                correo,
                img,
                password: ':P',
                google: true,
                estado: true,
                rol: 'USER_ROLE'
            };
            console.log('googleSignIn - data', data)

            usuario = new Usuario( data );
            await usuario.save();            
        };

        // Si estado es falso no dejar autenticar
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrado, usuario desactivado'
            })
        }

        // Generar jwt
        const token = await generarJWT( usuario.id);

        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        console.log('googleSignIn -- Error',error);
        res.status(500).json({
            ok: false,
            msg: 'El token no se pudo validar'
        })
        
    }
    
} 

module.exports = { 
    login,
    googleSignIn 
}
