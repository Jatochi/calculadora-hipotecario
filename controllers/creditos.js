const Connection = require('../database/config');
const Credito = require('../models/creditos/credito');
const TablaAmortizacionBuilder = require('../helpers/tablaAmortizacionFactory')

const sequelize = Connection.sequelize;

const creditoGet = async(req, res) => {
    
    res.json({
        res:'Get credito'
    })
}

const creditoPost = async(req, res) => {
    const { nCuotas, montoSolicitado, tasaAnual, fechaInicio } = req.body;

    const trans = await sequelize.transaction();
    try{
        const credito = await Credito.create({nCuotas, montoSolicitado, tasaAnual, fechaInicio}, {transaction: trans});

        const builder = new TablaAmortizacionBuilder();
        const tablaAmortizacion = await builder.crearTabla(credito);

        await tablaAmortizacion.cuotas.forEach(async cuota => {
            await cuota.save({transaction: this.trans});
        });

        await trans.commit();

        res.json([
            credito,
            tablaAmortizacion
        ])
    }catch(error){
        await trans.rollback();
        console.log(error);
        console.log(error.sql);
        res.status(500).json('Error de servidor, favor contactar administrador');
    }
}

module.exports = {
    creditoGet,
    creditoPost
}