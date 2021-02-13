require('dotenv').config()
const GitHub = require('github-api')

const gh = new GitHub({
  username: process.env.GITHUB_USERNAME,
  password: process.env.GITHUB_PASSWORD
})

// The github-api doesn't seem to support this in cleaner way than this?
// TODO: auth seems to be broken, causing a strict rate limit
function searchCommits (gh, options) {
  return new Promise((resolve, reject) => {
    const search = gh.search({})
    search.__AcceptHeader = 'cloak-preview'
    search._search('commits', options, (err, result) => {
      if (err) {
        console.error(result)
        reject(err)
      }
      if (result) resolve(result)
    })
  })
}

(async () => {
  const user = gh.getUser()
  console.log(user)
  console.log(await searchCommits(gh, { q: '"remove password" OR "remove token"' }))
})()
