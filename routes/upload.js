const { Router } = require('express');
const { check } = require('express-validator');

const { cargarArchivo, 
        actualizarImagen, // Version guarda imagenes en repositorio de la app
        mostrarImagen, 
        actualizarImagenCloudinary} = require('../controllers/upload');
const { coleccionesPermitidas } = require('../helpers');
const { validarCampos, validarArchivoSubir } = require('../middlewares');

const router = Router();

router.post('/',[
    validarArchivoSubir, 
    validarCampos
], cargarArchivo);

router.put('/:coleccion/:id', [
    check('id', 'NO es un id valido').isMongoId(),
    check('coleccion').custom( c=> coleccionesPermitidas(c, ['usuarios','productos'])),
    validarArchivoSubir, 
    validarCampos
], actualizarImagenCloudinary);

router.get('/:coleccion/:id', [
    check('id', 'NO es un id valido').isMongoId(),
    check('coleccion').custom( c=> coleccionesPermitidas(c, ['usuarios','productos'])),
    validarCampos
], mostrarImagen);


module.exports = router;