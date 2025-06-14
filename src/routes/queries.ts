import { FastifyInstance } from 'fastify'
import { ICreateQueryRequest, IUpdateQueryRequest, IQueryResponse } from './schemas/query.interface'
import prisma from '../db/db_client'
import { serializer } from './middleware/pre_serializer'
import { ApiError } from '../errors'

async function queryRoutes(app: FastifyInstance) {
  app.setReplySerializer(serializer)

  const log = app.log.child({ component: 'queryRoutes' })

  // Create a new query
  app.post<{
    Body: ICreateQueryRequest
    Reply: IQueryResponse
  }>('', {
    async handler(req, reply) {
      log.debug('create new query')
      try {
        const { title, description, formDataId } = req.body

        // Check if FormData exists
        const formData = await prisma.formData.findUnique({
          where: { id: formDataId }
        })

        if (!formData) {
          throw new ApiError('FormData not found', 404)
        }

        // Check if query already exists for this FormData
        const existingQuery = await prisma.query.findUnique({
          where: { formDataId }
        })

        if (existingQuery) {
          throw new ApiError('Query already exists for this FormData', 400)
        }

        const query = await prisma.query.create({
          data: {
            title,
            description,
            formDataId,
            status: 'OPEN'
          }
        })

        reply.status(201).send(query)
      } catch (err: any) {
        log.error({ err }, err.message)
        if (err instanceof ApiError) {
          throw err
        }
        throw new ApiError('Failed to create query', 400)
      }
    },
  })

  // Update a query by ID
  app.put<{
    Params: { id: string }
    Body: IUpdateQueryRequest
    Reply: IQueryResponse
  }>('/:id', {
    async handler(req, reply) {
      log.debug('update query by id')
      try {
        const { id } = req.params
        const updateData = req.body

        const query = await prisma.query.update({
          where: { id },
          data: updateData
        })

        reply.send(query)
      } catch (err: any) {
        log.error({ err }, err.message)
        throw new ApiError('Failed to update query', 400)
      }
    },
  })

  // Delete a query by ID (Bonus)
  app.delete<{
    Params: { id: string }
  }>('/:id', {
    async handler(req, reply) {
      log.debug('delete query by id')
      try {
        const { id } = req.params

        await prisma.query.delete({
          where: { id }
        })

        reply.status(204).send()
      } catch (err: any) {
        log.error({ err }, err.message)
        throw new ApiError('Failed to delete query', 400)
      }
    },
  })
}

export default queryRoutes 