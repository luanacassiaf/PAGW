class GrafoBasico extends Grafo {

    constructor(container) {
        super(container);
    }

    esperar(time) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }
}
