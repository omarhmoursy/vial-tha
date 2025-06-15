/**
 * Query Management API Routes
 * CRUD operations for clinical trial data quality queries
 */

import { FastifyInstance } from 'fastify'
import { ICreateQueryRequest, IUpdateQueryRequest, IQueryResponse } from './schemas/query.interface'
import prisma from '../db/db_client'
import { serializer } from './middleware/pre_serializer'
import { ApiError } from '../errors'

/**
 * Registers query management routes with the Fastify application
 * 
 * Architecture:
 * - Uses Fastify's type-safe route definitions
 * - Applies consistent response serialization
 * - Implements structured logging for monitoring
 * 
 * @param app - Fastify application instance
 */
async function queryRoutes(app: FastifyInstance) {
  // Apply consistent response serialization across all query routes
  app.setReplySerializer(serializer)

  // Create component-specific logger for better debugging and monitoring
  const log = app.log.child({ component: 'queryRoutes' })

  /** POST /queries - Create a new query */
  app.post<{
    Body: ICreateQueryRequest
    Reply: IQueryResponse
  }>('', {
    async handler(req, reply) {
      log.debug('Creating new query')
      try {
        const { title, description, formDataId } = req.body

        // Validate FormData exists
        const formData = await prisma.formData.findUnique({
          where: { id: formDataId }
        })

        if (!formData) {
          throw new ApiError('FormData not found', 404)
        }

        // Prevent duplicate queries per FormData
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
        log.error({ err }, 'Failed to create query')
        if (err instanceof ApiError) {
          throw err
        }
        throw new ApiError('Failed to create query', 400)
      }
    },
  })

  /** PUT /queries/:id - Update an existing query */
  app.put<{
    Params: { id: string }
    Body: IUpdateQueryRequest
    Reply: IQueryResponse
  }>('/:id', {
    async handler(req, reply) {
      log.debug({ queryId: req.params.id }, 'Updating query')
      try {
        const { id } = req.params
        const updateData = req.body

        const query = await prisma.query.update({
          where: { id },
          data: updateData
        })

        reply.send(query)
      } catch (err: any) {
        log.error({ err, queryId: req.params.id }, 'Failed to update query')
        
        if (err.code === 'P2025') {
          throw new ApiError('Query not found', 404)
        }
        
        throw new ApiError('Failed to update query', 400)
      }
    },
  })

  /** DELETE /queries/:id - Delete a query (bonus feature) */
  app.delete<{
    Params: { id: string }
  }>('/:id', {
    async handler(req, reply) {
      log.debug({ queryId: req.params.id }, 'Deleting query')
      try {
        const { id } = req.params

        await prisma.query.delete({
          where: { id }
        })

        reply.status(204).send()
      } catch (err: any) {
        log.error({ err, queryId: req.params.id }, 'Failed to delete query')
        
        if (err.code === 'P2025') {
          throw new ApiError('Query not found', 404)
        }
        
        throw new ApiError('Failed to delete query', 400)
      }
    },
  })
}

export default queryRoutes 