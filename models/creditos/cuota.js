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
 * Calcula el valor de los periodos de un credito.
 * @param {INTEGER} monto 
 * @param {INTEGER} periodos 
 * @returns Integer con el valor del periodo del credito.
 */
Cuota.calcularValorCuota = function(monto, periodos){
    return monto/periodos;
}

/**
 * Calcula el inicio y fin de un periodo determinado.
 * @param {INTEGER} periodo 
 * @param {DateTime} fecha_inicio 
 * @returns Objeto con inicio y fin del periodo.
 */
Cuota.calcularPeriodo = function(periodo = 0, fecha_inicio = DateTime.now()) {
    const fecha_periodo = fecha_inicio.plus({ months: periodo })
    return {
        inicio: fecha_periodo.startOf('month'),
        final: fecha_periodo.endOf('month'),
    };
}

module.exports = Cuota;