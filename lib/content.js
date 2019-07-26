const request = require("request-promise-native")
const { simplePost, populateSimplePost } = require("./content-structure")

module.exports = {
  createNewEntry,
  updateEntry,
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
      "X-Contentful-Content-Type": simplePost.contentTypeId
    },
    body: JSON.stringify(populateSimplePost())
  }

  const raw = await request(options)
  const parsed = JSON.parse(raw)

  return [parsed.sys.id, parsed.sys.version]
}

// Promise<updatedEntryVersion: int>
async function updateEntry({ cmaToken, spaceId, entryId }) {
  const options = {
    method: "PUT",
    url: `https://api.contentful.com/spaces/${spaceId}/environments/master/entries/${entryId}`,
    token: cmaToken,
    headers: {
      Authorization: `Bearer ${cmaToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(populateSimplePost())
  }

  const raw = await request(options)
  const parsed = JSON.parse(raw)

  return parsed.sys.version
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
