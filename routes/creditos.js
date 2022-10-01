const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const {
    creditoGet,
    creditoPost } = require('../controllers/creditos');

const router = Router();

router.get('/', creditoGet);

router.post('/', [
        check('nCuotas', 'Debe existir el numero de cuotas').not().isEmpty(),
        check('montoSolicitado', 'Debe existir el monto solicitad').not().isEmpty(),
        check('tasaAnual','Debe existir la tasa anual').not().isEmpty(),
        check('fechaInicio','Debe existir la fecha de inicio del credito').not().isEmpty(),
        validarCampos,
        ], creditoPost);

module.exports = router;