/**
 * Author: Henrik Peinar
 * https://blog.nodeswat.com/automagic-reload-for-clients-after-deploy-with-angular-4-8440c9fdd96c
 *
 * Modified and Adapted By: Eric Garrison
 * Updated for the Angular Version Check Library on 9/9/2019
 */
const path = require('path')
const fs = require('fs')
const util = require('util')
const moment = require('moment')

process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`)
})

let project = process.argv[2]
let basePath = path.join(__dirname, `../../../dist/${project}/`)

console.log(`\nProject: ${project}`)
console.log(`Base Path: ${basePath}`)

// Get application version from package.json
const versionFromFile = require(`${basePath}version.json`).version

// Promisify core API's
const readDir = util.promisify(fs.readdir)
const writeFile = util.promisify(fs.writeFile)
const readFile = util.promisify(fs.readFile)

console.log('\nRunning post-build tasks')

// our version.json will be in the dist folder
const versionFilePath = `${basePath}version.json`

console.log(`Version File Path: ${basePath}`)

let mainHash = ''
let mainBundleFile = ''

// RegExp to find main-es2015.bundle.js, even if it doesn't include a hash in it's name (dev build)
let mainBundleRegexp = /^main-es2015.?([a-z0-9]*)?.js$/

// Update version number with the current date of the build
let year = moment().year()
let month = `${moment().month() + 1 < 10 ? '0' : ''}${moment().month() + 1}`
let day = `${moment().date() < 10 ? '0' : ''}${moment().date()}`

// Check if this is a new version from the same day
let versionParts = versionFromFile.split('.')
let revision = ''

if (versionParts.length > 3) {
  revision = `.${parseInt(versionParts[3]) + 1}`
}

let appVersion = `${year}.${month}.${day}${revision}`

console.log(`Current Version From File: ${versionFromFile}`)

if (versionFromFile === appVersion) {
  appVersion = appVersion.concat('.1')
}

console.log(`Changed Version To: ${appVersion}`)

// read the dist folder files and find the one we're looking for
readDir(`${basePath}`)
  .then(files => {
    mainBundleFile = files.find(f => mainBundleRegexp.test(f))

    if (mainBundleFile) {
      let matchHash = mainBundleFile.match(mainBundleRegexp)

      // if it has a hash in it's name, mark it down
      if (matchHash.length > 1 && !!matchHash[1]) {
        mainHash = matchHash[1]
      }
    }

    console.log(`Writing version and hash to ${versionFilePath}`)

    // Write current version and hash into the version.json file
    const src = `{"version": "${appVersion}", "hash": "${mainHash}"}`

    return writeFile(versionFilePath, src)
  })
  .then(() => {
    // main bundle file not found, dev build?
    if (!mainBundleFile) {
      return
    }

    console.log(`Replacing hash in the ${mainBundleFile}`)

    // Replace the hash and version placeholders in our main.js file so the code knows the current hash and version
    const mainFilepath = `${basePath}${mainBundleFile}`

    return readFile(mainFilepath, 'utf8').then(mainFileData => {
      console.log(`Application Version: ${appVersion}`)
      console.log(`Application Hash: ${mainHash}`)

      const replacedFile = mainFileData
        .replace('{{POST_BUILD_ENTERS_HASH_HERE}}', mainHash)
        .replace('{{POST_BUILD_ENTERS_VERSION_HERE}}', appVersion)

      return writeFile(mainFilepath, replacedFile)
    })
  })
  .catch(err => {
    console.log('Error with post build:', err)
  })
