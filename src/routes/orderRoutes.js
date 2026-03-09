import { Order, mapOrderToApiPayload } from '../models/order.js'
import {
  createOrderRequestSchema,
  errorMessageSchema,
  numeroPedidoParamsSchema,
  orderResponseSchema,
  updateOrderBodySchema,
  validationErrorSchema
} from '../schemas/orderSchemas.js'

export async function orderRoutes(fastify) {
// Criar um novo pedido
  fastify.post(
    '/order',
    {
      schema: {
        tags: ['Orders'],
        summary: 'Criar pedido',
        description: 'Cria um novo pedido a partir do payload da API e realiza o mapeamento dos campos para o formato armazenado no banco de dados.',
        body: createOrderRequestSchema,
        response: {
          201: orderResponseSchema,
          400: validationErrorSchema,
          409: errorMessageSchema,
          500: errorMessageSchema
        }
      }
    },
    async function (request, reply) {
      const { numeroPedido, valorTotal, dataCriacao, items } = request.body

      try {
        const createdOrder = await Order.create({
          orderId: numeroPedido,
          value: valorTotal,
          creationDate: new Date(dataCriacao),
          items: items.map((item) => ({
            productId: Number(item.idItem),
            quantity: item.quantidadeItem,
            price: item.valorItem
          }))
        })

        return reply.code(201).send(mapOrderToApiPayload(createdOrder))
      } catch (error) {
        if (error?.code === 11000) { //trata unique constraint do numeroPedido
          return reply.code(409).send({ message: 'Pedido com este numeroPedido já existe' })
        }
        request.log.error(error)
        return reply.code(500).send({ message: 'Erro ao criar pedido' })
      }
    }
  )

  // Listar pedidos do mais recente para o mais antigo
  fastify.get(
    '/order/list',
    {
      schema: {
        tags: ['Orders'],
        summary: 'Listar pedidos',
        description: 'Retorna todos os pedidos cadastrados, ordenados pela data de criação do mais recente para o mais antigo.',
        response: {
          200: {
            type: 'array',
            items: orderResponseSchema
          },
          500: errorMessageSchema
        }
      }
    },
    async function (request, reply) {
      try {
        const orders = await Order.find().sort({ creationDate: -1 })

        return reply.send(orders.map(mapOrderToApiPayload))
      } catch (error) {
        request.log.error(error)
        return reply.code(500).send({ message: 'Erro ao listar pedidos' })
      }
    }
  )

  // Busca um pedido pelo numeroPedido
  fastify.get(
    '/order/:numeroPedido',
    {
      schema: {
        tags: ['Orders'],
        summary: 'Buscar pedido por número',
        description: 'Retorna os dados de um pedido específico com base no número do pedido.',
        params: numeroPedidoParamsSchema,
        response: {
          200: orderResponseSchema,
          404: errorMessageSchema,
          500: errorMessageSchema
        }
      }
    },
    async function (request, reply) {
      const { numeroPedido } = request.params

      try {
        const order = await Order.findOne({ orderId: numeroPedido })

        if (!order) {
          return reply.code(404).send({ message: 'Pedido não encontrado' })
        }

        return reply.send(mapOrderToApiPayload(order))
      } catch (error) {
        request.log.error(error)
        return reply.code(500).send({ message: 'Erro ao buscar pedido' })
      }
    }
  )

  // Atualiza o pedido passando numeroPedido e os dados a serem atualizados no body
  fastify.put(
    '/order/:numeroPedido',
    {
      schema: {
        tags: ['Orders'],
        summary: 'Atualizar pedido',
        description: 'Atualiza os dados de um pedido existente com base no número do pedido informado.',
        params: numeroPedidoParamsSchema,
        body: updateOrderBodySchema,
        response: {
          200: orderResponseSchema,
          400: validationErrorSchema,
          404: errorMessageSchema,
          500: errorMessageSchema
        }
      }
    },
    async function (request, reply) {
      const { numeroPedido } = request.params
      const { valorTotal, dataCriacao, items } = request.body

      try {
        const updatedOrder = await Order.findOneAndUpdate(
          { orderId: numeroPedido },
          {
            value: valorTotal,
            creationDate: new Date(dataCriacao),
            items: items.map((item) => ({
              productId: Number(item.idItem),
              quantity: item.quantidadeItem,
              price: item.valorItem
            }))
          },
          { new: true }
        )

        if (!updatedOrder) {
          return reply.code(404).send({ message: 'Pedido não encontrado' })
        }

        return reply.send(mapOrderToApiPayload(updatedOrder))
      } catch (error) {
        request.log.error(error)
        return reply.code(500).send({ message: 'Erro ao atualizar pedido' })
      }
    }
  )

// Deleta o pedido passando numeroPedido
  fastify.delete(
    '/order/:numeroPedido',
    {
      schema: {
        tags: ['Orders'],
        summary: 'Excluir pedido',
        description: 'Exclui um pedido existente pelo numeroPedido. A operação é idempotente e retorna 204 mesmo se o pedido não existir.',
        params: numeroPedidoParamsSchema,
        response: {
          204: { type: 'null' },
          500: errorMessageSchema
        }
      }
    },
    async function (request, reply) {
      const { numeroPedido } = request.params

      try {
        await Order.deleteOne({ orderId: numeroPedido })

        return reply.code(204).send()
      } catch (error) {
        request.log.error(error)
        return reply.code(500).send({ message: 'Erro ao excluir pedido' })
      }
    }
  )
}
