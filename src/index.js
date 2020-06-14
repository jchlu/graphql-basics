import { GraphQLServer } from 'graphql-yoga'

// Type Definitions (Schema)

const typeDefs = `
  type Query {
    greeting(name: String): String!
    add(x: Float!, y: Float!): Float!
    grades: [Int!]!
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
    // parent, args, context (ctx) and info are available on all resolvers
    greeting(parent, args, ctx, info) {
      return args.name ? `Hello ${args.name}!` : 'Hello!'
    },
    grades(parent, args, ctx, info) {
      return [99, 80, 93]
    },
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
    },
    add(parent, args, ctx, info) {
      return args.x && args.y ? args.x + args.y : 0
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
