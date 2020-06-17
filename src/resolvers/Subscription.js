module.exports = {
  // Subscriptions
  comment: {
    subscribe(parent, { postId }, { db, pubsub }, info) {
      const post = db.posts.find(p => p.id === postId && p.published)
      if (!post) { throw new Error('a published post with that id does not exist') }
      return pubsub.asyncIterator(`comment-${postId}`)
    }
  },
  post: {
    subscribe(parent, args, { pubsub }, info) {
      return pubsub.asyncIterator('post')
    }
  }
}