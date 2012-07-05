require({
  baseUrl: 'js/',
  packages: [
    { name: 'dojo' },
    { name: 'mwe', location: './mwe' },
    { name: 'box2d', location: './mwe/box2d' },
    { name: 'game', location: './game'}
  ]
  // This is a hack. In order to allow app/main and app/run to be built together into a single file, a cache key needs
  // to exist here in order to force the loader to actually process the other modules in the file. Without this hack,
  // the loader will think that code for app/main has not been loaded yet and will try to fetch it again, resulting in
  // a needless extra HTTP request.
  // cache: {}
}, ['game']);