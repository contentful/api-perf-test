const request = require("request-promise-native")

module.exports = {
  createNewEntry,
  publishEntry
}

// Promise<[createdEntryId: int, createdEntryVersion: int]>
async function createNewEntry({ cmaToken, spaceId }) {
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

  return [parsed.sys.id, parsed.sys.version]
}

// Promise<>
async function publishEntry({ cmaToken, spaceId, entryId }) {
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
