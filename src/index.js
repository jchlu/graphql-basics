const { GraphQLServer } = require('graphql-yoga')
let db = require('./db')

const Query = require('./resolvers/Query')
const Post = require('./resolvers/Post')
const User = require('./resolvers/User')
const Comment = require('./resolvers/Comment')
const Mutation = require('./resolvers/Mutation')

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    User,
    Post,
    Comment
  },
  context: {
    db
  }
})

server.start(() => {
  console.log('Server is up and running')
})
