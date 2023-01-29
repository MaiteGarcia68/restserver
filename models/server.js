const express = require('express');
const cors = require('cors');

const { dbConnection } = require ('../database/config');
const fileUpload = require('express-fileupload');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categoria',
            productos:  '/api/producto',
            usuarios:   '/api/usuario',
            uploads:    '/api/uploads'
        }

        // Middlewares
        this.middlewares();

        //Conectar a BD
        this.conectDB();

        // Rutas de mi app
        this.routes();
    }

    async conectDB() {
        await dbConnection();
    }

    middlewares() {

        // CORS
        this.app.use(cors());

        // lectura y paseo del body
        this.app.use( express.json());

        // Carpeta Public
        this.app.use( express.static('public') );

        // Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes() {

        this.app.use(this.paths.auth,require('../routes/auth'));
        this.app.use(this.paths.buscar,require('../routes/buscar'));
        this.app.use(this.paths.categorias,require('../routes/categorias'));
        this.app.use(this.paths.productos,require('../routes/productos'));
        this.app.use(this.paths.usuarios,require('../routes/user'));
        this.app.use(this.paths.uploads,require('../routes/upload'));

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server corriendo en puerto', this.port)
        })
    }

}

module.exports = Server;
