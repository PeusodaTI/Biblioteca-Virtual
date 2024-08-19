import { Router } from 'express'
import { prisma } from '../lib/prisma'
import z, { ZodError } from 'zod'

const alunoRouter = Router()

alunoRouter.post('/', async(request, response) => {
    const bodySchema = z.object({
        cursoId: z.string({
            required_error: 'O campo id é obrigatório e do tipo uuid'
        }).uuid(),
        nome: z.string({
            required_error: 'O campo nome é obrigatório e deve conter no mínimo 5 caracteres.'
        }).min(5),
        matricula: z.number({
            required_error: 'O campo matricula é obrigatório e deve conter no mínimo 4 caracteres.'
        }).min(4)
    })

    try {
        const { cursoId, nome, matricula } = bodySchema.parse(request.body)

        const curso = await prisma.curso.findUnique({
            where: {
                id: cursoId
            }
        })

        if (!curso) {
            return response.status(400).json({ message: 'Não existe curso cadastrado com esse id.' })
        }

        const aluno = await prisma.aluno.findUnique({
            where: { matricula }
        })

        if (aluno) {
            return response.status(400).json({ message: 'Já existe aluno cadastrado com essa matricula.', aluno })
        }

        const alunoCreate = await prisma.aluno.create({
            data: {
                nome,
                matricula,
                cursoId
            }
        })

        return response.status(201).json(alunoCreate)

    } catch (error) {
        console.log(error)
        if (error instanceof ZodError) {
            return response.status(400).json({ error })
        }

        return response.status(500).json({ message: 'Internal Server Error.', error })
    }
})

alunoRouter.get('/', async(request, response) => {
    try {
        const alunos = await prisma.aluno.findMany({
            orderBy: {
                createdAt: 'asc'
            }, 
            include: {
                Curso: true
            }
        })

        return response.status(200).json(alunos)

    } catch (error) {
        return response.status(500).json({ message: 'Internal Server Error.', error })
    }
})

alunoRouter.get('/:id', async(request, response) => {
    const paramsSchema = z.object({
        id: z.string({
            required_error: 'O campo id é obrigatório e do tipo uuid.'
        }).uuid()
    })

    try {
        const { id } = paramsSchema.parse(request.params)

        const aluno = await prisma.aluno.findUnique({
            where: { id },
            include: {
                Curso: true
            }
        })

        if (!aluno) {
            return response.status(400).json({ message: 'Não existe aluno cadastrado com esse id.' })
        }

        return response.status(200).json(aluno)

    } catch (error) {
        if (error instanceof ZodError) {
            return response.status(400).json(error)
        }

        return response.status(500).json({ message: 'Internal Server Error.' })
    }
})

alunoRouter.put('/:id', async(request, response) => {
    const paramsSchema = z.object({
        id: z.string({
            required_error: 'O campo id é obrigatório e do tipo uuid.'
        }).uuid()
    })

    const bodySchema = z.object({
        cursoId: z.optional(z.string().uuid()),
        nome: z.string({
            required_error: 'O campo nome é obrigatório e deve conter no mínimo 5 caracteres.'
        }).min(5),
        matricula: z.number({
            required_error: 'O campo matricula é obrigatório e deve conter no mínimo 4 caracteres.'
        }).min(4)
    })
    
    try {
        const { id } = paramsSchema.parse(request.params)
        const { nome, matricula, cursoId } = bodySchema.parse(request.body)
        let cursoIdVerify: string

        const aluno = await prisma.aluno.findUnique({
            where: { id }
        })

        if (!aluno) {
            return response.status(400).json({ message: 'Não existe aluno cadastrado com esse id.' })
        } else {
            cursoId ? cursoIdVerify = cursoId : cursoIdVerify = aluno.cursoId as string
        }

        const alunoUpdate = await prisma.aluno.update({
            where: { id },
            data: {
                nome,
                matricula,
                cursoId: cursoIdVerify
            }
        })

        return response.status(200).json(alunoUpdate)

    } catch (error) {
        if (error instanceof ZodError) {
            return response.status(400).json(error)
        }

        return response.status(500).json({ message: 'Internal Server Error.' })
    }
})

alunoRouter.delete('/:id', async(request, response) => {
    const paramsSchema = z.object({
        id: z.string({
            required_error: 'O campo id é obrigatório e do tipo uuid.'
        }).uuid()
    })

    try {
        const { id } = paramsSchema.parse(request.params)

        const aluno = await prisma.aluno.findUnique({
            where: { id },
            include: {
                Curso: true
            }
        })

        if (!aluno) {
            return response.status(400).json({ message: 'Não existe aluno cadastrado com esse id.' })
        }

        await prisma.aluno.delete({
            where: { id }
        })
        
        return response.status(200).json({ message: 'Aluno excluído com sucesso.' })

    } catch (error) {
        if (error instanceof ZodError) {
            return response.status(400).json(error)
        }

        return response.status(500).json({ message: 'Internal Server Error.' })
    }
})

export default alunoRouter