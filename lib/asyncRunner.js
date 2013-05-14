var procs;
try {
  procs = process;
} catch (e) {} // Process does not exist

module.exports = procs  && procs.nextTick ? procs.nextTick : setTimeout;
