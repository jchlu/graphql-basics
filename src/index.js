import { GraphQLServer } from 'graphql-yoga'

// Type Definitions (Schema)

const typeDefs = `
  type Query {
    title: String!
    price: Float!
    releaseYear: Int
    rating: Float
    inStock: Boolean!
  }
`

// Resolvers

const resolvers = {
  Query: {
    title() {
      return 'Sausages'
    },
    price() {
      return 20.5
    },
    releaseYear() {
      return 2020
    },
    rating() {
      return null
    },
    inStock() {
      return true
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => {
  console.log('Server is up and running')
})
