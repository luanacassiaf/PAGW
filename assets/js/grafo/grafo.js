class Grafo {

  constructor(container) {
    this.observable = new EventEmitter();
    this.container = container;
    this.vertices = new vis.DataSet();
    this.arestas = new vis.DataSet();
    //Configurações.
    this.options = {
      layout: {
        randomSeed: 0,
        improvedLayout: false
      },
      nodes: {
        size: 18,
        shape: 'dot',
        borderWidth: 2,
        shadow: false,
        color: {
          border: '#CCC',
          background: '#CCC',
          highlight: {
            background: '#CCC',
            border: '#CCC'
          }
        },
        font: {
          size: 16,
          color: '#FFF'
        }
      },
      edges: {
        width: 2,
        smooth: {
          type: 'continuous',
          roundness: 0
        },
        color: {
          color: '#CCC',
          highlight: '#CCC'
        }
      },
      physics: {
        enabled: false
      }
    };
    this.grafo = null;
    this.ids = Array(1024).fill(false);
  }

  on(label, callback) {
    this.observable.addListener(label, callback);
  }

  gerar(qtde) {
    for (let i = 0; i < qtde; i++) {
      this.novoVertice({});
    }
  }

  gerarId() {
    for (let i = 0; i < this.ids.length; i++) {
      if (this.ids[i] === false) {
        this.ids[i] = true;
        return i;
      }
    }
    return false;
  }

  novoVertice(n) {
    let id = this.gerarId();
    n.id = id;
    n.label = `${id}`;
    this.vertices.add(n);
  }

  novaAresta(a) {
    this.arestas.add(a);
  }

  novaArestaEntreVertices(a, b) {
    this.novaAresta({
      from: a,
      to: b
    });
  }

  removerVertice(id) {
    this.ids[id] = false;
    this.vertices.remove(id);
  }

  removerAresta(id) {
    this.arestas.remove(id);
  }

  removerArestaSelecionada() {
    this.grafo.getSelectedEdges().forEach((element, index, array) => {
      this.removerAresta(element);
    });
  }

  removerVerticeSelecionado() {
    this.removerArestaSelecionada();
    this.grafo.getSelectedNodes().forEach((element, index, array) => {
      this.removerVertice(element);
    });
  }

  alternarDirecaoDaAresta(id) {

  }

  colorirVertice(id, cor) {
    this.vertices.update({
      id: id,
      color: cor
    });
  }

  descolorirVertice(id) {
    this.vertices.update({
      id: id,
      color: 'gray'
    });
  }

  descolorirTodosOsVertices() {
    this.vertices.forEach((item, id) => {
      this.descolorirVertice(id);
    });
  }

  colorirArestaPorVertices(a, b, cor) {
    let aresta = this.obterAresta(a, b)[0];
    if (aresta) {
      this.arestas.update({
        id: aresta.id,
        color: {
          color: cor,
          highlight: cor
        }
      });
    }
  }

  descolorirArestaPorVertices(a, b) {
    let aresta = this.obterAresta(a, b)[0];
    if (aresta) {
      this.descolorirArestaPorId(aresta.id);
    }
  }

  descolorirArestaPorId(id) {
    this.arestas.update({
      id: id,
      color: {
        color: 'gray',
        highlight: 'gray'
      }
    });
  }

  descolorirTodasAsArestas() {
    this.arestas.forEach((item, id) => {
      this.descolorirArestaPorId(id);
    });
  }

  obterAresta(a, b) {
    return this.arestas.get({
      filter: function(item) {
        return (item.from === a && item.to === b) ||
          (item.from === b && item.to === a);
      }
    });
  }

  criarListaDeAdjacencia() {
    let listaDeAdjacencia = new Map(); //guarda as relacoes entre vertices.
    //Monta os pares de vertices da aresta na lista de adjacencia.
    this.arestas.forEach((item, id) => {
      let from = item.from;
      let to = item.to;

      if (from !== -1 && to !== -1) {
        //Verifica se o vertice não existe no mapa e adiciona-o;
        if (listaDeAdjacencia.get(from) === undefined) {
          listaDeAdjacencia.set(from, []);
        }
        //Grafo direcionado.
        listaDeAdjacencia.get(from).push(to);
        //TODO DIFENCIAR ISSO.
        //Grafo não direcionado.
        if (listaDeAdjacencia.get(to) === undefined) {
          listaDeAdjacencia.set(to, []);
        }
        listaDeAdjacencia.get(to).push(from);
      }
    });
    return listaDeAdjacencia;
  }

  //matriz de inteiros.
  obterMatrizDeAdjacenciaBruto() {
    let matriz = Array(this.vertices.length).fill(0).map(x => Array(this.vertices
      .length).fill(0));
    let listaDeAdjacencia = this.criarListaDeAdjacencia();
    //Monta a matriz.
    for (let y = 0; y < this.vertices.length; y++) {
      for (let x = 0; x < this.vertices.length; x++) {

        if (listaDeAdjacencia.get(x) !== undefined &&
          listaDeAdjacencia.get(x).indexOf(y) !== -1) {
          matriz[x][y] = 1;
        } else {
          //nada.
        }
      }
    }
    return matriz;
  }

  obterMatrizDeAdjacencia(newLine) {
    let matriz = ''; //string com a matriz de adjacencia.
    let listaDeAdjacencia = this.criarListaDeAdjacencia();
    //Monta a matriz.
    for (let y = 0; y < this.vertices.length; y++) {
      let row = '';
      for (let x = 0; x < this.vertices.length; x++) {

        if (x > 0)
          row += ',';

        if (listaDeAdjacencia.get(x) !== undefined &&
          listaDeAdjacencia.get(x).indexOf(y) !== -1) {
          row += '1';
        } else {
          row += '0';
        }
      }

      matriz += row + (newLine || '</br>');
    }

    return matriz;
  }

  obterListaDeAdjacencia(newLine) {
    let matriz = ''; //string com a matriz de adjacencia.
    let listaDeAdjacencia = this.criarListaDeAdjacencia();
    //Monta a matriz.
    for (let y = 0; y < this.vertices.length; y++) {
      let row = '';

      for (let x = 0; x < this.vertices.length; x++) {
        if (listaDeAdjacencia.get(x) !== undefined &&
          listaDeAdjacencia.get(x).indexOf(y) !== -1) {
          if (row !== '') {
            row += ',';
          }
          row += x;
        }
      }

      matriz += row + (newLine || '</br>');
    }

    return matriz;
  }

  plotar() {
    //container do grafo.
    let elm = document.getElementById(this.container);
    //Dados: vertices e arestas.
    let data = {
      nodes: this.vertices,
      edges: this.arestas
    };
    //O grafo.
    this.grafo = new vis.Network(elm, data, this.options);
    //Evento de clique sobre a area do grafo.
    this.grafo.on("click", (params) => {
      let nodes = params.nodes;
      let edges = params.edges;
      let verticeSelecionado = null;
      let arestaSelecionada = null;
      //Se clicou no vértice...
      if (nodes.length > 0) {
        verticeSelecionado = nodes[0]; //id do vertice.
        this.observable.emit('vertice', verticeSelecionado, params);
      }
      //Se clicou na aresta...
      else if (edges.length > 0) {
        arestaSelecionada = edges[0]; //id da aresta.
        this.observable.emit('aresta', arestaSelecionada, params);
      }
      //Clicou no espaço vazio.
      else {
        this.observable.emit('espacovazio', params);
      }
    });
  }

  resetar() {
    //nada.
  }
}
