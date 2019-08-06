const request = require('request-promise-native');

module.exports = {
  createEntry,
  deleteEntry,
  getLatestVersion,
  unpublishEntry,
  updateEntry,
  publishEntry,
  scheduleToPublishEntry
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

// Promise<>
async function deleteEntry ({ cmaToken, spaceId, entryId, version }) {
  await request({
    method: 'DELETE',
    url: `https://api.contentful.com/spaces/${spaceId}/environments/master/entries/${entryId}`,
    token: cmaToken,
    headers: {
      Authorization: `Bearer ${cmaToken}`,
      'Content-Type': 'application/json',
      'X-Contentful-Version': version
    }
  });
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

// Promise<>
async function unpublishEntry ({ cmaToken, spaceId, entryId, version }) {
  await request({
    method: 'DELETE',
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

async function scheduleToPublishEntry ({
  cmaToken,
  spaceId,
  entryId,
  userId,
  date,
  version
}) {
  await request({
    method: 'POST',
    url: `https://api.contentful.com/spaces/${spaceId}/environments/master/jobs`,
    headers: {
      accept: 'application/json, text/plain, */*',
      Authorization: `Bearer ${cmaToken}`,
      'content-type': 'application/vnd.contentful.management.v1+json',
      'x-contentful-enable-alpha-feature': 'scheduled-jobs'
    },
    body: JSON.stringify({
      sys: {
        space: { sys: { type: 'Link', id: spaceId } },
        environment: { sys: { type: 'Link', id: 'master' } },
        entity: {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: entryId
          }
        },
        scheduledBy: { sys: { type: 'Link', id: userId } }
      },
      action: 'publish',
      scheduledAt: date
    })
  });
}
