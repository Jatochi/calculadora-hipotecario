const { Sequelize } = require('sequelize');

class Connection{
    constructor(){
        this.sequelize = new Sequelize(
            process.env.DB_NAME, 
            process.env.DB_USER, 
            process.env.DB_PASS, 
            {
                host: 'localhost',
                dialect:'postgres',
                dialectOptions:{
                    applicationName:'calculadora-hipotecario'
                }
            },
        );
    }

    createConnection = async() => {
        try{
            await this.sequelize.authenticate();
            console.log('Se conecto a correctamente a la base de datos.')
        }catch(error){
            console.log('No se puede conectar con base de datos.', error);
        }
    }
}

module.exports = new Connection;