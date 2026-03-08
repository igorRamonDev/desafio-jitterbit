# Desafio

Devera desenvolver uma API em Node.js usando o javascript.

Seu desafio é criar uma API simples para gerenciar os pedidos. A API deve permitir a criação, leitura,
atualização e exclusão de pedidos

## Endpoints 

Criar endpoints para as seguintes operações:

- Criar um novo pedido (obrigatorio)
  URL: `http://localhost:3000/order`
- Obter os dados do pedido por parametro na URL (obrigatorio)
  URL: `http://localhost:3000/order/v10089016vdb`
- Listar todos os pedidos (opcional)
  URL: `http://localhost:3000/order/list`
- Atualizar pedido por parametro na URL (opcional)070924
  URL: `http://localhost:3000/order/v10089016vdb`
- Deletar pedido por parametro na URL (opcional)
  URL: `http://localhost:3000/order/v10089016vdb`

Armazenar os dados dos pedidos em um banco de dados (Mongodb, SQL ou PostgreSql).

A API que criará o pedido no banco recebe no body o JSON abaixo:

```json
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}
```

Exemplo de request:

```bash
curl --location 'http://localhost:3000/order' \
  --header 'Content-Type: application/json' \
  --data '{
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 10000,
    "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
    "items": [
      {
        "idItem": "2434",
        "quantidadeItem": 1,
        "valorItem": 1000
      }
    ]
  }'
```

## Mapping

Esta API deverá sofrer uma transformação dos dados, ou seja, deverá fazer o mapping dos campos para
salvar no banco de dados. O JSON ficará desta forma:

```json
{
  "orderId": "v10089016vdb",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "productId": 2434,
      "quantity": 1,
      "price": 1000
    }
  ]
}
```

## Estrutura esperada para SQL ou PostgreSQL

- Tabela `Order`
  - Coluna: `orderId`
  - Coluna: `value`
  - Coluna: `creationDate`
- Tabela `Items`
  - Coluna: `orderId`
  - Coluna: `productId`
  - Coluna: `quantity`
  - Coluna: `price`

## Estrutura esperada para MongoDB

```json
{
  "_id": "ObjectId(64dab8a0f6b7183237d307f6)",
  "orderId": "v10089016vdb-01",
  "value": 10000,
  "creationDate": "ISODate(2023-07-19T12:24:11.529Z)",
  "items": [
    {
      "productId": 2434,
      "quantity": 1,
      "price": 1000,
      "_id": "ObjectId(64daba7d05bcc674899dc5bf)"
    }
  ],
  "__v": 0
}
```

## Criterios de avaliacao

- Funcionalidade completa dos requisitos minimos
- Codigo bem organizado e comentado
- Utilizacao adequada das convencoes de nomenclatura
- Tratamento de erros robusto e mensagens compreensiveis
- Uso correto das respostas HTTP adequadas para cada operacao
- Codigo hospedado em repositorio publico no GitHub, com commits organizados e mensagens claras
- Implementar autenticacao basica (ex.: JWT) (opcional)
- Documentar API com Swagger ou Postman (opcional)

## Instrucoes basicas do codigo

- Copiar .env.example para .env e configurar as variáveis
- Instalar dependencias com `npm install`
- Subir a API com `npm start`
- Para desenvolvimento com reload: `npm run dev`
- Testar e visualizar documentacao em `http://localhost:3000/docs`
- Bootstrap do servidor em `server.js`
- Endpoints implementados em `src/routes/orderRoutes.js`


## Banco de Dados

A aplicação utiliza MongoDB.

O projeto foi desenvolvido utilizando MongoDB Atlas (cluster gratuito), mas também pode ser executado com uma instância local do MongoDB.

Configure a variável de ambiente conforme o .env.example