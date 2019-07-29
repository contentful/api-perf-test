require('dotenv').config();

const startTimer = require('../lib/timer');
const { createEntry, publishEntry } = require('../lib/content');
const { waitUntilContentIsDelivered } = require('../lib/delivery');

const cmaToken = process.env.CMA_TOKEN;
const spaceId = process.env.SPACE_ID;
const cdaToken = process.env.CDA_TOKEN;

require.main === module && run({ cmaToken, cdaToken, spaceId });

module.exports = {
  run
};

async function run ({ cmaToken, cdaToken, spaceId }) {
  const endTimer = startTimer();

  // Create a new entry
  // Publish it
  // Send requests to CDA until published version is delivered
  // Print out the time that took
  const [entryId, entryVersion] = await createEntry({
    cmaToken,
    spaceId,
    contentTypeId: 'simpleContentType',
    populateContent: populateSimpleEntry
  });

  await publishEntry({ cmaToken, spaceId, entryId, version: entryVersion });
  await waitUntilContentIsDelivered({
    entryId,
    expectedRevision: 1,
    spaceId,
    cdaToken
  });

  console.log(endTimer());
}

function populateSimpleEntry () {
  return {
    fields: {
      title: {
        'en-US': Date.now().toString(36)
      }
    }
  };
}
