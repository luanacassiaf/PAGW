class Grafo {

	constructor(containerId) {
        this.containerId = containerId;
		this.uid = 0;
		this.modo = 0;
		this.direcionado = false;
		this.verticesSelecionadosParaConectar = [];
        this.grafo = cytoscape({
            container: document.getElementById(containerId),
            style: [
                {
                    selector: "node",
                    style: {
                        label: 'data(label)'
                    }
				},
				{
					selector: "edge",
					style: {
						"edge-text-rotation": "autorotate",
						'curve-style': 'bezier'
					}
				},
				{
					selector: ".orientado",
					style: {
						'target-arrow-shape': 'triangle',
						'source-arrow-shape': 'none'
					}
				},
				{
					selector: ".nao-orientado",
					style: {
						'target-arrow-shape': 'triangle',
						'source-arrow-shape': 'triangle'
					}
				}
            ],
            minZoom: 0.1,
			maxZoom: 4,
			wheelSensitivity: 0.1
		});

		//Evento de clique.
		this.grafo.on('tap', (event) => {
			console.log(event.target);
			//Modo Inserir.
			if(this.modo == 1) {
				//Evita sobrepor novos vertices e permite sua seleção.
				if(!event.target || !event.target.length) {
					this.onInserirNovoVertice(event);
					//this.atualizarRotuloDeTodosOsVertices();
				}
			}
			//Modo Conectar.
			else if(this.modo == 2) {
				//Um vertice foi selecionado.
				if(event.target && event.target.length && event.target.isNode()) {
					//Já tem um vertice selecionado.
					if(this.verticesSelecionadosParaConectar.length == 1) {
						//Conectar os vertices.
						this.onConectarDoisVertices(this.verticesSelecionadosParaConectar[0], event.target);
						this.verticesSelecionadosParaConectar = [];
					} else {
						this.verticesSelecionadosParaConectar.push(event.target);
					}
				}
			}
			//Modo Remover.
			else if(this.modo == 3) {
				//Um vertice foi selecionado.
				if(event.target && event.target.length) {
					if(event.target.isNode()) {
						this.onRemoverVertice(event.target);
						this.atualizarRotuloDeTodosOsVertices();
					} else if(event.target.isEdge()) {
						this.onRemoverAresta(event.target);
						this.atualizarRotuloDeTodosOsVertices();
					}
				}
			}
		});
	}

	habilitarModoSelecionar() {
		this.modo = 0;
	}

	habilitarModoInserir() {
		this.modo = 1;
	}

	habilitarModoConectar() {
		this.modo = 2;
	}

	habilitarModoRemover() {
		this.modo = 3;
	}

	inserirNovoVertice(data) {
		//Define um id único para o vértice.
		data.data.id = this.uid.toString();
		data.data.label = this.uid.toString();
		//Adiciona o novo vértice.
        this.grafo.add({
			group: "nodes",
			data: data.data,
			position: {
				x: data.x,
				y: data.y
			}
		});
		//Gera um novo id.
		this.uid++;
	}

	inserirNovaAresta(data) {
		//Define um id único para a aresta.
		data.data.id = this.uid.toString();
		//Adiciona a nova aresta.
        this.grafo.add({
			group: "edges",
			data: data.data
		});
		//Gerar um novo id.
		this.uid++;
	}

	removerVerticeOuAresta(verticeOuAresta) {
		this.grafo.remove(verticeOuAresta);
	}

	atualizarRotuloDeTodosOsVertices() {
		this.grafo.nodes().forEach((node, i) => {
			node.data('label', i.toString());
		});
	}

	alternarDirecaoDasArestas(direcionado) {
		this.direcionado = direcionado;
		this.grafo.edges().toggleClass('orientado', direcionado);
	}
}

//Busca em Profundidade.
class Dfs extends Grafo {

	constructor(containerId) {
		super(containerId);
	}

	onInserirNovoVertice(event) {
		this.inserirNovoVertice(event.position.x, event.position.y);
	}

	onConectarDoisVertices(vertice1, vertice2) {
		this.inserirNovaAresta(vertice1.id(), vertice2.id());
	}

	onRemoverVertice(vertice) {
		this.removerVerticeOuAresta(vertice);
	}

	onRemoverAresta(aresta) {
		this.removerVerticeOuAresta(aresta);
	}

	inserirNovoVertice(x, y) {
        super.inserirNovoVertice({ data: {}, x: x, y: y})
	}

	inserirNovaAresta(verticeId1, verticeId2) {
		super.inserirNovaAresta({ data: { source: verticeId1, target: verticeId2 } })
	}

	removerVerticeOuAresta(verticeOuAresta) {
		super.removerVerticeOuAresta(verticeOuAresta);
	}
}
