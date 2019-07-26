require('dotenv').config();

const {
  updateEntry,
  publishEntry,
  getLatestVersion
} = require('../lib/content');
const { waitUntilContentIsDelivered } = require('../lib/delivery');

const cmaToken = process.env.CMA_TOKEN;
const spaceId = process.env.SPACE_ID;
const cdaToken = process.env.CDA_TOKEN;
const existingEntryId = process.env.EXISTING_ENTRY_ID;

run();

async function run () {
  const publishStartedAt = process.hrtime();
  const version = await getLatestVersion({
    cmaToken,
    spaceId,
    entryId: existingEntryId
  });

  // Update existing entry, get updated version number
  // Publish it
  // Send requests to CDA until published version is delivered
  // Print out the time that took
  const updatedVersion = await updateEntry({
    cmaToken,
    spaceId,
    version,
    entryId: existingEntryId
  });

  await publishEntry({
    cmaToken,
    spaceId,
    entryId: existingEntryId,
    version: updatedVersion
  });

  await waitUntilContentIsDelivered({
    entryId: existingEntryId,
    expectedVersion: updatedVersion,
    spaceId,
    cdaToken
  });

  console.log(msSince(publishStartedAt));
}

function msSince (start) {
  const finish = process.hrtime(start);

  return finish[0] * 1000 + finish[1] / 1e6;
}
