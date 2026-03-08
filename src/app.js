import Fastify from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { orderRoutes } from './routes/orderRoutes.js'

export async function buildApp() {
  const fastify = Fastify({
    logger: true,
    ajv: {
      customOptions: {
        strictSchema: false
      }
    }
  })

  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'API de Pedidos',
        description: 'API para cadastro e consulta de pedidos',
        version: '1.0.0'
      },
      servers: [{ url: 'http://localhost:3000' }],
      tags: [{ name: 'Orders', description: 'Operacoes de pedidos' }]
    }
  })

  await fastify.register(swaggerUi, {
    routePrefix: '/docs'
  })

  fastify.get('/', async function (request, reply) {
    return reply.redirect('/docs')
  })

  await fastify.register(orderRoutes)

  return fastify
}
