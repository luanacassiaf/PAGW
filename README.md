# PAGW

>  Plataforma de Aprendizagem de Grafos via Web



![](1.png)

![](2.png)

### Features

* Crie seus grafos com rapidez e praticidade;
* Salve seus grafos em JSON para poder reusá-los;
* Exporte seus grafos como matriz de adjacência ou lista de adjacência;
* Exporte seus grafos como imagem PNG ou JPG;
* Escolha se seu grafo será um grafo direcionado ou não;
* Execute os algoritmos e veja seu passo-a-passo;

### Pré-requisitos

* Docker
* Docker-Compose
* Ctop

### Execução em Linux
#### Configuração

* Na primeira execução do projeto, deverá ser criado o container da aplicação a partir do comando:
```bash 
$ sudo docker-compose up --build
```
#### Executar o projeto

Há duas formas de executar o container da aplicação do projeto, uma delas é utilizando o Docker-Compose e a outra é utilizando o Ctop.

* Para subir o container da aplicação e executar o projeto, execute o comando:

```bash
$ sudo docker-compose up
```
* Para monitorar o container, execute o comando:

```bash 
$ sudo ctop
```
