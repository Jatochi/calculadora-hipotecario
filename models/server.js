const express = require('express');
const cors = require('cors');

const Connection = require('../database/config');

class Server {

    constructor(){
        this.app = express()
        this.port = process.env.PORT

        this.paths = {
            credito:'/api/credito'
        };

        //Conectar a base de datos
        this.conectarDB();

        //Middelwares
        this.middlewares();

        //Rutas de app
        this.routes();
    }

    async conectarDB(){
        await Connection.createConnection();
    }

    middlewares(){
        this.app.use(cors());

        this.app.use(express.json()); 
    }

    routes(){
        this.app.use(this.paths.credito, require('../routes/creditos'))
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Corriendo en puerto', this.port)
        });
    }

}

module.exports = Server;