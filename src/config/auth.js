import 'dotenv/config'

function getEnvValue(name) {
  const value = process.env[name]

  if (typeof value !== 'string') {
    return undefined
  }

  const trimmedValue = value.trim()
  return trimmedValue.length > 0 ? trimmedValue : undefined
}

function getRequiredEnvValue(name) {
  const value = getEnvValue(name)

  if (!value) {
    throw new Error(`Erro: Definir ${name} no arquivo .env.`)
  }

  return value
}

export const authConfig = {
  jwtSecret: getRequiredEnvValue('JWT_SECRET'),
  jwtExpiresIn: getEnvValue('JWT_EXPIRES_IN') || '1h',
  username: getRequiredEnvValue('AUTH_USERNAME'),
  password: getRequiredEnvValue('AUTH_PASSWORD')
}
