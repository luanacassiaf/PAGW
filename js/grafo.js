class Grafo {

	constructor(containerId) {
        this.containerId = containerId;
		this.uid = Date.now();
		this.modo = 0;
		this.velocidadeDaAnimacao = 500;
        this.direcionado = false;
		this.verticesSelecionadosParaConectar = [];
		this.grafo = cytoscape({
            container: document.getElementById(containerId),
            style: [
				{
                    selector: ":selected",
                    style: {
                        'background-color': '#4426bb',
						'line-color': '#4426bb'
					}
				},
                {
                    selector: "node",
                    style: {
                        label: function(ele) { return ele.data('label') }
                    }
				},
				{
					selector: "edge",
					style: {
						"edge-text-rotation": "autorotate",
						'curve-style': 'bezier',
						'target-arrow-shape': function(ele) { return ele.data('direcionado') ? 'triangle' : 'none' },
						'source-arrow-shape': 'none'
					}
				},
				{
					selector: '.highlighted',
					style: {
						'background-color': '#FF9800',
						'line-color': '#FF9800',
						'target-arrow-color': '#FF9800',
						'transition-property': 'background-color, line-color, target-arrow-color',
						'transition-duration': '0.5s'
					}
				},
				{
					selector: '.start-node',
					style: {
						'background-color': '#4CAF50'
					}
				},
				{
					selector: '.end-node',
					style: {
						'background-color': '#f44336'
					}
				}
            ],
            minZoom: 0.5,
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
					this.atualizarRotuloDeTodosOsVertices();
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

	toJson() {
		let json = JSON.stringify(this.grafo.json());
		return json;
	}

	fromJson(json) {
		delete json.style;
		this.grafo.startBatch();
		this.grafo.json(json);
		this.limparEstiloDoGrafo();
		this.atualizarRotuloDeTodosOsVertices();
		this.aplicarDirecaoDasArestas(this.direcionado);
		this.grafo.nodes().unselect();
		this.grafo.edges().unselect();
		this.grafo.endBatch();
	}

	toPng() {
		return this.grafo.png({output: 'blob', full: true});
	}

	toJpg() {
		return this.grafo.jpg({output: 'blob', full: true});
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

	definirVelocidadeDaAnimacao(velocidade) {
		this.velocidadeDaAnimacao = 1 + (1000 * velocidade / 100);
	}

	limparEstiloDoGrafo() {
		this.grafo.edges().removeClass('highlighted');
		this.grafo.nodes().removeClass('start-node');
		this.grafo.nodes().removeClass('end-node');
		this.grafo.nodes().removeClass('highlighted');
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
		//Seta cada vértice com sua posição i.
		this.grafo.nodes().forEach((node, i) => {
			node.data('label', i.toString());
		});
	}

	alternarDirecaoDasArestas() {
		this.aplicarDirecaoDasArestas(!this.direcionado);
	}

	aplicarDirecaoDasArestas(direcionado) {
		this.direcionado = direcionado;
		this.grafo.edges().data('direcionado', direcionado);
	}

	obterMatrizDeAdjacencia() {
		//criar uma lista de vértices.
		let vertices = this.grafo.nodes().map( (node) => node.id() );
		//Cria a matriz.
		const n = vertices.length;
		let matriz = Array(n).fill(false).map(() => Array(n).fill(false));
		//pegar todas as arestas.
		this.grafo.edges().forEach((edge, i) => {
			//Preenche a matriz.
			let sourcePos = vertices.indexOf(edge.source().id());
			let targetPos = vertices.indexOf(edge.target().id());
			//Direcionado.
			matriz[sourcePos][targetPos] = { edge: edge, source: edge.source(), target: edge.target(), sourcePosition: sourcePos, targetPosition: targetPos };
			//Não Direcionado.
			if(!this.direcionado) {
				matriz[targetPos][sourcePos] = { edge: edge, source: edge.target(), target: edge.source(), sourcePosition: targetPos, targetPosition: sourcePos };
			}
		});
		return matriz;
	}

	obterListaDeAdjacencia() {
		//criar uma lista de vértices.
		let vertices = this.grafo.nodes().map( (node) => node.id() );
		//Cria a matriz.
		const n = vertices.length;
		let matriz = Array(n).fill(false).map(() => Array(0));
		//pegar todas as arestas.
		this.grafo.edges().forEach((edge, i) => {
			//Preenche a matriz.
			let sourcePos = vertices.indexOf(edge.source().id());
			let targetPos = vertices.indexOf(edge.target().id());
			//Direcionado.
			matriz[sourcePos].push({ edge: edge, source: edge.source(), target: edge.target(), position: targetPos, sourcePosition: sourcePos, targetPosition: targetPos });
			//matriz[sourcePos].sort();
			//Não Direcionado.
			if(!this.direcionado) {
				matriz[targetPos].push({ edge: edge, source: edge.target(), target: edge.source(), position: sourcePos, sourcePosition: sourcePos, targetPosition: targetPos });
				//matriz[targetPos].sort();
			}
		});
		return matriz;
	}

	obterMatrizDeAdjacenciaFormatada() {
		let matriz = this.obterMatrizDeAdjacencia();
		let res = '';
		for(let y = 0; y < matriz.length; y++) {
			if(y > 0) res += '\r\n';

			for(let x = 0; x < matriz[y].length; x++) {
				if( x > 0) res += ', ';
				res += matriz[y][x] ? '1' : '0';
			}
		}
		return res;
	}

	obterListaDeAdjacenciaFormatada() {
		let lista = this.obterListaDeAdjacencia();
		let res = '';
		for(let y = 0; y < lista.length; y++) {
			if(y > 0) res += '\r\n';

			res += y + ' ⟶ ';

			for(let x = 0; x < lista[y].length; x++) {
				if( x > 0) res += ' ⟶ ';
				res += lista[y][x].position;
			}
		}
		return res;
	}

	executar() {
		//nada.
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
		this.inserirNovaAresta(vertice1.id(), vertice2.id(), this.direcionado);
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

	inserirNovaAresta(verticeId1, verticeId2, direcionado) {
		super.inserirNovaAresta({ data: { direcionado: direcionado, source: verticeId1, target: verticeId2 } })
	}

	removerVerticeOuAresta(verticeOuAresta) {
		super.removerVerticeOuAresta(verticeOuAresta);
	}

	executar(verticeInicial, verticeFinal) {
		//Matriz.
		let matriz = this.obterMatrizDeAdjacencia();
		const n = matriz.length;
		//Verificar os valores.
		if(verticeInicial < 0 ||
			verticeInicial >= n ||
			verticeFinal < 0 ||
			verticeFinal >= n) {
				return false;
		}

		let cor = Array(n).fill(0);
		let caminho = [];
		let fim = false;

		//Algoritmo DFS do notebook da maratona.
		function dfs(u, p) {
			cor[u] = 1; //grey.

			//Não é o vértice raiz.
			if(p >= 0 && !fim) {
				let m = matriz[p][u];
				caminho.push(m);
			}

			//Vértice atual é o final.
			fim = u == verticeFinal;

			if(!fim) {
				for(let v = 0; v < n; v++) {
					//novo vértice.
					if(matriz[u][v] && v != p) {
						//forward edge.
						if(cor[v] == 0) {
							dfs(v, u);
						}
					}
					//back edge.
					else if(cor[v] == 1) {
						//nada.
					}
					//cross edge em grafos direcionados.
					else {
						//nada.
					}
				}
			}

			cor[u] = 2; //black.
		}

		//Limpa os estilos.
		this.limparEstiloDoGrafo();

		//Executa o DFS.
		dfs(verticeInicial, -1);

		console.log(caminho);

		let stepper = new Stepper(caminho, 3, this.velocidadeDaAnimacao);
		stepper.executar((m, i, k) => {
			if(k == 0) {
				//Pinta o primeiro vértice com a cor verde.
				if(m.sourcePosition == verticeInicial) {
					m.source.addClass('start-node');
				} else {
					m.source.addClass('highlighted');
				}
			}
			else if(k == 1) {
				//Pinta a aresta.
				m.edge.addClass('highlighted');
			}
			else if(k == 2) {
				//Pinta o último vértice com a cor vermelha.
				if(m.targetPosition == verticeFinal) {
					m.target.addClass('end-node');
				} else {
					m.target.addClass('highlighted');
				}
			}
		});
	}
}

class Stepper {

	constructor(etapas, quantidadeDeSubEtapas, delay) {
		this.etapas = etapas;
		this.quantidadeDeSubEtapas = quantidadeDeSubEtapas;
		this.delay = delay;
	}

	executar(action, startDelay) {
		let etapa = 0;
		let subetapa = 0;
		let percorrerEtapas = () => {
			if(etapa < this.etapas.length) {
				action(this.etapas[etapa], etapa, subetapa);
				subetapa++;
				if((subetapa % this.quantidadeDeSubEtapas) == 0) {
					subetapa = 0;
					etapa++;
				}
				setTimeout(percorrerEtapas, this.delay);
			}
		};

		setTimeout(percorrerEtapas, startDelay || this.delay);
	}
}
