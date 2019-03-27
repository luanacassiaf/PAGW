class Grafo {

	constructor(containerId, loadFromLocalStorage = true) {
		this.containerId = containerId;
		this.uid = Date.now();
		this.modo = 0;
		this.velocidadeDaAnimacao = 500;
		this.direcionado = false;
		this.verticesSelecionadosParaConectar = [];
		this.interceptadoresDeAcao = [];
		this.grafo = cytoscape({
			container: document.getElementById(containerId),
			style: [
				{
					selector: ":selected",
					style: {
						'background-color': '#4426bb',
						'line-color': '#4426bb',
						'target-arrow-color': '#4426bb',
						'target-arrow-shape': function (ele) { return ele.data('direcionado') ? 'triangle' : 'none' },
					}
				},
				{
					selector: "node",
					style: {
						label: function (ele) { return ele.data('label') || "" }
					}
				},
				{
					selector: "edge",
					style: {
						label: function (ele) { return ele.data('peso') || "" },
						"edge-text-rotation": "autorotate",
						'curve-style': 'bezier',
						'target-arrow-shape': function (ele) { return ele.data('direcionado') ? 'triangle' : 'none' },
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
			const isNode = event.target && event.target.length !== undefined && event.target.isNode();
			const isEdge = event.target && event.target.length !== undefined && event.target.isEdge();
			this.onTap(event, event.target, isNode, isEdge);
			//Modo Inserir.
			if (this.modo == 1) {
				//Evita sobrepor novos vertices e permite sua seleção.
				if (!event.target || !event.target.length) {
					this.onInserirNovoVertice(event);
					this.atualizarRotuloDeTodosOsVertices();
				}
			}
			//Modo Conectar.
			else if (this.modo == 2) {
				//Um vertice foi selecionado.
				if (event.target && event.target.length && event.target.isNode()) {
					//Já tem um vertice selecionado.
					if (this.verticesSelecionadosParaConectar.length == 1) {
						//Conectar os vertices.
						this.onConectarDoisVertices(this.verticesSelecionadosParaConectar[0], event.target);
						this.verticesSelecionadosParaConectar = [];
					} else {
						this.verticesSelecionadosParaConectar.push(event.target);
					}
				}
			}
			//Modo Remover.
			else if (this.modo == 3) {
				//Algo foi selecionado.
				if (event.target && event.target.length) {
					if (event.target.isNode()) {
						this.onRemoverVertice(event.target);
						this.atualizarRotuloDeTodosOsVertices();
					} else if (event.target.isEdge()) {
						this.onRemoverAresta(event.target);
						this.atualizarRotuloDeTodosOsVertices();
					}
				}
			}
		});

		this.grafo.contextMenus({
			menuItems: this.obtainContextMenuItems()
		});

		if (loadFromLocalStorage && localStorage.grafo) {
			this.fromJson(JSON.parse(localStorage.grafo));
		}
	}

	adicionarInteceptadorDeAcao(action) {
		this.interceptadoresDeAcao.push(action);
	}

	executarAcao(action) {
		if(action === "selecionar") {
			this.habilitarModoSelecionar();
		} else if(action === "adicionar") {
			this.habilitarModoInserir();
		} else if(action === "conectar") {
			this.habilitarModoConectar();
		} else if(action === "remover") {
			this.habilitarModoRemover();
		} else if(action === "limpar") {
			this.limpar();
		}

		for(const actionHandler of this.interceptadoresDeAcao) {
			actionHandler(action);
		}
	}

	salvarGrafoTemporariamente() {
		localStorage.grafo = this.toJson();
	}

	onTap(event, target, isNode, isEdge) {
		event.stopPropagation();
		// nada.
	}

	obtainContextMenuItems() {
		return [];
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
		return this.grafo.png({ output: 'blob', full: true });
	}

	toJpg() {
		return this.grafo.jpg({ output: 'blob', full: true });
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

	limpar() {
		this.grafo.edges().remove();
		this.grafo.nodes().remove();
		this.salvarGrafoTemporariamente();
	}

	tamanho() {
		return this.grafo.nodes().size();
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
		this.salvarGrafoTemporariamente();
		this.grafo.nodes().removeListener("position");
		this.grafo.nodes().on("dragfreeon", this.salvarGrafoTemporariamente);
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
		this.salvarGrafoTemporariamente();
	}

	removerVerticeOuAresta(verticeOuAresta) {
		this.grafo.remove(verticeOuAresta);
		this.salvarGrafoTemporariamente();
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
		this.salvarGrafoTemporariamente();
	}

	obterMatrizDeAdjacencia() {
		//criar uma lista de vértices.
		const vertices = this.grafo.nodes().map((node) => node.id());
		//Cria a matriz.
		const n = vertices.length;
		const matriz = Array(n).fill(false).map(() => Array(n).fill(false));
		//pegar todas as arestas.
		this.grafo.edges().forEach((edge, i) => {
			//Preenche a matriz.
			let sourcePos = vertices.indexOf(edge.source().id());
			let targetPos = vertices.indexOf(edge.target().id());
			//Direcionado.
			matriz[sourcePos][targetPos] = { edge: edge, source: edge.source(), target: edge.target(), sourcePosition: sourcePos, targetPosition: targetPos };
			//Não Direcionado.
			if (!this.direcionado) {
				matriz[targetPos][sourcePos] = { edge: edge, source: edge.target(), target: edge.source(), sourcePosition: targetPos, targetPosition: sourcePos };
			}
		});
		return matriz;
	}

	obterListaDeAdjacencia() {
		//criar uma lista de vértices.
		const vertices = this.grafo.nodes().map((node) => node.id());
		//Cria a matriz.
		const n = vertices.length;
		const matriz = Array(n).fill(false).map(() => Array(0));
		//pegar todas as arestas.
		this.grafo.edges().forEach((edge, i) => {
			//Preenche a matriz.
			let sourcePos = vertices.indexOf(edge.source().id());
			let targetPos = vertices.indexOf(edge.target().id());
			//Direcionado.
			matriz[sourcePos].push({ edge: edge, source: edge.source(), target: edge.target(), position: targetPos, sourcePosition: sourcePos, targetPosition: targetPos });
			//matriz[sourcePos].sort();
			//Não Direcionado.
			if (!this.direcionado) {
				matriz[targetPos].push({ edge: edge, source: edge.target(), target: edge.source(), position: sourcePos, sourcePosition: sourcePos, targetPosition: targetPos });
				//matriz[targetPos].sort();
			}
		});
		return matriz;
	}

	obterMatrizDeAdjacenciaFormatada() {
		const matriz = this.obterMatrizDeAdjacencia();
		let res = '';
		for (let y = 0; y < matriz.length; y++) {
			if (y > 0) res += '\r\n';

			for (let x = 0; x < matriz[y].length; x++) {
				if (x > 0) res += ', ';
				res += matriz[y][x] ? '1' : '0';
			}
		}
		return res;
	}

	obterListaDeAdjacenciaFormatada() {
		const lista = this.obterListaDeAdjacencia();
		let res = '';
		for (let y = 0; y < lista.length; y++) {
			if (y > 0) res += '\r\n';

			res += y + ' ⟶ ';

			for (let x = 0; x < lista[y].length; x++) {
				if (x > 0) res += ' ⟶ ';
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
		super.inserirNovoVertice({ data: {}, x: x, y: y })
	}

	inserirNovaAresta(verticeId1, verticeId2, direcionado) {
		super.inserirNovaAresta({ data: { direcionado: direcionado, source: verticeId1, target: verticeId2 } })
	}

	removerVerticeOuAresta(verticeOuAresta) {
		super.removerVerticeOuAresta(verticeOuAresta);
	}

	executar(verticeInicial, verticeFinal) {
		//Matriz.
		const matriz = this.obterMatrizDeAdjacencia();
		const n = matriz.length;
		//Verificar os valores.
		if (verticeInicial < 0 ||
			verticeInicial >= n ||
			verticeFinal < 0 ||
			verticeFinal >= n) {
			return false;
		}

		const cor = Array(n).fill(0);
		const caminho = [];
		let fim = false;

		//Algoritmo DFS do notebook da maratona.
		function dfs(u, p) {
			cor[u] = 1; //grey.

			//Não é o vértice raiz.
			if (p >= 0) {
				const m = matriz[p][u];
				caminho.push(m);
			}

			//Vértice atual é o final.
			fim = u == verticeFinal;

			if (!fim) {
				for (let v = 0; v < n && !fim; v++) {
					//novo vértice.
					if (matriz[u][v] && v != p) {
						//forward edge.
						if (cor[v] == 0) {
							dfs(v, u);
						}
					}
					//back edge.
					else if (cor[v] == 1) {
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

		const stepper = new Stepper(caminho, 3, this.velocidadeDaAnimacao);
		stepper.executar((m, i, k) => {
			if (k == 0) {
				//Pinta o primeiro vértice com a cor verde.
				if (m.sourcePosition == verticeInicial) {
					m.source.addClass('start-node');
				} else {
					m.source.addClass('highlighted');
				}
			}
			else if (k == 1) {
				//Pinta a aresta.
				m.edge.addClass('highlighted');
			}
			else if (k == 2) {
				//Pinta o último vértice com a cor vermelha.
				if (m.targetPosition == verticeFinal) {
					m.target.addClass('end-node');
				} else {
					m.target.addClass('highlighted');
				}
			}
		});
	}
}

// Busca em largura.
class Bfs extends Grafo {

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
		super.inserirNovoVertice({ data: {}, x: x, y: y })
	}

	inserirNovaAresta(verticeId1, verticeId2, direcionado) {
		super.inserirNovaAresta({ data: { direcionado: direcionado, source: verticeId1, target: verticeId2 } })
	}

	removerVerticeOuAresta(verticeOuAresta) {
		super.removerVerticeOuAresta(verticeOuAresta);
	}

	executar(verticeInicial, verticeFinal) {
		//Matriz.
		const matriz = this.obterMatrizDeAdjacencia();
		const n = matriz.length;
		//Verificar os valores.
		if (verticeInicial < 0 ||
			verticeInicial >= n ||
			verticeFinal < 0 ||
			verticeFinal >= n) {
			return false;
		}

		const dist = Array(n).fill(false);
		const q = [];
		const caminho = [];

		//Algoritmo BFS do notebook da maratona.
		function bfs(s) {
			dist[s] = 0;
			q.push(s);

			while (q.length) {
				const u = q.shift();

				let fim = false;

				for (let v = 0; v < n && !fim; v++) {
					const m = matriz[u][v];
					if (dist[v] === false && m) {
						dist[v] = dist[u] + 1;
						q.push(v);
						// Adiciona a aresta ao caminho.
						caminho.push(m);
						// Encontrou o vértice final.
						fim = v == verticeFinal;
					}
				}

				if (fim) break;
			}
		}

		//Limpa os estilos.
		this.limparEstiloDoGrafo();

		//Executa o BFS.
		bfs(verticeInicial);
		console.log(caminho);

		const stepper = new Stepper(caminho, 3, this.velocidadeDaAnimacao);
		stepper.executar((m, i, k) => {
			if (k == 0) {
				//Pinta o primeiro vértice com a cor verde.
				if (m.sourcePosition == verticeInicial) {
					m.source.addClass('start-node');
				} else {
					m.source.addClass('highlighted');
				}
			}
			else if (k == 1) {
				//Pinta a aresta.
				m.edge.addClass('highlighted');
			}
			else if (k == 2) {
				//Pinta o último vértice com a cor vermelha.
				if (m.targetPosition == verticeFinal) {
					m.target.addClass('end-node');
				} else {
					m.target.addClass('highlighted');
				}
			}
		});
	}
}

// Dijkstra.
class Dijkstra extends Grafo {

	constructor(containerId) {
		super(containerId);
	}

	onInserirNovoVertice(event) {
		this.inserirNovoVertice(event.position.x, event.position.y);
	}

	onConectarDoisVertices(vertice1, vertice2) {
		this.inserirNovaAresta(vertice1.id(), vertice2.id(), this.direcionado, 1);
	}

	onRemoverVertice(vertice) {
		this.removerVerticeOuAresta(vertice);
	}

	onRemoverAresta(aresta) {
		this.removerVerticeOuAresta(aresta);
	}

	inserirNovoVertice(x, y) {
		super.inserirNovoVertice({ data: {}, x: x, y: y })
	}

	inserirNovaAresta(verticeId1, verticeId2, direcionado, peso) {
		super.inserirNovaAresta({ data: { peso: peso, direcionado: direcionado, source: verticeId1, target: verticeId2 } })
	}

	removerVerticeOuAresta(verticeOuAresta) {
		super.removerVerticeOuAresta(verticeOuAresta);
	}

	incrementarPesoDasArestasSelecionadas() {
		this.grafo.elements('edge:selected').forEach(function (edge) {
			const peso = edge.data("peso") || 0;
			edge.data("peso", peso + 1);
		});
		this.salvarGrafoTemporariamente();
	}

	decrementarPesoDasArestasSelecionadas() {
		this.grafo.elements('edge:selected').forEach(function (edge) {
			const peso = edge.data("peso") || 0;
			if (peso > 0) edge.data("peso", peso - 1);
		});
		this.salvarGrafoTemporariamente();
	}

	obtainContextMenuItems() {
		return [
			{
				id: 'alterar-peso',
				content: 'Alterar o peso da aresta',
				selector: 'edge',
				onClickFunction: (event) => {
					const target = event.target || event.cyTarget;
					const peso = parseInt(prompt("Insira o peso da aresta", target.data("peso")));
					if (peso && peso >= 0) {
						target.data("peso", peso);
						this.salvarGrafoTemporariamente();
					}
				},
				hasTrailingDivider: false
			},
		];
	}

	executar(verticeInicial, verticeFinal) {
		//Matriz.
		const matriz = this.obterMatrizDeAdjacencia();
		const n = matriz.length;
		//Verificar os valores.
		if (verticeInicial < 0 ||
			verticeInicial >= n ||
			verticeFinal < 0 ||
			verticeFinal >= n) {
			return false;
		}

		const dist = Array(n).fill(0xFFFFFFFF);
		const visitado = Array(n).fill(false);
		const caminho = [];
		const antecessor = Array(n).fill(false);

		function dijkstra(s, t) {
			dist[s] = 0;

			while (true) {
				let no = false; // vértice com o caminho mais curto.
				for (let i = 0; i < n; i++) {
					if (visitado[i] === false && (no === false || dist[i] < dist[no])) {
						no = i;
					}
				}

				if (no === false) break;

				visitado[no] = true; // Elimina o nó.

				for (let i = 0; i < n; i++) {
					const m = matriz[no][i];
					if (m) {
						const peso = m.edge.data("peso") || 0;
						if ((dist[no] + peso) < dist[i]) {
							dist[i] = dist[no] + peso;
							antecessor[i] = no;
						}
					}
				}

				if (no === verticeFinal) break;
			}

			console.log(`distancia de ${s} até ${t}: ${dist[t]}`);
		}

		function percorrerAntecessores(v) {
			if (antecessor[v] === false) return;
			percorrerAntecessores(antecessor[v]);
			const m = matriz[antecessor[v]][v];
			caminho.push(m);
		}

		//Limpa os estilos.
		this.limparEstiloDoGrafo();

		dijkstra(verticeInicial, verticeFinal);
		percorrerAntecessores(verticeFinal);

		const stepper = new Stepper(caminho, 3, this.velocidadeDaAnimacao);
		stepper.executar((m, i, k) => {
			if (k == 0) {
				//Pinta o primeiro vértice com a cor verde.
				if (m.sourcePosition == verticeInicial) {
					m.source.addClass('start-node');
				} else {
					m.source.addClass('highlighted');
				}
			}
			else if (k == 1) {
				//Pinta a aresta.
				m.edge.addClass('highlighted');
			}
			else if (k == 2) {
				//Pinta o último vértice com a cor vermelha.
				if (m.targetPosition == verticeFinal) {
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
			if (etapa < this.etapas.length) {
				action(this.etapas[etapa], etapa, subetapa);
				subetapa++;
				if ((subetapa % this.quantidadeDeSubEtapas) == 0) {
					subetapa = 0;
					etapa++;
				}
				setTimeout(percorrerEtapas, this.delay);
			}
		};

		setTimeout(percorrerEtapas, startDelay || this.delay);
	}
}

class Cavalo {

	constructor(tabuleiroId, loadFromLocalStorage = true) {
		this.tabuleiroId = tabuleiroId;
		this.matriz = Array(8).fill(false).map(() => Array(8).fill(false));
		this.fim = false;
		this.inicio = false;
		this.modo = 0; // 0 = proibido, 1 = inicio, 2 = fim.
		this.interceptadoresDeAcao = [];

		try {
			if (loadFromLocalStorage && localStorage.cavalo) {
				this.fromJson(JSON.parse(localStorage.cavalo));
			}
		} catch (e) {
			// nada.
		}

		this.gerarTabuleiro();
	}

	adicionarInteceptadorDeAcao(action) {
		this.interceptadoresDeAcao.push(action);
	}

	executarAcao(action) {
		if(action === "definir-inicio") {
			this.definirModo(1);
		} else if(action === "definir-fim") {
			this.definirModo(2);
		} else if(action === "definir-proibido") {
			this.definirModo(0);
		} else if(action === "limpar") {
			this.limpar();
		}

		for(const actionHandler of this.interceptadoresDeAcao) {
			actionHandler(action);
		}
	}

	definirModo(modo) {
		this.modo = modo;
	}

	definirInicio(x, y) {
		this.inicio = { x: x, y: y };
		this.matriz[y][x] = false;
		this.gerarTabuleiro();
		this.salvarGrafoTemporariamente();
	}

	removerInicio(x, y) {
		this.inicio = false;
		this.gerarTabuleiro();
		this.salvarGrafoTemporariamente();
	}

	definirFim(x, y) {
		this.fim = { x: x, y: y };
		this.matriz[y][x] = false;
		this.gerarTabuleiro();
		this.salvarGrafoTemporariamente();
	}

	removerFim(x, y) {
		this.fim = false;
		this.gerarTabuleiro();
		this.salvarGrafoTemporariamente();
	}

	definirProibido(x, y) {
		this.matriz[y][x] = true;
		if (this.inicio && this.inicio.x == x && this.inicio.y == y) this.inicio = false;
		if (this.fim && this.fim.x == x && this.fim.y == y) this.fim = false;
		this.gerarTabuleiro();
		this.salvarGrafoTemporariamente();
	}

	removerProibido(x, y) {
		this.matriz[y][x] = false;
		this.gerarTabuleiro();
		this.salvarGrafoTemporariamente();
	}

	definir(x, y) {
		// Proibido.
		if (this.modo === 0) {
			if (this.matriz[y][x]) {
				this.removerProibido(x, y);
			} else {
				this.definirProibido(x, y);
			}
		}
		else if (this.modo === 1) {
			this.definirInicio(x, y);
			this.removerProibido(x, y);
		}
		else if (this.modo === 2) {
			this.definirFim(x, y);
			this.removerProibido(x, y);
		}
	}

	limpar() {
		this.matriz = Array(8).fill(false).map(() => Array(8).fill(false));
		this.inicio = false;
		this.fim = false;
		this.gerarTabuleiro();
		this.salvarGrafoTemporariamente();
	}

	gerarTabuleiro() {
		let res = "";
		for (let y = 0; y < 8; y++) {
			res += "<tr>";
			for (let x = 0; x < 8; x++) {
				// Marcado com proibido.
				if (this.inicio &&
					this.inicio.x == x &&
					this.inicio.y == y) {
					res += `<td onclick='grafo.definir(${x}, ${y})' class='inicio'></td>`;
				}
				else if (this.fim &&
					this.fim.x == x &&
					this.fim.y == y) {
					res += `<td onclick='grafo.definir(${x}, ${y})' class='fim'></td>`;
				}
				else if (this.matriz[y][x]) {
					res += `<td onclick='grafo.definir(${x}, ${y})' class='proibido'></td>`;
				} else {
					res += `<td onclick='grafo.definir(${x}, ${y})' class='livre'></td>`;
				}
			}
			res += "</tr>\n";
		}

		$(this.tabuleiroId).html(res);
	}

	toJson() {
		return JSON.stringify({
			inicio: this.inicio,
			fim: this.fim,
			matriz: this.matriz
		});
	}

	fromJson(data) {
		this.inicio = data.inicio;
		this.fim = data.fim;
		this.matriz = data.matriz;
	}

	salvarGrafoTemporariamente() {
		localStorage.cavalo = this.toJson();
	}

	executar() {
		// Verifica se tem início e fim definidos.
		if (this.inicio == false || this.fim == false) {
			return;
		}

		// https://www.geeksforgeeks.org/minimum-steps-reach-target-knight/
		function cavaloBFS(inicio, fim) {
			// Posições válidas do cavalo.
			const dx = [-2, -1, 1, 2, -2, -1, 1, 2];
			const dy = [-1, -2, -2, -1, 1, 2, 2, 1];
			// Fila para armazenar as posições do cavalo no tabuleiro.
			const q = [];
			// Posição inicial do cavalo.
			q.push({ x: inicio.x, y: inicio.y });
			// Matriz de posições e distancias visitadas.
			const visitado = Array(8).fill(false).map(x => Array(8).fill(false));
			const dist = Array(8).fill(0).map(x => Array(8).fill(0));
			visitado[inicio.y][inicio.x] = true;
			const antecessores = Array(8).fill(false).map(x => Array(8).fill(false));
			const antecessores2 = Array(8).fill(false).map(x => Array(8).fill(false));

			function posicaoValida(x, y) {
				return x >= 0 && x < 8 && y >= 0 && y < 8;
			}

			function chegouAoFim(x, y) {
				return x === fim.x && y === fim.y;
			}

			// Pra baixo ou pra cima.
			function gerarAntecessoresBC(x, y, dx, dy) {
				const ix = dx > 0 ? -1 : 1;
				const iy = dy > 0 ? -1 : 1;
				let px = x;
				let py = y;
				while (true) {
					//antecessores2[py][px] = { x: px + ix, y: py };
					antecessores2[py][px] = `x: ${px + ix} y: ${py}`;
					px += ix;
					dx += ix;
					if (dx === 0) break;
				}
				while (true) {
					//antecessores2[py][px] = { x: px, y: py + iy };
					antecessores2[py][px] = `x: ${px} y: ${py + iy}`;
					py += iy;
					dy += iy;
					if (dy === 0) break;
				}
			}

			// Pra esquerda ou direita.
			function gerarAntecessoresED(x, y, dx, dy) {
				const ix = dx > 0 ? -1 : 1;
				const iy = dy > 0 ? -1 : 1;
				let px = x;
				let py = y;
				while (true) {
					//antecessores2[py][px] = { x: px, y: py + iy };
					antecessores2[py][px] = `x: ${px} y: ${py + iy}`;
					py += iy;
					dy += iy;
					if (dy === 0) break;
				}
				while (true) {
					//antecessores2[py][px] = { x: px + ix, y: py };
					antecessores2[py][px] = `x: ${px + ix} y: ${py}`;
					px += ix;
					dx += ix;
					if (dx === 0) break;
				}
			}

			function gerarAntecessores(x, y) {
				if (antecessores[y][x]) {
					const { cx, cy, ax, ay, dx, dy } = antecessores[y][x];

					if (Math.abs(dy) > Math.abs(dx)) {
						gerarAntecessoresBC(x, y, dx, dy);
					} else {
						gerarAntecessoresED(x, y, dx, dy);
					}

					gerarAntecessores(ax, ay);
				}
			}

			while (q.length) {
				const u = q.shift();

				// Chegou ao fim.
				if (chegouAoFim(u.x, u.y)) {
					break;
				}

				let fim = false;

				for (let i = 0; i < 8 && !fim; i++) {
					const x = u.x + dx[i];
					const y = u.y + dy[i];

					// TODO: NÃO TO VERIFICANDO POSIÇÃO PROIBIDA.
					if (posicaoValida(x, y) && !visitado[y][x]) {
						visitado[y][x] = true;
						q.push({ x: x, y: y });
						dist[y][x] = dist[u.y][u.x] + 1;
						antecessores[y][x] = { ax: u.x, ay: u.y, dx: dx[i], dy: dy[i], cx: x, cy: y };
						fim = chegouAoFim(x, y);
					}
				}

				if (fim) break;
			}

			gerarAntecessores(fim.x, fim.y);

			return antecessores2;
		}

		const antecessores = cavaloBFS(this.inicio, this.fim);

		console.log(antecessores);
	}
}
