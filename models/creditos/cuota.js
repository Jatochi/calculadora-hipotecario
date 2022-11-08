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

module.exports = Cuota;