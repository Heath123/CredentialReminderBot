require('dotenv').config()
const { Octokit } = require('@octokit/rest');

(async () => {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

  console.log(await octokit.search.commits({
    q: 'query'
  }))
})()

// Makes debugger work
setTimeout(() => {}, 1000000)
