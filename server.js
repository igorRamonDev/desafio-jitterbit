import Fastify from 'fastify'
import mongoose from 'mongoose'
import { connectDb } from './db_connect.js'

const fastify = Fastify({
  logger: true
})

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true, min: 1 },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  },
  {
    _id: true,
    id: false
  }
)

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    value: { type: Number, required: true, min: 0 },
    creationDate: { type: Date, required: true },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(items) => items.length > 0, 'items precisa ter ao menos 1 item']
    }
  },
  {
    collection: 'orders',
    versionKey: '__v'
  }
)

//evitar overwrite model  
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)

function mapOrderToApiPayload(orderDocument) {
  const order =
    typeof orderDocument?.toObject === 'function'
      ? orderDocument.toObject()
      : orderDocument

  return {
    numeroPedido: order.orderId,
    valorTotal: order.value,
    dataCriacao: order.creationDate,
    items: order.items.map((item) => ({
      idItem: String(item.productId),
      quantidadeItem: item.quantity,
      valorItem: item.price
    }))
  }
}

fastify.get('/', async function () {
  return { hello: 'world' }
})

// criar um novo pedido
fastify.post(
  '/order',
  {
    schema: {
      body: {
        type: 'object',
        required: ['numeroPedido', 'valorTotal', 'dataCriacao', 'items'],
        additionalProperties: false,
        properties: {
          numeroPedido: { type: 'string', minLength: 1 },
          valorTotal: { type: 'number', minimum: 0 },
          dataCriacao: { type: 'string', format: 'date-time' },
          items: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['idItem', 'quantidadeItem', 'valorItem'],
              additionalProperties: false,
              properties: {
                idItem: { type: 'string', pattern: '^[0-9]+$' },
                quantidadeItem: { type: 'integer', minimum: 1 },
                valorItem: { type: 'number', minimum: 0 }
              }
            }
          }
        }
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

//lista os pedidos ordenados pelos mais recentes primeiro
fastify.get(
  '/order/list',
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

//obter os dados do pedido pelo numeroPedido
fastify.get(
  '/order/:numeroPedido',
  {
    schema: {
      params: {
        type: 'object',
        required: ['numeroPedido'],
        additionalProperties: false,
        properties: {
          numeroPedido: { type: 'string', minLength: 1 }
        }
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

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`Server listening at ${address}`)
})