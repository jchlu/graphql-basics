const { GraphQLServer } = require('graphql-yoga')
const { v4: uuidv4 } = require('uuid')
let { users, posts, comments } = require('./dummy-data')

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
      const { name, email, age = null } = args.data
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
    deleteUser(parent, args, ctx, info) {
      // userIndex from findIndex
      const userIndex = users.findIndex((user) => user.id === args.id)
      // if it equals -1 no user was found, throw Error
      if (userIndex === -1) { throw new Error('user not found') }
      // splice users using userIndex, 1 item
      const deletedUser = users.splice(userIndex, 1)[0]
      // filter posts, return true where not a match on author equals arg.id
      posts = posts.filter((post) => {
        const match = post.author === args.id
        // conditionally filter comments if there's a match,
        // returning if comment post not equal to post removed
        if (match) {
          comments = comments.filter((comment) => comment.post !== post.id)
        }
        return !match
      })
      // after filtering posts,
      // filter comments to leave only those where author not the arg id of the removed user
      comments = comments.filter((comment) => comment.author !== args.id)
      return deletedUser
    },
    createPost(parent, args, ctx, info) {
      const { title, body, published, author } = args.data
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
    deletePost(parent, args, ctx, info) {
      const postIndex = posts.findIndex((post) => post.id === args.id)
      if (postIndex === -1) { throw new Error('post not found') }
      const deletedPost = posts.splice(postIndex, 1)[0]
      comments = comments.filter((comment) => comment.post !== args.id)
      return deletedPost
    },
    createComment(parent, args, ctx, info) {
      const postExists = posts.some((post) => post.id === args.data.post && post.published)
      const authorExists = users.some((user) => user.id === args.data.author)
      if (!postExists || !authorExists) {
        throw new Error('Either the post or author ID is incorrect')
      }
      const comment = {
        id: uuidv4(),
        ...args.data
      }
      comments.push(comment)
      return comment
    },
    deleteComment(parent, args, ctx, info) {
      const commentIndex = comments.findIndex((comment) => comment.id = args.id)
      if (commentIndex === -1) { throw new Error('comment not found') }
      return comments.splice(commentIndex, 1)[0]
    }
  }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers
})

server.start(() => {
  console.log('Server is up and running')
})
