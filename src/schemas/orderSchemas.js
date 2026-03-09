  export const numeroPedidoParamsSchema = {
    type: 'object',
    required: ['numeroPedido'],
    additionalProperties: false,
    properties: {
      numeroPedido: { type: 'string', minLength: 1, example: 'v10089016vdb' }
    },
    example: {
      numeroPedido: 'v10089016vdb'
    }
  }

  const orderItemApiSchema = {
    type: 'object',
    required: ['idItem', 'quantidadeItem', 'valorItem'],
    additionalProperties: false,
    properties: {
      idItem: { type: 'string', pattern: '^[0-9]+$', example: '2434' },
      quantidadeItem: { type: 'integer', minimum: 1, example: 1 },
      valorItem: { type: 'number', minimum: 0, example: 1000 }
    },
    example: {
      idItem: '2434',
      quantidadeItem: 1,
      valorItem: 1000
    }
  }

  export const createOrderRequestSchema = {
    type: 'object',
    required: ['numeroPedido', 'valorTotal', 'dataCriacao', 'items'],
    additionalProperties: false,
    properties: {
      numeroPedido: { type: 'string', minLength: 1, example: 'v10089016vdb' },
      valorTotal: { type: 'number', minimum: 0, example: 10000 },
      dataCriacao: {
        type: 'string',
        format: 'date-time',
        example: '2023-07-19T12:24:11.529Z'
      },
      items: {
        type: 'array',
        minItems: 1,
        items: orderItemApiSchema
      }
    },
    example: {
      numeroPedido: 'v10089016vdb',
      valorTotal: 10000,
      dataCriacao: '2023-07-19T12:24:11.529Z',
      items: [
        {
          idItem: '2434',
          quantidadeItem: 1,
          valorItem: 1000
        }
      ]
    }
  }

  export const orderResponseSchema = {
    type: 'object',
    required: ['numeroPedido', 'valorTotal', 'dataCriacao', 'items'],
    additionalProperties: false,
    properties: {
      numeroPedido: { type: 'string', minLength: 1, example: 'v10089016vdb' },
      valorTotal: { type: 'number', minimum: 0, example: 10000 },
      dataCriacao: {
        type: 'string',
        format: 'date-time',
        example: '2023-07-19T12:24:11.529Z'
      },
      items: {
        type: 'array',
        minItems: 1,
        items: orderItemApiSchema
      }
    },
    example: {
      numeroPedido: 'v10089016vdb',
      valorTotal: 10000,
      dataCriacao: '2023-07-19T12:24:11.529Z',
      items: [
        {
          idItem: '2434',
          quantidadeItem: 1,
          valorItem: 1000
        }
      ]
    }
  }

  export const updateOrderBodySchema = {
    type: 'object',
    required: ['valorTotal', 'dataCriacao', 'items'],
    additionalProperties: false,
    properties: {
      valorTotal: { type: 'number', minimum: 0, example: 10000 },
      dataCriacao: {
        type: 'string',
        format: 'date-time',
        example: '2023-07-19T12:24:11.529Z'
      },
      items: {
        type: 'array',
        minItems: 1,
        items: orderItemApiSchema
      }
    },
    example: {
      valorTotal: 10000,
      dataCriacao: '2023-07-19T12:24:11.529Z',
      items: [
        {
          idItem: '2434',
          quantidadeItem: 1,
          valorItem: 1000
        }
      ]
    }
  }

  export const errorMessageSchema = {
    type: 'object',
    required: ['message'],
    additionalProperties: false,
    properties: {
      message: { type: 'string', example: 'Pedido não encontrado' }
    },
    example: {
      message: 'Pedido não encontrado'
    }
  }

  export const validationErrorSchema = {
    type: 'object',
    required: ['statusCode', 'error', 'message'],
    additionalProperties: true,
    properties: {
      statusCode: { type: 'integer', example: 400 },
      error: { type: 'string', example: 'Bad Request' },
      message: { type: 'string', example: 'body/valorTotal must be >= 0' }
    },
    example: {
      statusCode: 400,
      error: 'Bad Request',
      message: 'body/valorTotal must be >= 0'
    }
  }
