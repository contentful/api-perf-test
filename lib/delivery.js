const request = require("request-promise-native")

module.exports = {
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

  return parsed.sys.revision === expectedVersion
}
