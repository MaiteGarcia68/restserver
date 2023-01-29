const { response } = require("express");
const { body } = require("express-validator");
const { Categoria, Producto } = require("../models");

const productoGet = async(req, res = response) => {

    const { limite = 5, desde = 0, estado = true} = req.query;

    const [total, productos] = await Promise.all ([
        Producto.countDocuments( {estado} ),
        Producto.find( {estado} )
            .populate('categoria', 'nombre')
            .populate('usuario', 'nombre')
            .skip (desde )
            .limit( limite )
    ]); 

    res.json({total, productos});
}

const productoXIdGet = async(req, res = response) => {

    const id = req.params.id;

    console.log('Id....', id);

    const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria','nombre');

    res.json({producto});
}

const productoPost = async (req, res = response) => {

    console.log("LLEVE AL POST-------", req.body);

    const {nombre = '', categoria = '', ... body  } = req.body;

    console.log('categoria----', categoria);
    console.log('nombre----', nombre);

    const productoDB = await Producto.findOne({nombre: nombre.toUpperCase()});
    
    console.log('productoDB----', productoDB);

    if (productoDB) {
        return res.status(400).json({
            msg: 'Producto ya existe'
        })
    }

    const CategoriaProducto  = await Categoria.findOne({ nombre: categoria.toUpperCase() });
    console.log('CategoriaProducto......', CategoriaProducto);

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: nombre.toUpperCase(), 
        categoria: CategoriaProducto.id,
        usuario: req.usuarioAuth.id
    }
    console.log('data----',data)

    const producto = new Producto(data);

    // Guardar en BD
    await producto.save();

    res.status(201).json(producto);
    //res.status(201).json({msg: 'LLEGUE AL FINAL'});

}

const productoPut = async (req, res = response) => {
   
    const id = req.params.id;

    const {_id, nombre, categoria, usuario, estado, ...data} = req.body;

    // cambiar el nombre
    if (nombre) {
        // validar si existe el nombre q se esta cambiando
        console.log('valido nombre .....',nombre);
        const productoDB = await Producto.findOne({nombre});
        console.log('productoDB----', productoDB);
        if (productoDB) {
            return res.status(400).json({
                msg: 'Producto ya existe'
            })
    
        }
        data.nombre = nombre;
    }

    // cambiar categoria
    if (categoria) {
        // Validar si categoria existe
        console.log('valido categoria .....',categoria);
        const categoriaProducto  = await Categoria.findOne({ nombre:categoria });
        if (!categoriaProducto) {
            return res.status(400).json({
                msg: 'Categoria Producto No existe'
            })
        }
        data.categoria = categoriaProducto._id;
        console.log('categoriaProducto......', categoriaProducto);
    }

    const producto = await Producto.findByIdAndUpdate( id, data, {new:true} );

    res.status(201).json(producto);
}

const productoDelete = async(req, res = response) => {

    const id = req.params.id;

    // Borrado Fisico
    //const usuario = await Usuario.findByIdAndDelete(id);

    const data = {
        estado: false,
        usuario: req.usuarioAuth.id
    }

    // Borrado Lógico con cambio de estado = false
    const producto = await Producto.findByIdAndUpdate( id, data, {new:true});
    
    res.status(201).json(producto);
    
}

module.exports = 
{
    productoPost, 
    productoGet, 
    productoXIdGet, 
    productoPut, 
    productoDelete
}
