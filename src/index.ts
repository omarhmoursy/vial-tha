import build from './app'
import CORSConfig from '@fastify/cors'
import { FastifyInstance } from 'fastify'

const server: FastifyInstance = build({
  logger: {
    level: 'error',
  },
})

server.register(CORSConfig, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
})

// Health check endpoint for Render
server.get('/health', async (request, reply) => {
  return { status: 'OK', timestamp: new Date().toISOString() }
})

server
  .listen({ port: process.env.PORT || 8080, host: '0.0.0.0' })
  .then(address => {
    console.log(`Server listening at ${address}`)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
