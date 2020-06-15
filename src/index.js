import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/dist/v4'
import { users, posts, comments } from './dummy-data'

// Type Definitions (Schema)

const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    me: User!
    comments: [Comment!]!
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
    createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
    createComment(text: String!, author: ID!, post: ID!): Comment!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
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
        const search = args.query.toLowerCase()
        const title = post.title.toLowerCase()
        const body = post.body.toLowerCase()
        return title.includes(search) || body.includes(search)
      })
    },
    comments(parent, args, ctx, info) {
      return comments
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author)
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.post === parent.id)
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => post.author === parent.id)
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.author === parent.id)
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author)
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => post.id === parent.post)
    }
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const { name, email, age = null } = args
      const emailTaken = users.some((user) => user.email === email)
      if (emailTaken) {
        throw new Error('Email taken')
      }
      const user = {
        id: uuidv4(),
        name,
        email,
        age
      }
      users.push(user)
      return user
    },
    createPost(parent, args, ctx, info) {
      const { title, body, published, author } = args
      const userExists = users.some((user) => user.id === author)
      if (!userExists) {
        throw new Error('Author does not exist')
      }
      const post = {
        id: uuidv4(),
        title,
        body,
        published,
        author
      }
      posts.push(post)
      return post
    },
    createComment(parent, args, ctx, info) {
      const postExists = posts.some((post) => post.id === args.post && post.published)
      const authorExists = users.some((user) => user.id === args.author)
      if (!postExists || !authorExists) {
        throw new Error('Either the post or author ID is incorrect')
      }
      const comment = {
        id: uuidv4(),
        text: args.text,
        author: args.author,
        post: args.post
      }
      comments.push(comment)
      return comment
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
