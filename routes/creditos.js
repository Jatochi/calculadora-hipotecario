const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const {
    creditoGet,
    creditoPost } = require('../controllers/creditos');

const router = Router();

router.get('/', creditoGet);

router.post('/', [
        check('nCuotas', 'Debe enviar un numero de cuotas valido (1-120)').isInt({min:1, max:120}),
        check('montoSolicitado', 'Debe enviar un monto solicitado valido').isCurrency({allow_decimal:false}),
        check('tasaAnual','Debe existir la tasa anual').isFloat({min:0, max:1}).toFloat(),
        check('fechaInicio').isISO8601().toDate().withMessage('El formato de la fecha debe ser valido'),
        validarCampos,
        ], creditoPost);

module.exports = router;