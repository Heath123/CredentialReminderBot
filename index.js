require('dotenv').config()
const GitHub = require('github-api')

const gh = new GitHub({
  username: process.env.GITHUB_USERNAME,
  password: process.env.GITHUB_PASSWORD
})

const user = gh.getUser()
console.log(user)
