import { GraphQLServer } from 'graphql-yoga'

// Type Definitions (Schema)

const typeDefs = `
  type Query {
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`

// Resolvers

const resolvers = {
  Query: {
    me() {
      // Usually dynamic from a lookup
      return {
        id: 'g2345j234j5hg',
        name: 'Zuby',
        email: 'zubes@example.com',
        age: 49 // optional as no ! in def
      }
    },
    post() {
      return {
        id: '345jkh2l3k4j5h23',
        title: 'What\'s for tea',
        body: 'Sausages for me',
        published: true
      }
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
