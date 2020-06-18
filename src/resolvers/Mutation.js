const { v4: uuidv4 } = require('uuid')
const { PubSub } = require('graphql-yoga')

module.exports = {
  createUser(parent, { data }, { db }, info) {
    const emailTaken = db.users.some(u => u.email === data.email)
    if (emailTaken) {
      throw new Error('Email taken')
    }
    const user = {
      id: uuidv4(),
      ...data
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
    db.posts = db.posts.filter(p => {
      const match = p.author === id
      // conditionally filter db.comments if there's a match,
      // returning if comment post not equal to post removed
      if (match) {
        db.comments = db.comments.filter(c => c.post !== p.id)
      }
      return !match
    })
    // after filtering db.posts,
    // filter db.comments to leave only those where author not the arg id of the removed user
    db.comments = db.comments.filter(c => c.author !== id)
    return deletedUser
  },
  createPost(parent, { data }, { db, pubsub }, info) {
    const userExists = db.users.some(u => u.id === data.author)
    if (!userExists) {
      throw new Error('Author does not exist')
    }
    const post = {
      id: uuidv4(),
      ...data
    }
    db.posts.push(post)
    if (post.published) {
      pubsub.publish('post', {
        post: {
        mutation: 'CREATED',
        data: post
      }
    })
    }
    return post
  },
  updatePost(parent, { id, data: { title, body, published } }, { db, pubsub }, info) {
    const post = db.posts.find(p => p.id = id)
    const originalPost = { ...post }
    if (!post) { throw new Error('post not found') }
    if (typeof title === 'string') {
      post.title = title
    }
    if (typeof body === 'string') {
      post.body = body
    }
    if (typeof published === 'boolean') {
      post.published = published
      if (originalPost.published && !post.published) {
        // DELETED
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost
          }
        })
      } else if (!originalPost.published && post.published) {
        // CREATED
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post
          }
        })
      }
    } else if (post.published) {
      // UPDATED
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post
        }
      })
    }
    return post
  },
  deletePost(parent, { id }, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex(p => p.id === id)
    if (postIndex === -1) { throw new Error('post not found') }
    const post = db.posts.splice(postIndex, 1)[0]
    db.comments = db.comments.filter(c => c.post !== id)
    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post
        }
      })
    }
    return post
  },
  createComment(parent, { data }, { db, pubsub }, info) {
    const postExists = db.posts.some(p => p.id === data.post && p.published)
    const authorExists = db.users.some(u => u.id === data.author)
    if (!postExists || !authorExists) {
      throw new Error('Either the post or author ID is incorrect')
    }
    const comment = {
      id: uuidv4(),
      ...data
    }
    db.comments.push(comment)
    pubsub.publish(`comment-${data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment
      }})
    return comment
  },
  updateComment(parent, { id, data: { text } }, { db, pubsub }, info) {
    const comment = db.comments.find(c => c.id = id)
    if (!comment) { throw new Error('comment not found') }
    if (typeof text === 'string') {
      comment.text = text
    }
    pubsub.publish(`comment-${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    })
    return comment
  },
  deleteComment(parent, { id }, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(c => c.id = id)
    if (commentIndex === -1) { throw new Error('comment not found') }
    const comment = db.comments.splice(commentIndex, 1)[0]
    pubsub.publish(`comment-${comment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: comment
      }
    })
    return comment
  }
}
