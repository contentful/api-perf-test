const request = require("request-promise-native")

module.exports = {
  getPublishedRevision,
  isContentDeliveredYet,
  waitUntilContentIsDelivered
}

async function waitUntilContentIsDelivered(options) {
  while (true) {
    if (await isContentDeliveredYet(options)) {
      break
    }
  }
}

// Promise<boolean>
async function isContentDeliveredYet({
  cdaToken,
  spaceId,
  entryId,
  expectedVersion
}) {
  const options = {
    method: "GET",
    url: `https://cdn.contentful.com/spaces/${spaceId}/entries/${entryId}`,
    headers: {
      Authorization: `Bearer ${cdaToken}`,
      "Content-Type": "application/json"
    }
  }

  let publishedRevision
  try {
    publishedRevision = await getPublishedRevision({
      cdaToken,
      spaceId,
      entryId
    })
  } catch (err) {
    if (err.statusCode === 404) {
      return false
    }

    throw err
  }

  return publishedRevision === expectedVersion
}

// Promise<version: int>
async function getPublishedRevision({ cdaToken, spaceId, entryId }) {
  const options = {
    method: "GET",
    url: `https://cdn.contentful.com/spaces/${spaceId}/entries/${entryId}`,
    headers: {
      Authorization: `Bearer ${cdaToken}`,
      "Content-Type": "application/json"
    }
  }

  const raw = await request(options)
  const parsed = JSON.parse(raw)

  return parsed.sys.revision
}
