import { GraphQLServer } from 'graphql-yoga'

// Type Definitions (Schema)

const typeDefs = `
  type Query {
    hello: String!
    name: String!
    location: String!
    bio: String!
  }
`

// Resolvers

const resolvers = {
  Query: {
    hello() {
      return 'This is my first query!'
    },
    name() {
      return 'Johnny'
    },
    location() {
      return 'Las Terrenas, Républica Dominicana'
    },
    bio() {
      return 'Trainee beach bum, hanging out the the DR. ¡Hola a todos!'
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
