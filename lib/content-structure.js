// Define a content type that matches the records we got in the tested space.
const simplePost = {
  contentTypeId: 'testing',
  contentTypeFields: {
    title: () => ({ 'en-US': randomString() }),
    content: () => ({ 'en-US': randomString() })
  }
};

module.exports = {
  simplePost,
  populateSimplePost: () => ({
    fields: populateContent(simplePost.contentTypeFields)
  })
};

// Take a list of fields pointing to a function that
// returns random valid value of corresponding field.
//
// Put them together in an object and return as a result.
function populateContent (fields) {
  const result = {};

  for (const fieldName in fields) {
    result[fieldName] = fields[fieldName]();
  }

  return result;
}

// Generate and return a random string
function randomString () {
  return Date.now().toString(36);
}
