const { v4: uuidv4 } = require('uuid')

module.exports = {
  createUser(parent, { data: { name, email, age = null } }, { db }, info) {
    const emailTaken = db.users.some(u => u.email === email)
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
  updateUser(parent, { id, data: { name, email, age } }, { db }, info) {
    // Check for user
    const user = db.users.find(u => u.id === id)
    // If no user, throw Error
    if (!user) { throw new Error('user not found') }
    // if typeof name / email are strings, change them
    if (typeof name === 'string') {
      user.name = name
    }
    if (typeof email === 'string' && email !== user.email) {
      // check email not in use already on another user
      if (db.users.some(u => u.email === email)) {
        throw new Error('that email is already in use')
      }
      user.email = email
    }
    // if age is not undefined, change it
    if (age !== undefined) {
      user.age = age
    }
    // return the user
    return user
  },
  deleteUser(parent, { id }, { db }, info) {
    // userIndex from findIndex
    const userIndex = db.users.findIndex(u => u.id === id)
    // if it equals -1 no user was found, throw Error
    if (userIndex === -1) { throw new Error('user not found') }
    // splice db.users using userIndex, 1 item
    const deletedUser = db.users.splice(userIndex, 1)[0]
    // filter db.posts, return true where not a match on author equals arg.id
    db.posts = db.posts.filter(post => {
      const match = post.author === id
      // conditionally filter db.comments if there's a match,
      // returning if comment post not equal to post removed
      if (match) {
        db.comments = db.comments.filter(c => c.post !== post.id)
      }
      return !match
    })
    // after filtering db.posts,
    // filter db.comments to leave only those where author not the arg id of the removed user
    db.comments = db.comments.filter(comment => comment.author !== id)
    return deletedUser
  },
  createPost(parent, { data: { title, body, published, author } }, { db }, info) {
    const userExists = db.users.some(u => u.id === author)
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
  updatePost(parent, { id, data: { title, body, published } }, { db }, info) {
    const post = db.posts.find(p => p.id = id)
    if (!post) { throw new Error('post not found') }
    if (typeof title === 'string') {
      post.title = title
    }
    if (typeof body === 'string') {
      post.body = body
    }
    if (typeof published === 'boolean') {
      post.published = published
    }
    return post
  },
  deletePost(parent, { id }, { db }, info) {
    const postIndex = db.posts.findIndex(p => p.id === id)
    if (postIndex === -1) { throw new Error('post not found') }
    const deletedPost = db.posts.splice(postIndex, 1)[0]
    db.comments = db.comments.filter(comment => comment.post !== id)
    return deletedPost
  },
  createComment(parent, { data: { text, author, post} }, { db }, info) {
    const postExists = db.posts.some(p => p.id === post && p.published)
    const authorExists = db.users.some(u => u.id === author)
    if (!postExists || !authorExists) {
      throw new Error('Either the post or author ID is incorrect')
    }
    const comment = {
      id: uuidv4(),
      text,
      author,
      post
    }
    db.comments.push(comment)
    return comment
  },
  updateComment(parent, { id, data: { text } }, { db }, info) {
    const comment = db.comments.find(c => c.id = id)
    if (!comment) { throw new Error('comment not found') }
    if (typeof text === 'string') {
      comment.text = text
    }
    return comment
  },
  deleteComment(parent, { id }, { db }, info) {
    const commentIndex = db.comments.findIndex(c => c.id = id)
    if (commentIndex === -1) { throw new Error('comment not found') }
    return db.comments.splice(commentIndex, 1)[0]
  }
}
