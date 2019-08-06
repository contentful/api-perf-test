require('dotenv').config();

const startTimer = require('../lib/timer');
const { createEntry, scheduleToPublishEntry } = require('../lib/content');
const { waitUntilContentIsDelivered } = require('../lib/delivery');

const cmaToken = process.env.CMA_TOKEN;
const spaceId = process.env.SPACE_ID;
const cdaToken = process.env.CDA_TOKEN;
const userId = process.env.USER_ID;

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

  const date = new Date(Date.now() + 60000);

  await scheduleToPublishEntry({
    cmaToken,
    spaceId,
    entryId,
    userId,
    date,
    version: entryVersion
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
