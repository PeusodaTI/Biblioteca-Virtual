import { Router } from 'express'
import { prisma } from '../lib/prisma'
import z, { ZodError } from 'zod'

const coordenadorRouter = Router()

coordenadorRouter.post('/', async(request, response) => {   
    const bodySchema = z.object({
        nome: z.string({ 
            required_error: 'O campo nome é obrigatório' 
        }),
        telefone: z.string({ 
            required_error: 'O campo telefone é obrigatório e deve conter no mínimo 11 caracteres' 
        }).min(11),
        matricula: z.number({ 
            required_error: 'O campo matricula é obrigatório e deve conter no mínimo 3 caracteres' 
        }).min(3),
    })

    try {
        const { nome, telefone, matricula } = bodySchema.parse(request.body)

        const existCoordenador = await prisma.coordenador.findUnique({
            where: {
                matricula
            }
        })

        if (existCoordenador) {
            return response.status(400).json({ mensagem: 'Já existe um coordenador com essa matricula.' })
        }

        const coordenador = await prisma.coordenador.create({
            data: {
                nome,
                telefone,
                matricula
            }
        })

        return response.status(201).json({ mensagem: 'Coordenador criado com sucesso!', coordenador })

    } catch(error) {
        if (error instanceof ZodError) {
            return response.status(400).json({ error })
        }

        return response.status(500).json({ mensagem: 'Internal Server Error.', error })
    }
})

coordenadorRouter.get('/', async(request, response) => {
    const coordenadores = await prisma.coordenador.findMany({
        orderBy: {
            createAt: 'asc'
        }
    })

    return response.status(200).json(coordenadores)
})

coordenadorRouter.get('/:id', async(request, response) => {
    const paramsSchema = z.object({
        id: z.string({
            required_error: 'O campo Id deve ser do tipo string uuid'
        })
        .uuid(),
    })
    try {
        const { id } = paramsSchema.parse(request.params)

        const coordenador = await prisma.coordenador.findUnique({
            where: { id }
        })

        if (!coordenador) {
            return response.status(404).json({ mensagem: 'Não existe coordenador cadastrado com esse Id.' })
        }

        return response.status(200).json(coordenador)

    } catch (error) {
        if(error instanceof ZodError) {
            return response.status(400).json({ error })
        }

        return response.status(500).json({ mensagem: 'Internal Server Error.', error })
    }
})

coordenadorRouter.put('/:id', async(request, response) => {
    const paramsSchema = z.object({
        id: z.string().uuid()
    })
    const bodySchema = z.object({
        nome: z.string({ 
            required_error: 'O campo nome é obrigatório' 
        }),
        telefone: z.string({ 
            required_error: 'O campo telefone é obrigatório e deve ter no mínimo 11 caracteres' 
        }).min(11),
        matricula: z.number({ 
            required_error: 'O campo matricula é obrigatório e deve ter no mínimo 3 caracteres' 
        }).min(3),
    })

    try {
        const { id } = paramsSchema.parse(request.params)
        const { nome, telefone, matricula } = bodySchema.parse(request.body)

        const coordenador = await prisma.coordenador.findUnique({
            where: { id }
        })

        if (!coordenador) {
            return response.status(404).json({ mensagem: 'Não existe coordenador cadastrado com esse Id.' })
        }

        const coordenadorUpdate = await prisma.coordenador.update({
            where: {
                id
            },
            data: {
                nome,
                telefone,
                matricula
            }
        })
        
        return response.status(200).json({ mensagem: 'Coordenador atualizado com sucesso!', coordenadorUpdate })

    } catch(error) {
        if(error instanceof ZodError) {
            return response.status(400).json({ error })
        }

        return response.status(404).json({ mensagem: 'Não foi possível atualizar o coordenador, tente novamente.', error })
    }   
})

coordenadorRouter.delete('/:id', async(request, response) => {
    const paramsSchema = z.object({
        id: z.string({
            required_error: 'O campo Id deve ser do tipo string uuid'
        })
        .uuid(),
    })
    try {
        const { id } = paramsSchema.parse(request.params)

        const coordenador = await prisma.coordenador.findUnique({
            where: { id }
        })

        if (!coordenador) {
            return response.status(404).json({ mensagem: 'Não existe coordenador cadastrado com esse Id.' })
        }

        const coordenadorDelete = await prisma.coordenador.delete({
            where: {id}
        })

        return response.status(200).json({  message: 'Coordenador excluído.' })

    } catch (error) {
        if(error instanceof ZodError) {
            return response.status(400).json({ error })
        }

        return response.status(500).json({ mensagem: 'Internal Server Error.', error })
    }
})
export default coordenadorRouter