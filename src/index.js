const { GraphQLServer, PubSub } = require('graphql-yoga')
let db = require('./db')

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const Subscription = require('./resolvers/Subscription')
const Post = require('./resolvers/Post')
const User = require('./resolvers/User')
const Comment = require('./resolvers/Comment')

const pubsub = new PubSub()

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment
  },
  context: {
    db,
    pubsub
  }
})

server.start(() => {
  console.log('Server is up and running')
})
