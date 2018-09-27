class GrafoBasico extends Grafo {

    constructor(container) {
        super(container);
        
        this.primeiroVertice = null; //id do primeiro vertice selecionado a ser conectado.

        this.on('vertice', (id, params) => {
            //Primeiro...
            if (this.primeiroVertice === null) {
                this.primeiroVertice = id;
            }
            //Segunda...
            else {
                this.observable.emit('novaaresta', this.primeiroVertice, id);
                this.primeiroVertice = null;
            }
        });
    }
}
