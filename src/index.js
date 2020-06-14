import { GraphQLServer } from 'graphql-yoga'

// Type Definitions (Schema)

const typeDefs = `
  type Query {
    id: ID!
    name: String!
    age: Int!
    employed: Boolean!
    gpa: Float
  }
`

// Resolvers

const resolvers = {
  Query: {
    id() {
      return '53g45kj234g5kjh'
    },
    name() {
      return 'Johnny'
    },
    age() {
      return 49
    },
    employed() {
      return false
    },
    gpa() {
      return null
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
