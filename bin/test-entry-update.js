require("dotenv").config()

const startTimer = require("../lib/timer")
const { populateSimplePost } = require("../lib/content-structure")

const {
  updateEntry,
  publishEntry,
  getLatestVersion
} = require("../lib/content")

const {
  waitUntilContentIsDelivered,
  getPublishedRevision
} = require("../lib/delivery")

const cmaToken = process.env.CMA_TOKEN
const spaceId = process.env.SPACE_ID
const cdaToken = process.env.CDA_TOKEN
const existingEntryId = process.env.EXISTING_ENTRY_ID

require.main === module && run({ cmaToken, cdaToken, spaceId })

module.exports = {
  run
}

async function run({ cmaToken, cdaToken, spaceId }) {
  const latestPublishedRevision = await getPublishedRevision({
    cdaToken,
    spaceId,
    entryId: existingEntryId
  })

  const latestVersion = await getLatestVersion({
    cmaToken,
    spaceId,
    entryId: existingEntryId
  })

  const endTimer = startTimer()

  // Update existing entry, get updated version number
  // Publish it
  // Send requests to CDA until published version is delivered
  // Print out the time that took
  const updatedVersion = await updateEntry({
    cmaToken,
    spaceId,
    version: latestVersion,
    entryId: existingEntryId,
    populateContent: populateSimplePost
  })

  await publishEntry({
    cmaToken,
    spaceId,
    entryId: existingEntryId,
    version: updatedVersion
  })

  await waitUntilContentIsDelivered({
    entryId: existingEntryId,
    expectedRevision: latestPublishedRevision + 1,
    spaceId,
    cdaToken
  })

  console.log(endTimer())
}
