const { Router } = require('express');
const { check } = require('express-validator');

const { esRoleValido,
     emailExiste,
     existeUsuario
      } = require('../helpers/db-validators');

const { userGet,
        userPost,
        userPut,
        userDelete,
        userPatch
     } = require('../controllers/user');

const { 
     validarCampos,
     validarJWT,
     esAdminRol, 
     tieneRol
 } = require ("../middlewares");

const router = Router();

router.get('/',userGet);

router.post('/',[
     check('nombre', 'El nombre es obligatorio').not().isEmpty(),
     check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
     check('correo', 'El correo no es válido').isEmail(),
     check('correo').custom( emailExiste ),
     //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
     check('rol').custom( esRoleValido ),
     validarCampos
], userPost );


router.put('/:id',[
     check('id', 'NO es un id valido').isMongoId(),
     check('id').custom( existeUsuario ),
     check('correo', 'El correo no puede ser modificado').isEmpty(),
     check('rol').custom( esRoleValido ),
     validarCampos
],userPut);

router.delete('/:id',[
     validarJWT,
     //esAdminRol,
     tieneRol("ADMIN_ROLE","VENTAS_ROLE"),
     check('id', 'NO es un id valido').isMongoId(),
     check('id').custom( existeUsuario ),
     validarCampos
     ],userDelete);


router.patch('/',userPatch);


module.exports = router;
