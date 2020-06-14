import { GraphQLServer } from 'graphql-yoga'
import { users, posts } from './dummy-data'

// Type Definitions (Schema)

const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
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
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users
      }
      return users.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase()))
    },
    me(parent, args, ctx, info) {
      // Usually dynamic from a lookup
      return {
        id: 'g2345j234j5hg',
        name: 'Zuby',
        email: 'zubes@example.com',
        age: 49 // optional as no ! in def
      }
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts
      }
      return posts.filter((post) => {
        const search  = args.query.toLowerCase()
        const title = post.title.toLowerCase()
        const body = post.body.toLowerCase()
        return title.includes(search) || body.includes(search)
      })
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
