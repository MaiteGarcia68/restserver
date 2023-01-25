const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');
const { countDocuments } = require('../models/usuario');


const userGet = async(req, res = response) => {

    const { limite = 5, desde = 0, estado = true, google = false } = req.query;

    const [total, usuarios] = await Promise.all ([
        Usuario.countDocuments( {estado} ),
        usuario.find( {estado} )
            .skip (desde )
            .limit( limite )
    ]); 

    res.json({total, usuarios});
}

const userPost = async (req, res = response) => {

    //console.log("LLEVE AL POST-------");

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    //console.log('usuario...',usuario);

    // Encritar contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password,salt);

    // Guardar en BD
    usuario.save();

    res.json(usuario);
}

const userPut = async(req, res = response) => {

    const id = req.params.id;
    //console.log('Estoy en userPost - params',req.params);

    const {_id, password, google, correo, ...resto} = req.body;

    //console.log('RESTO....',resto);

    // Validar Id contra BD
    if (password) {
            // Encritar contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password,salt);
    }

    //console.log('RESTO....2',resto);

    const usuario = await Usuario.findByIdAndUpdate( id, resto, {new:true} );

    //console.log('usuario...',usuario);

    res.json(usuario);
}

const userDelete = async(req, res = response) => {

    const id = req.params.id;

    // Borrado Fisico
    //const usuario = await Usuario.findByIdAndDelete(id);

    // Borrado Lógico con cambio de estado = false
    const usuario = await Usuario.findByIdAndUpdate( id, {estado:false}, {new:true});
    const usuarioAuth =  req.usuarioAuth;
    
    res.json({usuario, usuarioAuth});
    
}

const userPatch = (req, res = response) => {
    res.json({
        msg: 'Patch Api - Controlador '
    });
}

module.exports = {
    userGet,
    userPost,
    userPut,
    userDelete,
    userPatch
}


