require('dotenv').config()
const request = require('request-promise-native')

const cmaToken = process.env.CMA_TOKEN
const cdaToken = process.env.CDA_TOKEN 
const entryEndpoint = 'https://api.contentful.com/spaces/cow0tjjvljcp/entries/7LtY7jEaKBTMer7s2Xm4a1'
const publishEndpoint = `${entryEndpoint}/published`
const cdaEndpoint = 'https://cdn.contentful.com/spaces/cow0tjjvljcp/entries/7LtY7jEaKBTMer7s2Xm4a1'

const msSince = (start) => {
  const finish = process.hrtime(start)

  return (finish[0] * 1000) + (finish[1] / 1e6);
}

async function sendRequest ({ method, url, token, version }) {
  const options = { 
    method,
    url,
    headers: 
    { 
      Authorization: `Bearer ${token}`,
      ...(version ? ({'X-Contentful-Version': version }): ({})),
      'Content-Type': 'application/json' 
    } 
  }

  return request(options)
}

async function run () {
  const r = await sendRequest({
    method: 'GET',
    url: entryEndpoint,
    token: cmaToken
  })
  const entry = JSON.parse(r)
  const version = entry.sys.version
  const publishedCounter = entry.sys.publishedCounter

  const startPublish = process.hrtime()
  await sendRequest({ 
    method: 'PUT',
    url: publishEndpoint,
    token: cmaToken,
    version
  })
  let endPublish

  while (true) {
    try {
      const r = await sendRequest({
        method: 'GET',
        url: cdaEndpoint,
        token: cdaToken
      })
      const entry = JSON.parse(r)

      if (entry.sys.revision > publishedCounter) {
        endPublish = msSince(startPublish)
        break
      }
    } catch (e) {
      if (e.statusCode !== 404) {
        break
      }
    }
  }

  await sendRequest({ method: 'DELETE', url: publishEndpoint, token: cmaToken, version: version+1 })
  console.log(endPublish)
}

run()
