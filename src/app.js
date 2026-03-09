import Fastify from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import jwt from '@fastify/jwt'
import { connectDb } from './config/db.js'
import { authConfig } from './config/auth.js'
import { authRoutes } from './routes/authRoutes.js'
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

  await connectDb()

  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'API de Pedidos',
        description: 'API para cadastro e consulta de pedidos',
        version: '1.0.0'
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      servers: [{ url: 'http://localhost:3000' }],
      tags: [
        { name: 'Auth', description: 'Autenticacao de usuario' },
        { name: 'Orders', description: 'Operacoes de pedidos' }
      ]
    }
  })

  await fastify.register(swaggerUi, {
    routePrefix: '/docs'
  })

  fastify.get('/', async function (request, reply) {
    return reply.redirect('/docs')
  })

  await fastify.register(jwt, {
    secret: authConfig.jwtSecret
  })
  //Middleware de autenticação JWT para rotas protegidas
  fastify.decorate('authenticate', async function (request, reply) {
    try {
      await request.jwtVerify()
    } catch {
      return reply.code(401).send({ message: 'Token invalido ou ausente' })
    }
  })

  await fastify.register(authRoutes)
  await fastify.register(orderRoutes)

  return fastify
}
