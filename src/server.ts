import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerDocs from './swagger.json'
import cors from 'cors'

import coordenadorRouter from './routes/coordenador'
import livroRouter from './routes/livro'
import cursoRouter from './routes/curso'
import alunoRouter from './routes/aluno'
import emprestimoRouter from './routes/emprestimo'

const app = express()

app.use(express.json())

app.use(cors())

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use('/v1/coordenadores', coordenadorRouter)
app.use('/v1/livros', livroRouter)
app.use('/v1/cursos', cursoRouter)
app.use('/v1/alunos', alunoRouter)
app.use('/v1/emprestimos', emprestimoRouter)

app.get('/', (request, response) => {
   return response.send("Teste de Integridade")
})

app.listen(3333, () => {
    console.log("App on!")
})