const request = require('request-promise-native');

module.exports = {
  createEntry,
  getLatestVersion,
  updateEntry,
  publishEntry
};

// Promise<[createdEntryId: int, createdEntryVersion: int]>
async function createEntry ({
  cmaToken,
  spaceId,
  contentTypeId,
  populateContent
}) {
  const options = {
    method: 'POST',
    url: `https://api.contentful.com/spaces/${spaceId}/environments/master/entries`,
    token: cmaToken,
    headers: {
      Authorization: `Bearer ${cmaToken}`,
      'Content-Type': 'application/json',
      'X-Contentful-Content-Type': contentTypeId
    },
    body: JSON.stringify(populateContent())
  };

  const raw = await request(options);
  const parsed = JSON.parse(raw);

  return [parsed.sys.id, parsed.sys.version];
}

// Promise<updatedEntryVersion: int>
async function updateEntry ({
  cmaToken,
  spaceId,
  entryId,
  version,
  populateContent
}) {
  const options = {
    method: 'PUT',
    url: `https://api.contentful.com/spaces/${spaceId}/environments/master/entries/${entryId}`,
    token: cmaToken,
    headers: {
      Authorization: `Bearer ${cmaToken}`,
      'Content-Type': 'application/json',
      'X-Contentful-Version': version
    },
    body: JSON.stringify(populateContent())
  };

  const raw = await request(options);
  const parsed = JSON.parse(raw);

  return parsed.sys.version;
}

// Promise<>
async function publishEntry ({ cmaToken, spaceId, entryId, version }) {
  await request({
    method: 'PUT',
    url: `https://api.contentful.com/spaces/${spaceId}/environments/master/entries/${entryId}/published`,
    token: cmaToken,
    headers: {
      Authorization: `Bearer ${cmaToken}`,
      'Content-Type': 'application/json',
      'X-Contentful-Version': version
    }
  });
}

// Promise<version: int>
async function getLatestVersion ({ cmaToken, spaceId, entryId }) {
  const options = {
    method: 'GET',
    url: `https://api.contentful.com/spaces/${spaceId}/entries/${entryId}`,
    headers: {
      Authorization: `Bearer ${cmaToken}`,
      'Content-Type': 'application/json'
    }
  };

  const raw = await request(options);
  const parsed = JSON.parse(raw);

  return parsed.sys.version;
}
