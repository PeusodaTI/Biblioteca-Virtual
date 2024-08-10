import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerDocs from './swagger.json'
import cors from 'cors'

import coordenadorRouter from './routes/coordenador'

const app = express()

app.use(express.json())

app.use(cors())

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use('/v1/coordenadores', coordenadorRouter)

app.get('/', (request, response) => {
   return response.send("Teste de integridade")
})

app.listen(3333, () => {
    console.log("App on!")
})