const { DataTypes, Association } = require('sequelize');
const { DateTime } = require('luxon'); 

const Connection = require('../../database/config');
const Cuota = require('./cuota');

const sequelize = Connection.sequelize;

const Credito = sequelize.define('Credito', {
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    nCuotas: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    montoSolicitado: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    tasaAnual: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    fechaInicio: {
        type:DataTypes.DATE,
        allowNull:false,
    }
}, {
    schema: 'Creditos',
    paranoid: true,
});

Credito.hasMany(Cuota, {
    foreignKey: 'creditoId'
})

/**
 * Genera el listado de objetos de la clase Cuota perteneciente a un objeto credito.
 */
Credito.prototype.crearCuotas = function(){
    const listCuotas = [];
    const monto = Cuota.calcularValorCuota(this.montoSolicitado, this.nCuotas)
    for (let i = 0; i < this.nCuotas; i++) {
        const periodo = Cuota.calcularPeriodo(i, DateTime.now());
        const cuota = {
            periodo: i+1,
            monto,
            inicioPeriodo: periodo.inicio,
            finPeriodo: periodo.final,
            creditoId: this.id
        };
        listCuotas.push(cuota);
    }
    return listCuotas;
}

/**
 * 
 * @returns confirmacion de transaccion.
 */
Credito.prototype.guardarCredito = function(){
    return new Promise( async (resolve, reject) => {
        const trans = await sequelize.transaction();
        try{
            const cuotas = this.crearCuotas();

            const creditoCreated = await this.save({ transaction: trans });

            const cuotasCreated = await Cuota.bulkCreate(cuotas, { transaction: trans });

            await trans.commit();

            resolve([
                creditoCreated,
                cuotasCreated
            ])
        }catch(error){
            await trans.rollback();
            console.log(error);
            reject('Error al guardar data en base de datos');
        }
    })
}

module.exports = Credito;