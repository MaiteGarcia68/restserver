const { response } = require("express");
const { Categoria } = require("../models");

const categoriaGet = async(req, res = response) => {

    const { limite = 5, desde = 0, estado = true} = req.query;

    const [total, categorias] = await Promise.all ([
        Categoria.countDocuments( {estado} ),
        Categoria.find( {estado} )
            .populate('usuario', 'nombre')
            .skip (desde )
            .limit( limite )
    ]); 

    res.json({total, categorias});
}

const categoriaXIdGet = async(req, res = response) => {

    const id = req.params.id;

    console.log('Id....', id);

    const categorias = await Categoria.findById(id).populate('usuario', 'nombre');

    res.json({categorias});
}

const categoriaPost = async (req, res = response) => {

    //console.log("LLEVE AL POST-------");

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if (categoriaDB) {
        return res.status(400).json({
            msg: 'Categoria ya existe'
        })

    }

    // Generar la data a guardar
    const data = {
        nombre, 
        usuario: req.usuarioAuth.id
    }

    const categoria = new Categoria(data);

    // Guardar en BD
    await categoria.save();

    res.status(201).json(categoria);
}

const categoriaPut = async (req, res = response) => {
    
    const id = req.params.id;
    const nombre = req.body.nombre.toUpperCase();

    // validar si existe el nuemro nombre q se esta cambiando
    const categoriaDB = await Categoria.findOne({nombre});

    if (categoriaDB) {
        return res.status(400).json({
            msg: 'Categoria ya existe'
        })

    }

    // Preparar data para grabar 
    const data = {
        nombre, 
        usuario: req.usuarioAuth.id
    }

    const categoria = await Categoria.findByIdAndUpdate( id, data, {new:true} );

    res.status(201).json(categoria);
}

const categoriaDelete = async(req, res = response) => {

    const id = req.params.id;

    // Borrado Fisico
    //const usuario = await Usuario.findByIdAndDelete(id);

    const data = {
        estado: false,
        usuario: req.usuarioAuth.id
    }

    // Borrado Lógico con cambio de estado = false
    const categoria = await Categoria.findByIdAndUpdate( id, data, {new:true});
    
    res.status(201).json(categoria);
    
}

module.exports = 
{
    categoriaPost, 
    categoriaGet, 
    categoriaXIdGet, 
    categoriaPut, 
    categoriaDelete
}
