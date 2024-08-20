# API Biblioteca Virtual
[![NPM](https://img.shields.io/npm/l/react)]([(https://github.com/PeusodaTI/Biblioteca-Virtual/blob/main/LICENSE)]) 

# Sobre o projeto

https://render

API Bibliote Virtual é uma aplicação desenvolvida para aprimorar meus conhecimentos em desenvolvimento de API Restfull.

A aplicação consistem em uma ferramenta para gerência em empréstimos de livros para alunos. Assim, é possível realizar diversas interações envolvendo as quatro operações básicas de banco de dados, cadastro, leitura, atualização e exclusão.

A aplicação foi documentada utilizando a ferramenta Swagger UI. Desse modo, qualquer usuário pode testar os endpoints da aplicação através da interface de usuário.

## Layout Swagger
![Swagger](https://github.com/PeusodaTI/Biblioteca-Virtual/assets/swagger.png)

## Modelo conceitual
![Modelo Conceitual](https://github.com/PeusodaTI/Biblioteca-Virtual/assets/conceitual.png)

# Tecnologias utilizadas
## Back end
- Node
- Typescript
- Express
- Prisma
- Zod
- Docker
  
## UI
- Swagger UI

## Implantação em produção
- Back end: Render
- Banco de dados: Postgresql

# Como executar o projeto

## Back end
Pré-requisitos: Docker, Node v20.16.0, Npm v10.8.1 

```bash
# clonar repositório
git clone https://github.com/PeusodaTI/Biblioteca-Virtual.git

# entrar na pasta do projeto back end
cd biblioteca-virtual

# instalar dependências
npm install

# iniciar o docker para utilizar uma instância do banco de dados PostgreSql
docker compose up -d

# executar o projeto
npm run dev

# utilizar interface do Prisma para acompanhamento das persistências de dados
npx prisma studio

# acessar a interface da API
http://localhost:3333/api-docs

```

# Autor

Pedro Henrique Sousa Nascimento

https://www.linkedin.com/in/peusodati

