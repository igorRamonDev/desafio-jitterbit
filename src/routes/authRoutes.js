import { authConfig } from '../config/auth.js'
import { authRequestSchema, authResponseSchema } from '../schemas/authSchemas.js'
import { errorMessageSchema } from '../schemas/orderSchemas.js'

export async function authRoutes(fastify) {
  fastify.post(
    '/auth',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Autenticar usuário',
        description: 'Valida credenciais via variáveis de ambiente e retorna um token JWT.',
        body: authRequestSchema,
        response: {
          200: authResponseSchema,
          401: errorMessageSchema
        }
      }
    },
    async function (request, reply) {
      const { username, password } = request.body

      if (username !== authConfig.username || password !== authConfig.password) {
        return reply.code(401).send({ message: 'Usuário ou senha inválidos' })
      }

      const signOptions = authConfig.jwtExpiresIn
        ? { expiresIn: authConfig.jwtExpiresIn }
        : undefined

      const token = fastify.jwt.sign({ username }, signOptions)

      return reply.send({
        token,
        tokenType: 'Bearer',
        expiresIn: authConfig.jwtExpiresIn
      })
    }
  )
}
