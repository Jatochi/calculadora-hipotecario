const { DataTypes} = require('sequelize');

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

module.exports = Credito;