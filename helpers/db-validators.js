const {Role, Usuario, Producto, Categoria} = require('../models');

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

    const existeId = await Usuario.findById(id);

    if (!existeId) {
        throw new Error(`El ID: ${ id }, NO exite`);
    };
}

// Verificar si Id Existe
const existeProducto = async(id = '') => {
    
    const existeId = await Producto.findById(id);

    if (!existeId) {
        throw new Error(`El ID: ${ id }, NO exite`);
    };
}

// Verificar si Id Existe
const existeCategoria = async(id = '') => {
    
    const existeId = await Categoria.findById(id);

    if (!existeId) {
        throw new Error(`El ID: ${ id }, NO exite`);
    };
}

// Validar colecciones permitidas
const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes(coleccion);

    if (!incluida) {
        throw new Error(`La coleccion no esta permitida, las validas son ${colecciones}`) 
    }
    return true;
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuario,
    existeProducto,
    existeCategoria,
    coleccionesPermitidas
}