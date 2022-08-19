# pagw-improvements

> Aperfeiçoamentos na Plataforma de Aprendizagem de Grafos via Web

### Descrição do Projeto

Trabalho realizado no projeto pré-existente Plataforma de Aprendizagem de Grafos via Web, através do Programa Institucional Voluntário de Iniciação Científica (PIVIC).

Neste trabalho, foram detectadas algumas funcionalidades que poderiam ser melhoradas na plataforma e outras a serem implementadas. Assim, foi proposta a busca de soluções para melhorar a geração de imagens de matrizes e listas de adjacência, as quais eram geradas com cortes a partir de certa largura; feito o ajuste na geração de imagens, foram implementadas funções para geração de PDF. 

Além disso, o site desenvolvido em PHP na versão 7 foi hospedado em servidor que utiliza PHP 5.3. Por meio deste projeto, o site se tornou funcional em PHP 5.3 e pode ser acessado de forma adequada na hospedagem oferecida. 

Ademais, aperfeiçoamentos visuais foram realizados na plataforma para melhor usabilidade.

### Execução em Linux via Docker

#### Pré-requisitos
* Docker
* Docker-Compose

#### Configuração

* Na primeira execução do projeto, deverá ser criado o container da aplicação a partir do comando:
```bash 
$ sudo docker-compose up --build
```
#### Executar o projeto

* Para subir o container da aplicação e executar o projeto, utilize o comando:

```bash
$ sudo docker-compose up
