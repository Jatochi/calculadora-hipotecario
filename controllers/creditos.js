const Connection = require('../database/config');
const Credito = require('../models/creditos/credito');
const sequelize = Connection.sequelize;

const creditoGet = async(req, res) => {
    await sequelize.sync({alter:true,drop:true});
    res.json({
        res:'Get credito'
    })
}

const creditoPost = async(req, res) => {
    const { nCuotas, montoSolicitado, tasaAnual, fechaInicio } = req.body;

    const credito = Credito.build({nCuotas, montoSolicitado, tasaAnual, fechaInicio});

    const listCuotas = credito.crearCuotas();

    credito.guardarCredito(listCuotas)
        .then(response  => {
            res.json({
                response
            })
        })
        .catch(error => {
            console.log(error);
            res.status(500).json('Error del servidor, favor contactar administrador.')
        });
}

module.exports = {
    creditoGet,
    creditoPost
}