module.exports = {
  // parent, args, context ({ db }) and info are available on all resolvers
  users(parent, args, { db }, info) {
    if (!args.query) {
      return db.users
    }
    return db.users.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase()))
  },
  me(parent, args, { db }, info) {
    // Usually dynamic from a lookup
    return {
      id: 'g2345j234j5hg',
      name: 'Zuby',
      email: 'zubes@example.com',
      age: 49 // optional as no ! in def
    }
  },
  posts(parent, args, { db }, info) {
    if (!args.query) {
      return db.posts
    }
    return db.posts.filter((post) => {
      const search = args.query.toLowerCase()
      const title = post.title.toLowerCase()
      const body = post.body.toLowerCase()
      return title.includes(search) || body.includes(search)
    })
  },
  comments(parent, args, { db }, info) {
    return db.comments
  }
}
