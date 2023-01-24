const validarJwt = require('../middlewares/validar-jwt');
const validarRoles = require('../middlewares/validar-roles');
const validarCampos = require ('../middlewares/validar-campos');

module.exports = {
    ...validarJwt,
    ...validarRoles,
    ...validarCampos
}