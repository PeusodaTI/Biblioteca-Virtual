import express from 'express'
import cors from 'cors'
import coordenadorRouter from './routes/coordenador'

const app = express()

app.use(express.json())

app.use(cors())

app.use('/v1/coordenadores', coordenadorRouter)

app.get('/', (request, response) => {
   return response.send("Teste de integridade")
})

app.listen(3333, () => {
    console.log("App on!")
})