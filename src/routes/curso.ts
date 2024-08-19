import { Router } from 'express'
import { prisma } from '../lib/prisma'
import z, { ZodError } from 'zod'

const cursoRouter = Router()

cursoRouter.post('/', async(request, response) => {
    const bodySchema = z.object({
        nome: z.string({
            required_error: 'O campo nome é obrigatório e deve conter pelo menos 4 caracteres.'
        }).min(4)
    })

    try {
        const { nome } = bodySchema.parse(request.body)

        const curso = await prisma.curso.create({
            data: {
                nome
            }
        })

        return response.status(200).json(curso)

    } catch (error) {
        if (error instanceof ZodError) {
            return response.status(400).json(error)
        }

        return response.status(500).json({ mensagem: 'Internal Server Error.', error })
    }
})

cursoRouter.get('/', async(request, response) => {
    try {
        const cursos = await prisma.curso.findMany({
            orderBy: {
                createdAt: 'asc'
            }
        })

        return response.status(200).json(cursos)

    } catch (error) {
        return response.status(500).json({ mensagem: 'Internal Server Error.', error })
    }
})

cursoRouter.get('/:id', async(request, response) => {
    const paramsSchema = z.object({
        id: z.string({
            required_error: 'O campo id é obrigatório e do tipo uuid'
        }).uuid()
    })

    try {
        const { id } = paramsSchema.parse(request.params)

        const curso = await prisma.curso.findUnique({
            where: { id }
        })

        if (!curso) {
            return response.status(400).json({ message: 'Não existe nenhum curso cadastrado com esse id.' })
        }

        return response.status(200).json(curso)
    
    } catch (error) {
        if (error instanceof ZodError) {
            return response.status(400).json(error)
        }

        return response.status(500).json({ mensagem: 'Internal Server Error.', error })
    }

})

cursoRouter.put('/:id', async(request, response) => {
    const bodySchema = z.object({
        nome: z.string({
            required_error: 'O campo nome é obrigatório e deve conter pelo menos 4 caracteres.'
        }).min(4)
    })
    
    const paramsSchema = z.object({
        id: z.string({
            required_error: 'O campo id é obrigatório e do tipo uuid'
        }).uuid()
    })

    try {
        const { nome } = bodySchema.parse(request.body)
        const { id } = paramsSchema.parse(request.params)

        const curso = await prisma.curso.findUnique({
            where: { id }
        })

        if (!curso) {
            return response.status(400).json({ message: 'Não existe nenhum curso cadastrado com esse id.' })
        }

        const cursoUpdate = await prisma.curso.update({
            where: {
                id
            },
            data: {
                nome
            }
        })

        return response.status(200).json(cursoUpdate)
    
    } catch (error) {
        if (error instanceof ZodError) {
            return response.status(400).json(error)
        }

        return response.status(500).json({ mensagem: 'Internal Server Error.', error })
    }
})

cursoRouter.delete('/:id', async(request, response) => {
    const paramsSchema = z.object({
        id: z.string({
            required_error: 'O campo id é obrigatório e do tipo uuid'
        }).uuid()
    })

    try {
        const { id } = paramsSchema.parse(request.params)

        const curso = await prisma.curso.findUnique({
            where: { id }
        })

        if (!curso) {
            return response.status(400).json({ message: 'Não existe nenhum curso cadastrado com esse id.' })
        }

        await prisma.curso.delete({
            where: {
                id
            }
        })

        return response.status(200).json({ message: 'Curso excluído.' })
    
    } catch (error) {
        if (error instanceof ZodError) {
            return response.status(400).json(error)
        }

        return response.status(500).json({ mensagem: 'Internal Server Error.', error })
    }
})

export default cursoRouter