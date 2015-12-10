#! /usr/bin/env node

let expandHomeDir = require('expand-home-dir')
let getChangelog = require('./changelog')
let Logger = require('./logger')
let argv = require('yargs')
  .usage('Usage: $0 [options] <baseTag>...<headTag>')
  .alias('r', 'repo')
  .describe('r', 'Repository e.g. atom/atom')
  .default('r', 'atom/atom')
  .alias('l', 'local-clone')
  .describe('l', 'Path to local clone of repository')
  .boolean('P')
  .alias('P', 'packages')
  .describe('P', 'Generate changelog for the changed packages. Uses `packageDependencies` package.json key')
  .boolean('v')
  .alias('v', 'verbose')
  .describe('v', 'Verbose')
  .help('h')
  .alias('h', 'help')
  .demand(1)
  .argv

Logger.setVerbose(argv.verbose)

let spanRegex = /(.+)(?:[\.]{3})(.+)/
let repoRegex = /([^\/]+)\/([^\/]+)/

let [__, fromTag, toTag] = spanRegex.exec(argv._[0])
let [___, owner, repo] = repoRegex.exec(argv.repo)
let localClone = expandHomeDir(argv.localClone)
let dependencyKey = argv.packages ? 'packageDependencies' : null

getChangelog({
  owner: owner,
  repo: repo,
  fromTag: fromTag,
  toTag: toTag,
  localClone: localClone,
  dependencyKey: dependencyKey
}).then(function(output) {
  console.log(output);
}).catch(function(err) {
  console.log('error', err.stack || err);
})
