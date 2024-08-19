import { Router } from 'express'
import { prisma } from '../lib/prisma'
import z, { ZodError } from 'zod'

const emprestimoRouter = Router()

emprestimoRouter.post('/', async(request, response) => {
    const bodySchema = z.object({
        alunoId: z.string({
            required_error: 'O campo alunoId é obrigatório e do tipo uuid.'
        }).uuid(),
        livroId: z.string({
            required_error: 'O campo livroId é obrigatório e do tipo uuid.'
        }).uuid(),
        dataEmprestimo: z.coerce.date({
            required_error: 'O campo dataEmprestimo é obrigatório e do tipo date.'
        })
    })

    try {
        const { alunoId, livroId, dataEmprestimo } = bodySchema.parse(request.body)

        const livro = await prisma.livro.findUnique({
            where: {
                id: livroId,
                disponivel: true
            }
        })

        if (!livro) {
            return response.status(400).json({ message: 'Este livro já está emprestado.' })
        }

        const emprestimo = await prisma.emprestimo.create({
            data: {
                livroId,
                alunoId,
                dataEmprestimo
            }
        })

        await prisma.livro.update({
            where: { 
                id: livroId
            },
            data: {
                disponivel: false,
            }
        })

        return response.status(201).json(emprestimo)

    } catch (error) {
        if (error instanceof ZodError) {
            return response.status(400).json( error )
        }

        return response.status(500).json({ message: 'Internal Server Error', error })
    }
})

emprestimoRouter.get('/', async(request, response) => {
    try {
        const emprestimos = await prisma.emprestimo.findMany({
            orderBy: {
                dataEmprestimo: 'asc'
            }
        })

        return response.status(200).json( emprestimos )

    } catch (error) {
        return response.status(500).json({ message: 'Internal Server Error', error })
    }
})

emprestimoRouter.get('/:id', async(request, response) => {
    const paramsSchema = z.object({
        id: z.string({
            required_error: 'O campo id é obrigatório e do tipo uuid'
        }).uuid()
    })

    try {
        const { id } = paramsSchema.parse(request.params)

        const emprestimo = await prisma.emprestimo.findUnique({
            where: { id }
        })

        if (!emprestimo) {
            return response.status(400).json({ messagem: 'Não existe empréstimo de livro cadastrado com esse Id.' })
        }

        return response.status(200).json( emprestimo )

    } catch (error) {
        if (error instanceof ZodError) {
            return response.status(400).json( error )
        }

        return response.status(500).json({ message: 'Internal Server Error.', error })
    }
})

emprestimoRouter.put('/:id', async(request, response) => {
    const paramsSchema = z.object({
        id: z.string({
            required_error: 'O campo id é obrigatório e do tipo uuid'
        }).uuid()
    })

    const bodySchema = z.object({
        dataEmprestimo: z.coerce.date({
            required_error: 'O campo dataEmprestimo é obrigatório e do tipo date.'
        }),
        dataDevolucao: z.coerce.date({
            required_error: 'O campo dataEmprestimo é obrigatório e do tipo date.'
        })
    })

    try {
        const { id } = paramsSchema.parse(request.params)
        const { dataEmprestimo, dataDevolucao } = bodySchema.parse(request.body)

        const emprestimo = await prisma.emprestimo.findUnique({
            where: { id }
        })

        if (!emprestimo) {
            return response.status(400).json({ messagem: 'Não existe empréstimo de livro cadastrado com esse Id.' })
        }

        const emprestimoUpdate = await prisma.emprestimo.update({
            where: { id },
            data: {
                dataEmprestimo,
                dataDevolucao,
                Livro: {
                    update: {
                        disponivel: true
                    }
                }
            }
        })

        return response.status(200).json( emprestimoUpdate )

    } catch (error) {
        if (error instanceof ZodError) {
            return response.status(400).json( error )
        }

        return response.status(500).json({ message: 'Internal Server Error.', error })
    }  
})

emprestimoRouter.delete('/:id', async(request, response) => {
    const paramsSchema = z.object({
        id: z.string({
            required_error: 'O campo id é obrigatório e do tipo uuid'
        }).uuid()
    })

    try {
        const { id } = paramsSchema.parse(request.params)

        const emprestimo = await prisma.emprestimo.findUnique({
            where: { id },
            include: {
                Livro: true
            }
        })

        if (!emprestimo) {
            return response.status(400).json({ messagem: 'Não existe empréstimo de livro cadastrado com esse Id.' })
        }

        if (!emprestimo.dataDevolucao) {
            return response.status(400).json({ messagem: 'O livro ainda consta como emprestado.' })
        }

        await prisma.emprestimo.delete({
            where: { id },
        })

        return response.status(200).json({ message: 'Empréstimo excluído.' })

    } catch (error) {
        if (error instanceof ZodError) {
            return response.status(400).json( error )
        }

        return response.status(500).json({ message: 'Internal Server Error.', error })
    }
})

export default emprestimoRouter