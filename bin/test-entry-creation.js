require("dotenv").config()

const { createNewEntry, publishEntry } = require("../lib/content")
const { waitUntilContentIsDelivered } = require("../lib/delivery")

const cmaToken = process.env.CMA_TOKEN
const spaceId = process.env.SPACE_ID
const cdaToken = process.env.CDA_TOKEN

run()

async function run() {
  const publishStartedAt = process.hrtime()

  // Create a new entry
  // Publish it
  // Send requests to CDA until published version is delivered
  // Print out the time that took
  const [entryId, entryVersion] = await createNewEntry({ cmaToken, spaceId })

  await publishEntry({ cmaToken, spaceId, entryId, version: entryVersion })
  await waitUntilContentIsDelivered({
    entryId,
    expectedVersion: entryVersion,
    spaceId,
    cdaToken
  })

  console.log(msSince(publishStartedAt))
}

function msSince(start) {
  const finish = process.hrtime(start)

  return finish[0] * 1000 + finish[1] / 1e6
}
