const { DateTime } = require('luxon');
const { DataTypes } = require('sequelize');
const Connection = require('../../database/config');

const sequelize = Connection.sequelize;

const Cuota = sequelize.define('Cuota', {
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    monto: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    interes: {
        type: DataTypes.DECIMAL,
    },
    capital: {
        type: DataTypes.DECIMAL,
    },
    periodo:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    inicioPeriodo: {
        type: DataTypes.DATE,
        allowNull: false
    },
    finPeriodo: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    schema: 'Creditos',
    paranoid: true,
});

/**
 * Calcula el valor de las cuotas de un credito. Utilizado el metodo Frances para este calculo
 * @param {INTEGER} monto 
 * @param {INTEGER} periodos 
 * @param {FLOAT} interesMensual
 * @returns Integer con el valor del periodo del credito.
 */
Cuota.calcularValorCuota = function(monto, periodos, interesMensual){
    const resDenominador = 1 - ((1+interesMensual) ** -periodos);
    const resFraccion = interesMensual/resDenominador
    return Math.round(monto*resFraccion);
}

/**
 * Calculo de interes a pagar en un periodo determinado. Utilizado el metodo Frances para este calculo
 * @param {INTEGER} montoPeriodo 
 * @param {FLOAT} interesMensual 
 * @returns Integer con el valor del interes del periodo.
 */
 Cuota.calcularInteresPeriodo = function(montoPeriodo, interesMensual){
    return Math.round(montoPeriodo*interesMensual);
}

/**
 * Calcula el inicio y fin de un periodo determinado.
 * @param {INTEGER} periodo 
 * @param {DateTime} fecha_inicio 
 * @returns Objeto con inicio y fin del periodo.
 */
Cuota.calcularRangoPeriodo = function(periodo = 0, fecha_inicio = DateTime.now()) {
    const fecha_periodo = fecha_inicio.plus({ months: periodo })
    return {
        inicio: fecha_periodo.startOf('month'),
        final: fecha_periodo.endOf('month'),
    };
}

module.exports = Cuota;