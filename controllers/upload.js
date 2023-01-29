const { response } = require("express");

const path = require ('path');
const fs = require ('fs')


const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL )

const { subirArchivo } = require("../helpers");
const { Usuario, Producto} = require('../models');


const cargarArchivo = async(req, res=response) => {

    try {

        const nombre = await subirArchivo(req.files, ['txt','md'],'text/');
        res.json({nombre})

    } catch (msg) {
        res.status(400).json({msg})       
    }
    
}

const actualizarImagen = async(req, res=response) => {

    const {id, coleccion} = req.params;
    let modelo;

    switch (coleccion) {
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({msg: 'El producto No existe'});
            };
            break;

        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({msg: 'El usuario No existe'});
            };
            break;

        default:
            return res.status(500).json({msg: 'Se me olvido valiadr esto'});
    }

    // limpiar imagen previa
    try {
        if (modelo.img) {
            // hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img );
            if (fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen)
            }
        }
    } catch (error) {
        res.status(400).json({msg})       
    }

    const nombre = await subirArchivo(req.files, undefined,coleccion);
    modelo.img = nombre;
    await modelo.save();
    res.json(modelo)
}

const actualizarImagenCloudinary = async(req, res=response) => {

    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({msg: 'El producto No existe'});
            };
            break;

        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({msg: 'El usuario No existe'});
            };
            break;

        default:
            return res.status(500).json({msg: 'Se me olvido valiadr esto'});
    }

    // limpiar imagen previa
    if (modelo.img) {
        // hay que borrar la imagen del servidor
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr [ nombreArr.length -1 ];
        const [ public_id ] = nombre.split('.')
        cloudinary.uploader.destroy ( public_id);
    }

    const { tempFilePath } = req.files.archivo;

    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

    modelo.img = secure_url;

    await modelo.save();

    res.json(modelo)
}





const mostrarImagen = async (req, res= response) => {

    const { id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({msg: 'El producto No existe'});
            };
            break;

        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({msg: 'El usuario No existe'});
            };
            break;

        default:
            return res.status(500).json({msg: 'Se me olvido valiadr esto'});
    }

    let pathImagen;
   
    if (modelo.img) {
        pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img )
    } 
    else 
    {
        pathImagen = path.join(__dirname, '../assests', 'no-image.jpg' ) 
    };

    if (fs.existsSync( pathImagen)) {return res.sendFile( pathImagen )}

    res.json({ msg: 'falta  el place holder'})

}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen
}