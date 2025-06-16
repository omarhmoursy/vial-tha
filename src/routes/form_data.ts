/**
 * Form Data API Routes
 * Serves form data with associated query relationships for the frontend table
 */

import { FastifyInstance } from 'fastify'

import prisma from '../db/db_client'
import { serializer } from './middleware/pre_serializer'
import { ICountedFormData } from './schemas/formData.interface'
import { ApiError } from '../errors'

/**
 * Registers form data routes with the Fastify application
 *
 * This module contains the enhanced form-data endpoint that was modified
 * to include Query relationships, supporting the query management workflow.
 *
 * @param app - Fastify application instance
 */
async function formDataRoutes(app: FastifyInstance) {
  app.setReplySerializer(serializer)

  const log = app.log.child({ component: 'formDataRoutes' })

  /** GET /form-data - Fetch all form data with associated queries */
  app.get<{
    Reply: ICountedFormData
  }>('', async (req, reply) => {
    log.debug('Fetching form data with query relationships')
    try {
      const formData = await prisma.formData.findMany({
        include: {
          query: true, // Include related Query object (null if no query exists)
        },
      })
      reply.send({
        total: formData.length,
        formData,
      })
    } catch (err: any) {
      log.error({ err }, 'Failed to fetch form data')
      throw new ApiError('failed to fetch form data', 400)
    }
  })
}

export default formDataRoutes
