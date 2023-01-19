const express = require('express')
const cors = require('cors')

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuarioPath = '/api/usuario';

        // Middlewares
        this.middlewares();


        // Rutas de mi app

        this.routes();
    }

    middlewares() {

        // CORS
        this.app.use(cors());

        // lectura y paseo del body
        this.app.use( express.json());

        // Carpeta Public
        this.app.use( express.static('public') );


    }

    routes() {
        this.app.use(this.usuarioPath,require('../routes/user'));
        
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server corriendo en puerto', this.port)
        })
        
    }


}

module.exports = Server;
