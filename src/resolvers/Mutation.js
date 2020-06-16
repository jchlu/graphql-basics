const { v4: uuidv4 } = require('uuid')

module.exports = {
  createUser(parent, args, { db }, info) {
    const { name, email, age = null } = args.data
    const emailTaken = db.users.some(user => user.email === email)
    if (emailTaken) {
      throw new Error('Email taken')
    }
    const user = {
      id: uuidv4(),
      name,
      email,
      age
    }
    db.users.push(user)
    return user
  },
  deleteUser(parent, args, { db }, info) {
    // userIndex from findIndex
    const userIndex = db.users.findIndex(user => user.id === args.id)
    // if it equals -1 no user was found, throw Error
    if (userIndex === -1) { throw new Error('user not found') }
    // splice db.users using userIndex, 1 item
    const deletedUser = db.users.splice(userIndex, 1)[0]
    // filter db.posts, return true where not a match on author equals arg.id
    db.posts = db.posts.filter(post => {
      const match = post.author === args.id
      // conditionally filter db.comments if there's a match,
      // returning if comment post not equal to post removed
      if (match) {
        db.comments = db.comments.filter(comment => comment.post !== post.id)
      }
      return !match
    })
    // after filtering db.posts,
    // filter db.comments to leave only those where author not the arg id of the removed user
    db.comments = db.comments.filter(comment => comment.author !== args.id)
    return deletedUser
  },
  createPost(parent, args, { db }, info) {
    const { title, body, published, author } = args.data
    const userExists = db.users.some(user => user.id === author)
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
    db.posts.push(post)
    return post
  },
  deletePost(parent, args, { db }, info) {
    const postIndex = db.posts.findIndex(post => post.id === args.id)
    if (postIndex === -1) { throw new Error('post not found') }
    const deletedPost = db.posts.splice(postIndex, 1)[0]
    db.comments = db.comments.filter(comment => comment.post !== args.id)
    return deletedPost
  },
  createComment(parent, args, { db }, info) {
    const postExists = db.posts.some(post => post.id === args.data.post && post.published)
    const authorExists = db.users.some(user => user.id === args.data.author)
    if (!postExists || !authorExists) {
      throw new Error('Either the post or author ID is incorrect')
    }
    const comment = {
      id: uuidv4(),
      ...args.data
    }
    db.comments.push(comment)
    return comment
  },
  deleteComment(parent, args, { db }, info) {
    const commentIndex = db.comments.findIndex(comment => comment.id = args.id)
    if (commentIndex === -1) { throw new Error('comment not found') }
    return db.comments.splice(commentIndex, 1)[0]
  }
}
