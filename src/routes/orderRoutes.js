import { connectDb } from '../config/db.js'
import { Order, mapOrderToApiPayload } from '../models/order.js'
import {
  errorMessageSchema,
  numeroPedidoParamsSchema,
  orderApiSchema,
  updateOrderBodySchema
} from '../schemas/orderSchemas.js'

export async function orderRoutes(fastify) {
  fastify.post(
    '/order',
    {
      schema: {
        tags: ['Orders'],
        summary: 'Criar pedido',
        description: 'Cria um novo pedido',
        body: orderApiSchema,
        response: {
          201: orderApiSchema,
          409: errorMessageSchema,
          500: errorMessageSchema
        }
      }
    },
    async function (request, reply) {
      const { numeroPedido, valorTotal, dataCriacao, items } = request.body

      try {
        await connectDb()

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
        if (error?.code === 11000) {
          return reply.code(409).send({ message: 'numeroPedido já existe' })
        }
        request.log.error(error)
        return reply.code(500).send({ message: 'Erro ao criar pedido' })
      }
    }
  )

  // Lista todos os pedidos do mais recent para o mais antigo
  fastify.get(
    '/order/list',
    {
      schema: {
        tags: ['Orders'],
        summary: 'Listar pedidos',
        description: 'Lista todos os pedidos, do mais recente para o mais antigo',
        response: {
          200: {
            type: 'array',
            items: orderApiSchema
          },
          500: errorMessageSchema
        }
      }
    },
    async function (request, reply) {
      try {
        await connectDb()

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
        summary: 'Buscar pedido por numero',
        description: 'Retorna os dados de um pedido pelo numeroPedido',
        params: numeroPedidoParamsSchema,
        response: {
          200: orderApiSchema,
          404: errorMessageSchema,
          500: errorMessageSchema
        }
      }
    },
    async function (request, reply) {
      const { numeroPedido } = request.params

      try {
        await connectDb()

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
        description: 'Atualiza um pedido existente pelo numeroPedido',
        params: numeroPedidoParamsSchema,
        body: updateOrderBodySchema,
        response: {
          200: orderApiSchema,
          404: errorMessageSchema,
          500: errorMessageSchema
        }
      }
    },
    async function (request, reply) {
      const { numeroPedido } = request.params
      const { valorTotal, dataCriacao, items } = request.body

      try {
        await connectDb()

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
        description: 'Exclui um pedido existente pelo numeroPedido',
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
        await connectDb()

        await Order.deleteOne({ orderId: numeroPedido })

        return reply.code(204).send()
      } catch (error) {
        request.log.error(error)
        return reply.code(500).send({ message: 'Erro ao excluir pedido' })
      }
    }
  )
}
