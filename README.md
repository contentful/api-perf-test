# api-perf-test

This repository contains several performance measurement tools for Contentful APIs. The goal is to record how fast Contentful platform can perform a common userland action, such as following tests implemented;

* Publishing a new entry
* Publishing an updated entry

# Usage

Prepare following environment variables in your system;

```
CDA_TOKEN="" # required
CMA_TOKEN="" # required
SPACE_ID= # required
ENTRY_ID= # required only for update test
```

And now you can run the tests individually, calling their path;

```bash
$ node bin/test-entry-creation.js
```

Or you can run them all at once;

```bash
$ ./run.sh
```

# Cache Purging

Contentful currently allows one publish per every 10 seconds. If more than one request is sent within that timeframe, the requests will be debounced, and delayed for up to 2 minutes. This limitation applies to all publish requests for same space, therefore;

* Tests in same space should run serially
* Test runner (`./test.sh`) should have 10 seconds delay in between every sub execution.
