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

Credito.prototype.calcularInteresMensual = function(){
    return this.tasaAnual/12;
}

/**
 * Genera el listado de objetos que representan una cuota.
 */
Credito.prototype.crearCuotas = function(){
    const listCuotas = [];
    const interesMensual = this.calcularInteresMensual(this.tasaAnual);
    const cuotaPeriodica = Cuota.calcularValorCuota(this.montoSolicitado, this.nCuotas, interesMensual);
    let capitalPagado = 0;
    for (let i = 0; i < this.nCuotas; i++) {
        const capitalRestante = this.montoSolicitado - capitalPagado;
        const interes = Cuota.calcularInteresPeriodo(capitalRestante, interesMensual);
        const capital = cuotaPeriodica-interes
        const periodo = Cuota.calcularRangoPeriodo(i, DateTime.now());
        const cuota = {
            periodo: i+1,
            monto: cuotaPeriodica,
            interes: interes,
            capital: capital,
            inicioPeriodo: periodo.inicio,
            finPeriodo: periodo.final,
            creditoId: this.id
        };
        listCuotas.push(cuota);
        capitalPagado += capital
    }
    return listCuotas;
}

/**
 * Realiza la insercion del credito y sus cuotas en la Base de datos
 * @returns confirmacion de transaccion.
 */
Credito.prototype.guardarCredito = function(cuotas){
    return new Promise( async (resolve, reject) => {
        const trans = await sequelize.transaction();
        try{

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