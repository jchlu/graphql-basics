const userId1 = '95d73d60-1cc4-4fc4-a07e-135307461f0b'
const userId2 = '74968f3e-6873-45c8-8187-fac2477e33db'
const userId3 = 'c4ae54e6-76a7-476a-8c33-51ca30368c85'
const postId1 = 'e94895ce-810e-424e-8a07-49d1a5740098'
const postId2 = '6e9cf1c9-55cf-48c1-b3d9-39c90a2ec6b1'
const postId3 = 'af502c0f-8d2e-4c30-9e29-3b00fae5d1a7'
const commentId1 = '8f61400d-0d57-43ea-9acb-c5fc811ab0d0'
const commentId2 = '17387775-b944-45c1-a5b2-60ea2f3a26fc'
const commentId3 = '1bc860ba-c9d6-4f27-9470-ea5de3d35fe6'
const commentId4 = '7352ddf5-d944-4a4a-b933-9c12b8bb2acc'

export const users = [{
  id: userId1,
  name: 'Gene Hunt',
  email: 'gene@example.com',
  age: 49
}, {
  id: userId2,
  name: 'Annie',
  email: 'annie@example.com',
  age: 28
}, {
  id: userId3,
  name: 'Sam',
  email: 'sam@example.com',
  age: 32
}]

export const posts = [{
  id: postId1,
  title: 'Blog Post One',
  body: 'This is an awesome post',
  published: true,
  author: userId1
}, {
  id: postId2,
  title: 'Another Awesome Post',
  body: 'This post is great',
  published: false,
  author: userId2
}, {
  id: postId3,
  title: 'Yet another great post',
  body: 'What a cracking article this is!',
  published: true,
  author: userId2
}]

export const comments = [{
  id: commentId1,
  text: 'That sausage was cold',
  author: userId1,
  post: postId1
}, {
  id: commentId2,
  text: 'That sausage was hot!',
  author: userId2,
  post: postId2
}, {
  id: commentId3,
  text: 'That pudding was cake',
  author: userId3,
  post: postId3
}, {
  id: commentId4,
  text: 'That pudding was chocolate brownie!',
  author: userId1,
  post: postId3
}]
