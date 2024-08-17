import { Router } from 'express'
import { prisma } from '../lib/prisma'
import z, {ZodError} from 'zod'

const livroRouter = Router()

livroRouter.post('/:coordenadorId', async(request, response) => {
    const paramsSchema = z.object({
        coordenadorId: z.string({
            required_error: 'O campo coordenadorId deve ser do tipo string uuid'
        })
        .uuid() 
    })

    const bodySchema = z.object({
        nome: z.string({ 
            required_error: 'O campo nome é obrigatório.'
        }),
        autor: z.string({
            required_error: 'O campo autor é obrigatório e deve conter pelo menos 5 caracteres.'
        }).min(5),
        descricao: z.string({
            required_error: 'O campo descrição é obrigatório e deve conter pelo menos 5 caracteres.'
        }).min(5),
    })

    try {
        const { coordenadorId } = paramsSchema.parse(request.params)
        const { nome, autor, descricao } = bodySchema.parse(request.body)

        const coordenador = await prisma.coordenador.findUnique({
            where: {
                id: coordenadorId
            }
        })

        if (!coordenador) {
            return response.status(404).json({ message: 'Não existe coordenador cadastrado com esse Id.' })
        }

        const livro = await prisma.livro.create({
            data: {
                nome,
                autor,
                descricao,
                disponivel: true,
                coordenadorId
            }
        })

        return response.status(201).json({ mensagem: 'Livro cadastrado com sucesso!', livro })

    } catch (error) {
        console.log(error)
        if (error instanceof ZodError) {
            return response.status(400).json({ error })
        }

        return response.status(500).json({ mensagem: 'Internal Server Error.', error })
    }
})

livroRouter.get('/', async(request, response) => {
    try {
        const livros = await prisma.livro.findMany({
            orderBy: {
                createdAt: 'asc'
            }
        })

        return response.status(200).json(livros)

    } catch (error) {
        return response.status(500).json({  message: 'Internal Server Error.', error })
    }
})

livroRouter.get('/:id', async(request, response) => {
    const paramsSchema = z.object({
        id: z.string({
            required_error: 'O campo id é obrigatório e deve ser do tipo uuid'
        }).uuid()
    })

    try {
        const { id } = paramsSchema.parse(request.params)

        const livro = await prisma.livro.findUnique({
            where: { id }
        })

        if (!livro) {
            return response.status(404).json({ message: 'Não existe livro cadastrado com esse Id.' })
        }

        return response.status(200).json(livro)

    } catch (error) {
        if(error instanceof ZodError) {
            return response.status(400).json({ error })
        }

        return response.status(500).json({ mensagem: 'Internal Server Error.', error })
    }
})

livroRouter.put('/:id', async(request, response) => {
    const paramsSchema = z.object({
        id: z.string({
            required_error: 'O campo id é obrigatório e deve ser do tipo uuid'
        }).uuid()
    })

    const bodySchema = z.object({
        nome: z.string({ 
            required_error: 'O campo nome é obrigatório.'
        }),
        autor: z.string({
            required_error: 'O campo autor é obrigatório e deve conter pelo menos 5 caracteres.'
        }).min(5),
        descricao: z.string({
            required_error: 'O campo descrição é obrigatório e deve conter pelo menos 5 caracteres.'
        }).min(5),
    })

    try {
        const { id } = paramsSchema.parse(request.params)
        const { nome, autor, descricao } = bodySchema.parse(request.body)

        const livro = await prisma.livro.findUnique({
            where: { id }
        })

        if (!livro) {
            return response.status(404).json({ message: 'Não existe livro cadastrado com esse Id.' })
        }

        const livroUpdate = await prisma.livro.update({
            data: {
                nome,
                autor,
                descricao,
            }, where: {
                id
            }
        })

        return response.status(200).json({ message: 'Livro atualizado.', livroUpdate })

    } catch (error) {
        if(error instanceof ZodError) {
            return response.status(400).json({ error })
        }

        return response.status(500).json({ mensagem: 'Internal Server Error.', error })
    }
})

livroRouter.delete('/:id', async(request, response) => {
    const paramsSchema = z.object({
        id: z.string({
            required_error: 'O campo id é obrigatório e deve ser do tipo uuid'
        }).uuid()
    })

    try {
        const { id } = paramsSchema.parse(request.params)

        const livro = await prisma.livro.findUnique({
            where: { id }
        })

        if (!livro) {
            return response.status(404).json({ message: 'Não existe livro cadastrado com esse Id.' })
        }

        await prisma.livro.delete({
            where: { id }
        })

        return response.status(200).json({ message: 'Livro excluído.' })

    } catch (error) {
        if(error instanceof ZodError) {
            return response.status(400).json({ error })
        }

        return response.status(500).json({ mensagem: 'Internal Server Error.', error })
    }
})

export default livroRouter
