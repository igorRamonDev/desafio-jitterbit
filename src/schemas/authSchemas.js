export const authRequestSchema = {
  type: 'object',
  required: ['username', 'password'],
  additionalProperties: false,
  properties: {
    username: { type: 'string', minLength: 1, example: 'jitterbit' },
    password: { type: 'string', minLength: 1, example: 'jitterbit123' }
  },
  example: {
    username: 'jitterbit',
    password: 'jitterbit123'
  }
}

export const authResponseSchema = {
  type: 'object',
  required: ['token', 'tokenType', 'expiresIn'],
  additionalProperties: false,
  properties: {
    token: {
      type: 'string',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    },
    tokenType: { type: 'string', example: 'Bearer' },
    expiresIn: { type: 'string', example: '1h' }
  },
  example: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    tokenType: 'Bearer',
    expiresIn: '1h'
  }
}
