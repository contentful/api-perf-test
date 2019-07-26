require('dotenv').config();

const startTimer = require('../lib/timer');
const { createEntry, publishEntry } = require('../lib/content');
const { waitUntilContentIsDelivered } = require('../lib/delivery');

const cmaToken = process.env.CMA_TOKEN;
const spaceId = process.env.SPACE_ID;
const cdaToken = process.env.CDA_TOKEN;

run();

async function run () {
  const endTimer = startTimer();

  // Create a new entry
  // Publish it
  // Send requests to CDA until published version is delivered
  // Print out the time that took
  const [entryId, entryVersion] = await createEntry({ cmaToken, spaceId });

  await publishEntry({ cmaToken, spaceId, entryId, version: entryVersion });
  await waitUntilContentIsDelivered({
    entryId,
    expectedRevision: 1,
    spaceId,
    cdaToken
  });

  console.log(endTimer());
}
