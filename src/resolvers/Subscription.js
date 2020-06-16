module.exports = {
  // Subscriptions
  count: {
    subscribe(parent, args, { pubsub }, info) {
      let count = 0
      setInterval(() => {
        count++
        pubsub.publish('count', {
          count
        })
      }, 2000)
      return pubsub.asyncIterator('count')
    }
  }
}