Monitoramento Digital de Programas Educacionais
Este repositório contém o código-fonte da plataforma de monitoramento de programas e projetos educacionais, desenvolvida como parte de um projeto de Iniciação Científica (PIBIC) no Instituto Federal de Brasília (IFB).

🎯 Sobre o Projeto
O objetivo desta aplicação é combater a "opacidade informacional", centralizando e apresentando de forma clara e acessível dados sobre políticas públicas educacionais implementadas em escolas de ensino médio do Plano Piloto, no Distrito Federal. A plataforma visa fortalecer o controle social, permitindo que a comunidade escolar e cidadãos em geral possam entender e fiscalizar a gestão educacional com base em evidências.

🛠️ Tecnologias Utilizadas
O projeto foi construído utilizando uma arquitetura full-stack moderna, com uma clara separação entre o back-end e o front-end.

Back-end:

Node.js: Ambiente de execução para o JavaScript no servidor.

Express.js: Framework para a construção da API RESTful e para servir os arquivos.

SQLite3: Banco de dados relacional, leve e baseado em arquivo, para persistência dos dados.

Front-end:

HTML5, CSS3, JavaScript (Vanilla JS): A base da interface do usuário.

Tailwind CSS: Framework de CSS para um design rápido, moderno e responsivo.

Leaflet.js: Biblioteca para a criação do mapa interativo.

Plotly.js: Biblioteca para a renderização dos gráficos de dados.

Ambiente e Ferramentas:

Git & GitHub: Para controle de versão e hospedagem do código.

Node Package Manager (npm): Para gerenciamento das dependências do projeto.

🚀 Como Executar o Projeto Localmente
Para testar a aplicação no seu próprio computador, siga os passos abaixo.

Pré-requisitos
Antes de começar, certifique-se de que você tem as seguintes ferramentas instaladas:

Node.js: (Que já inclui o npm). Você pode baixar em nodejs.org.

Git: Para clonar o repositório. Você pode baixar em git-scm.com.

Passo a Passo
Clone o Repositório

Abra seu terminal ou prompt de comando e clone o projeto para a sua máquina:

git clone https://github.com/thigoaraujo/monitoramento-digital-ptcc.git

Acesse a Pasta do Projeto

Navegue para a pasta que você acabou de criar:

cd monitoramento-digital-ptcc

Instale as Dependências

Este comando irá ler o arquivo package.json e instalar todas as dependências necessárias para o back-end (Express e SQLite):

npm install

Inicie o Servidor

Agora, inicie o servidor. Este comando executará o arquivo server.js.

npm start

Ao ser iniciado pela primeira vez, o servidor criará automaticamente o arquivo de banco de dados database.db e o populará com os dados iniciais das escolas e programas.

Você verá a mensagem Servidor rodando em http://localhost:3000 no seu terminal.

Acesse a Aplicação

Abra seu navegador de internet e acesse o seguinte endereço:

http://localhost:3000

Pronto! A página inicial do projeto deve carregar, e você poderá navegar por todas as seções, que estarão consumindo os dados diretamente do banco de dados local.
