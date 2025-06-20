/**
 * Query Management API Routes
 * CRUD operations for clinical trial data quality queries
 */

import { FastifyInstance } from 'fastify'
import {
  ICreateQueryRequest,
  IUpdateQueryRequest,
  IQueryResponse,
} from './schemas/query.interface'
import prisma from '../db/db_client'
import { serializer } from './middleware/pre_serializer'
import { ApiError } from '../errors'

// JSON Schema definitions for essential input validation
const createQuerySchema = {
  type: 'object',
  required: ['title', 'description', 'formDataId'],
  properties: {
    title: {
      type: 'string',
      minLength: 1,
      maxLength: 500,
    },
    description: {
      type: 'string',
      minLength: 1,
      maxLength: 2000,
    },
    formDataId: {
      type: 'string',
      pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
      minLength: 36,
      maxLength: 36,
    },
  },
  additionalProperties: false,
}

const updateQuerySchema = {
  type: 'object',
  properties: {
    description: {
      type: 'string',
      minLength: 1,
      maxLength: 2000,
    },
    status: {
      type: 'string',
      enum: ['OPEN', 'RESOLVED'],
    },
  },
  additionalProperties: false,
  minProperties: 1,
}

const queryIdParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      type: 'string',
      pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
      minLength: 36,
      maxLength: 36,
    },
  },
  additionalProperties: false,
}

/**
 * Registers query management routes with the Fastify application
 *
 * Architecture:
 * - Uses Fastify's built-in JSON schema validation for input validation
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
  }>(
    '',
    {
      schema: {
        body: createQuerySchema,
      },
    },
    async (req, reply) => {
      log.debug('Creating new query')
      try {
        const { title, description, formDataId } = req.body

        // Validate FormData exists
        const formData = await prisma.formData.findUnique({
          where: { id: formDataId },
        })

        if (!formData) {
          throw new ApiError('FormData not found', 404)
        }

        // Prevent duplicate queries per FormData
        const existingQuery = await prisma.query.findUnique({
          where: { formDataId },
        })

        if (existingQuery) {
          throw new ApiError('Query already exists for this FormData', 400)
        }

        const query = await prisma.query.create({
          data: {
            title,
            description: description || '',
            formDataId,
            status: 'OPEN',
          },
        })

        reply.status(201).send(query)
      } catch (err: any) {
        log.error({ err }, 'Failed to create query')
        if (err instanceof ApiError) {
          throw err
        }
        throw new ApiError('Failed to create query', 400)
      }
    }
  )

  /** PUT /queries/:id - Update an existing query */
  app.put<{
    Params: { id: string }
    Body: IUpdateQueryRequest
    Reply: IQueryResponse
  }>(
    '/:id',
    {
      schema: {
        params: queryIdParamsSchema,
        body: updateQuerySchema,
      },
    },
    async (req, reply) => {
      log.debug({ queryId: req.params.id }, 'Updating query')
      try {
        const { id } = req.params
        const updateData = req.body

        const query = await prisma.query.update({
          where: { id },
          data: updateData,
        })

        reply.send(query)
      } catch (err: any) {
        log.error({ err, queryId: req.params.id }, 'Failed to update query')

        if (err.code === 'P2025') {
          throw new ApiError('Query not found', 404)
        }

        throw new ApiError('Failed to update query', 400)
      }
    }
  )

  /** DELETE /queries/:id - Delete a query (bonus feature) */
  app.delete<{
    Params: { id: string }
  }>(
    '/:id',
    {
      schema: {
        params: queryIdParamsSchema,
      },
    },
    async (req, reply) => {
      log.debug({ queryId: req.params.id }, 'Deleting query')
      try {
        const id = req.params.id!

        await prisma.query.delete({
          where: { id },
        })

        reply.status(204).send()
      } catch (err: any) {
        log.error({ err, queryId: req.params.id }, 'Failed to delete query')

        if (err.code === 'P2025') {
          throw new ApiError('Query not found', 404)
        }

        throw new ApiError('Failed to delete query', 400)
      }
    }
  )
}

export default queryRoutes
