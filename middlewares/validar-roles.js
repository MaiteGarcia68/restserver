const { response, request } = require("express")

const esAdminRol = ( req, res = response, next ) => {

    if ( !req.usuarioAuth ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }

    const { rol, nombre } = req.usuarioAuth;
    
    if ( rol !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `${ nombre } no es administrador - No puede hacer esto`
        });
    }

    next();
}

const tieneRol = ( ...roles ) => {

    return (req, res, next) => {

        if ( !req.usuarioAuth ) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            });
        }
        
        if ( !roles.includes(req.usuarioAuth.rol) ) {
            return res.status(401).json({
                msg: `${ req.usuarioAuth.nombre } no tiene el Rol para hacer esto`
            });
        }

        next();
    }

}

module.exports = {esAdminRol, tieneRol}