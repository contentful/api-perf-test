module.exports = timer;

function timer () {
  const startedAt = process.hrtime();

  return () => {
    const endedAt = process.hrtime(startedAt);
    return endedAt[0] * 1000 + endedAt[1] / 1e6;
  };
}
