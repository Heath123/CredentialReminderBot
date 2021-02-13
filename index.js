require('dotenv').config()
const { Octokit } = require('@octokit/rest')
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
const fs = require('fs')

// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// TODO: Reduce memory usage if needed?
if (!fs.existsSync('./alreadyCommented.json')) {
  fs.writeFileSync('./alreadyCommented.json', '[]')
}

function saveJSON () {
  fs.writeFileSync('./alreadyCommented.json', JSON.stringify(alreadyCommented))
}

const alreadyCommented = JSON.parse(fs.readFileSync('./alreadyCommented.json'))

const message = fs.readFileSync('message.txt', { encoding: 'utf8' })

async function commentFromItem (item) {
  await commentOnIfNotDone(item.repository.owner.login, item.repository.name, item.sha, item.commit.author.name)
}

async function commentOnIfNotDone (repoOwner, repo, commitId, commitAuthor) {
  if (alreadyCommented.includes(commitId)) return

  await octokit.repos.createCommitComment({
    owner: repoOwner,
    repo: repo,
    commit_sha: commitId,
    body: message.replace('${username}', commitAuthor)
  })

  // Don't trigger rate limits
  // TODO: Do this properly
  await sleep(2000)

  alreadyCommented.push(commitId)
  saveJSON()
  console.log('Commented on', commitId)
}

async function searchAndComment () {
  console.log('Searching...')
  const commits = await octokit.search.commits({
    q: '"remove password" OR "remove token"',
    sort: 'committer-date'
  })

  for (const commit of commits.data.items) {
    try {
      await commentFromItem(commit)
    } catch (error) {
      console.error(error, commit)
    }
  }
}

setInterval(searchAndComment, 60 * 1000)
searchAndComment()
