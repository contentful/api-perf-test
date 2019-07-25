require("dotenv").config()
const request = require("request-promise-native")

const cmaToken = process.env.CMA_TOKEN
const cdaToken = process.env.CDA_TOKEN
const spaceId = process.env.SPACE_ID

run()

async function run() {
  const publishStartedAt = process.hrtime()
  const entryId = await createNewEntry()
  await publishEntry(entryId)
  await waitUntilContentIsDelivered(entryId)
  console.log(msSince(publishStartedAt))
}

// Promise<createdEntryId: int>
async function createNewEntry() {
  const options = {
    method: "POST",
    url: `https://api.contentful.com/spaces/${spaceId}/environments/master/entries`,
    token: cmaToken,
    headers: {
      Authorization: `Bearer ${cmaToken}`,
      "Content-Type": "application/json",
      "X-Contentful-Content-Type": "testing"
    },
    body: JSON.stringify({
      fields: {
        title: {
          "en-US": "Yolo"
        },
        content: {
          "en-US": "Foobar"
        }
      }
    })
  }

  const raw = await request(options)
  const parsed = JSON.parse(raw)

  return parsed.sys.id
}

// Promise<>
async function publishEntry(entryId) {
  await request({
    method: "PUT",
    url: `https://api.contentful.com/spaces/${spaceId}/environments/master/entries/${entryId}/published`,
    token: cmaToken,
    headers: {
      Authorization: `Bearer ${cmaToken}`,
      "Content-Type": "application/json",
      "X-Contentful-Version": "1"
    }
  })
}

// Promise<boolean>
async function isContentDeliveredYet(entryId) {
  const options = {
    method: "GET",
    url: `https://cdn.contentful.com/spaces/${spaceId}/entries/${entryId}`,
    headers: {
      Authorization: `Bearer ${cdaToken}`,
      "Content-Type": "application/json"
    }
  }

  let raw
  try {
    raw = await request(options)
  } catch (err) {
    if (err.statusCode === 404) {
      return false
    }

    throw err
  }

  const parsed = JSON.parse(raw)
  return parsed.sys.id === entryId
}

async function waitUntilContentIsDelivered(entryId) {
  while (true) {
    if (await isContentDeliveredYet(entryId)) {
      break
    }
  }
}

function msSince(start) {
  const finish = process.hrtime(start)

  return finish[0] * 1000 + finish[1] / 1e6
}
