const updateTest = require('./test-entry-update.js');
const creationTest = require('./test-entry-creation.js');

const cmaToken = process.env.CMA_TOKEN;
const spaceId = process.env.SPACE_ID;
const cdaToken = process.env.CDA_TOKEN;
const existingEntryId = process.env.EXISTING_ENTRY_ID;

require.main === module && run();

async function run () {
  await creationTest.run({ cmaToken, cdaToken, spaceId });
  await sleep(10);
  await updateTest.run({ cmaToken, cdaToken, spaceId });
}

function sleep () {
  return new Promise(resolve => {
    setTimeout(resolve, 10000);
  });
}
