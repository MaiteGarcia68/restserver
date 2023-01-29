const { Router } = require('express');
const { check } = require('express-validator');


const { validarJWT, 
        validarCampos, 
        tieneRole } = require('../middlewares');


const {categoriaPost, 
        categoriaGet, 
        categoriaXIdGet, 
        categoriaPut, 
        categoriaDelete} = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');

const router = Router();


// todos las categorias- public
router.get('/', categoriaGet);

// obtener una categoria x id - public
router.get('/:id', [
    check('id', 'NO es un id valido').isMongoId(),
    check('id').custom( existeCategoria),
    validarCampos
    ], categoriaXIdGet);

// creaar una categoria - con cualquier Rol
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
    ],categoriaPost);


// actualizar un registro por id - con cualquier Rol
router.put('/:id',[
    validarJWT,
    check('id', 'NO es un id valido').isMongoId(),
    check('id').custom( existeCategoria),
    validarCampos
    ],categoriaPut);

// Borrar una categoria - solo con rol admin
router.delete('/:id',[
     validarJWT,
     tieneRole("ADMIN_ROLE"),
     check('id', 'NO es un id valido').isMongoId(),
     check('id').custom( existeCategoria),
     validarCampos
    ],categoriaDelete);
    

module.exports = router;