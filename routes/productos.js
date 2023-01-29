const { Router } = require('express');
const { check } = require('express-validator');


const { validarJWT, 
        validarCampos, 
        tieneRole } = require('../middlewares');
const {productoPost, 
        productoGet, 
        productoXIdGet, 
        productoPut, 
        productoDelete} = require('../controllers/productos');
const { existeProducto, 
        existeCategoria, 
        esCategoriaValida} = require('../helpers');

const router = Router();

// todos los productos- public
router.get('/', productoGet);

// obtener un producto x id - public
router.get('/:id', [
    check('id', 'NO es un id valido').isMongoId(),
    check('id').custom( existeProducto),
    validarCampos
    ], productoXIdGet);

// creaar un producto - con cualquier Rol
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria').custom( esCategoriaValida),
    validarCampos
    ],productoPost);


// actualizar un registro por id - con cualquier Rol
router.put('/:id',[
    validarJWT,
    check('id', 'NO es un id valido').isMongoId(),
    check('id').custom( existeProducto),
    validarCampos
    ],productoPut);

// Borrar una categoria - solo con rol admin
router.delete('/:id',[
     validarJWT,
     tieneRole("ADMIN_ROLE"),
     check('id', 'NO es un id valido').isMongoId(),
     check('id').custom( existeProducto),
     validarCampos
    ],productoDelete);


module.exports = router;