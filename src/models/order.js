import mongoose from 'mongoose'

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
export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)

export function mapOrderToApiPayload(orderDocument) {
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
