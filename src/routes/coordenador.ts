import { Router } from 'express'
import { prisma } from '../lib/prisma'
import z from 'zod'

const coordenadorRouter = Router()

coordenadorRouter.post('/', async(request, response) => {   
    const bodySchema = z.object({
        nome: z.string({ 
            required_error: 'O campo nome é obrigatório' 
        }),
        telefone: z.string({ 
            required_error: 'O campo telefone deve ter no mínimo 11 caracteres' 
        }).min(11),
        matricula: z.number({ 
            required_error: 'O campo telefone deve ter no mínimo 3 caracteres' 
        }).min(3),
    })

    const { nome, telefone, matricula } = bodySchema.parse(request.body)

    const isCoordenador = await prisma.coordenador.findUnique({
        where: {
            matricula
        }
    })

    if (isCoordenador) {
        return response.status(400).json({ mensagem: 'Já existe um coordenador com essa matricula.' })
    }

    try {
        const coordenador = await prisma.coordenador.create({
            data: {
                nome,
                telefone,
                matricula
            }
        })

        return response.status(201).json({ mensagem: 'Coordenador criado com sucesso!', coordenador })

    } catch(error) {
        return response.status(500).json({ mensagem: 'Error ao tentar cadastrar coordenador. ', error })
    }
})

coordenadorRouter.get('/:id', async(request, response) => {
    const paramsSchema = z.object({
        id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const coordenador = await prisma.coordenador.findUnique({
        where: { id }
    })

    if (!coordenador) {
        return response.status(404).json({ mensagem: 'Não existe coordenador cadastro com esse Id.' })
    }

    return response.status(200).json(coordenador)
})

coordenadorRouter.get('/', async(request, response) => {
    const coordenadores = await prisma.coordenador.findMany({
        orderBy: {
            createAt: 'asc'
        }
    })

    if (!coordenadores) {
        return response.status(404).json({ mensagem: 'Não existe coordenadores cadastros no sistema.' })
    }

    return response.status(200).json(coordenadores)
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
            required_error: 'O campo telefone deve ter no mínimo 11 caracteres' 
        }).min(11),
        matricula: z.number({ 
            required_error: 'O campo telefone deve ter no mínimo 3 caracteres' 
        }).min(3),
    })

    const { id } = paramsSchema.parse(request.params)
    const { nome, telefone, matricula } = bodySchema.parse(request.body)

    const coordenador = await prisma.coordenador.findUnique({
        where: { id }
    })

    if (!coordenador) {
        return response.status(404).json({ mensagem: 'Não existe coordenador cadastro com esse Id.' })
    }

    try {
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
        return response.status(404).json({ mensagem: 'Não foi possível atualizar o coordenador, tente novamente.', error })
    }   
})

export default coordenadorRouter