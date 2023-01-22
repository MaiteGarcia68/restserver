const Role = require('../models/role');
const Usuario = require ('../models/usuario');

const esRoleValido = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

// Verificar si correo (unico) ya existe
const emailExiste = async(correo = '') => {
    
    const existeEmail = await Usuario.findOne({correo});
    if (existeEmail) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    };
}

// Verificar si Id Existe
const existeUsuario = async(id = '') => {

    console.log('Estoy en existeUsuario Id ',id);
    
    const existeId = await Usuario.findById(id);
    
    console.log('Estoy en existeUsuario existeId ',existeId);
    

    if (!existeId) {
        throw new Error(`El ID: ${ id }, NO exite`);
    };
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuario
}