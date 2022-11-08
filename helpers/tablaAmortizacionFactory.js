const { DateTime } = require('luxon'); 
const Cuota = require('../models/creditos/cuota');
const TablaAmortizacion = require('../models/creditos/tablaAmortizacion');
/**
 * Construye una tabla de amortizacion nueva en base a un credito.
 */
class TablaAmortizacionFactory{

    async crearTabla(credito){
        const listaCuotas = [];
        const interesMensual = this.#calcularInteresMensual(credito.tasaAnual);
        const cuotaPeriodica = this.#calcularValorCuota(credito.montoSolicitado, credito.nCuotas, interesMensual);
        let capitalPagado = 0;
        for (let i = 0; i < credito.nCuotas; i++) {
            const capitalRestante = credito.montoSolicitado - capitalPagado;
            const interes = this.#calcularInteresPeriodo(capitalRestante, interesMensual);
            const capital = this.#calcularCapitalPeriodo(cuotaPeriodica, interes);
            const periodo = this.#calcularRangoPeriodo(i, DateTime.now());
            const cuota = await Cuota.build({
                periodo: i+1,
                monto: cuotaPeriodica,
                interes: interes,
                capital: capital,
                inicioPeriodo: periodo.inicio,
                finPeriodo: periodo.final,
                creditoId: credito.id
            });
            listaCuotas.push(cuota);
            capitalPagado += capital;
        }
        const tablaAmortizacion = new TablaAmortizacion(listaCuotas);
        return tablaAmortizacion;
    }

    /**
     *Calcula el interes mensual de un credito.
     * @param {*} tasaAnual 
     * @returns 
     */
    #calcularInteresMensual = function(tasaAnual){
        return tasaAnual/12;
    }

    /**
     * Calcula el valor de las cuotas de un credito. Utilizado el metodo Frances para este calculo
     * @param {} monto 
     * @param {} periodos 
     * @param {} interesMensual
     * @returns Integer con el valor del periodo del credito.
    */
    #calcularValorCuota = function(monto, periodos, interesMensual){
        const resDenominador = 1 - ((1+interesMensual) ** -periodos);
        const resFraccion = interesMensual/resDenominador
        return Math.round(monto*resFraccion);
    }

    /**
     * Calculo de interes a pagar en un periodo determinado. Utilizado el metodo Frances para este calculo
     * @param {} montoPeriodo 
     * @param {} interesMensual 
     * @returns Integer con el valor del interes del periodo.
     */
    #calcularInteresPeriodo = function(montoPeriodo, interesMensual){
        return Math.round(montoPeriodo*interesMensual);
    }

    #calcularCapitalPeriodo = function(cuotaPeriodica, interes){
        return cuotaPeriodica-interes
    }

    /**
     * Calcula el inicio y fin de un periodo determinado.
     * @param {} periodo 
     * @param {} fecha_inicio 
     * @returns Objeto con inicio y fin del periodo.
     */
    #calcularRangoPeriodo = function(periodo = 0, fecha_inicio = DateTime.now()) {
        const fecha_periodo = fecha_inicio.plus({ months: periodo })
        return {
            inicio: fecha_periodo.startOf('month'),
            final: fecha_periodo.endOf('month'),
        };
    }
}

module.exports = TablaAmortizacionFactory;