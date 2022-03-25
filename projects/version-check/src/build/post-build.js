'use strict'

/**
 * Author: Henrik Peinar
 * https://blog.nodeswat.com/automagic-reload-for-clients-after-deploy-with-angular-4-8440c9fdd96c
 *
 * Modified and Adapted By: Eric Garrison
 * Updated for the Angular Version Check Library on 3/24/2022
 */
const path = require('path')
const fs = require('fs')
const util = require('util')

console.log('Starting post build [ngx-version-check]\n')

process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`)
})

let project = process.argv[2]

console.log(`\nProject: ${project}`)

if (!project) {
  console.log('Project name parameter is undefined. Using the /dist folder')
}

let outputDirectory = project ? `../../../dist/${project}/` : `../../../dist/`
let basePath = path.join(__dirname, outputDirectory)

console.log(`Base Path: ${basePath}`)

// Get application version from package.json
const versionFromFile = require(`${basePath}version.json`).version

// Promisify core API's
const readDir = util.promisify(fs.readdir)
const writeFile = util.promisify(fs.writeFile)
const readFile = util.promisify(fs.readFile)

console.log('\nRunning post-build tasks [ngx-version-check]')

// our version.json will be in the dist folder
const versionFilePath = `${basePath}version.json`

console.log(`Version File Path: ${basePath}`)

let mainHash = ''
let mainBundleFile = ''
let main2015BundleFile = ''

// RegExp to find main.bundle.js and main-es2015.bundle.js, even if it doesn't include a hash in it's name (dev build)
let mainBundleRegexp = /^main.?([a-z0-9]*)?.js$/
let main2015BundleRegexp = /^main-es2015.?([a-z0-9]*)?.js$/

// Update version number with the current date of the build
// Courtesy of AwesomeInPerson
// https://www.reddit.com/r/Angular2/comments/d2dim4/i_just_published_my_first_angular_8_library/ezuf9g5
let now = new Date()
let year = String(now.getFullYear())
let month = String(now.getMonth() + 1).padStart(2, '0')
let day = String(now.getDate()).padStart(2, '0')

// Check if this is a new version from the same day
let versionParts = versionFromFile.split('.')
let revision = ''

if (versionParts.length > 3) {
  revision = `.${parseInt(versionParts[3]) + 1}`
}

let appVersion = `${year}.${month}.${day}${revision}`

if (versionFromFile === appVersion) {
  appVersion = appVersion.concat('.1')
}

// read the dist folder files and find the one we're looking for
readDir(`${basePath}`)
  .then(files => {
    mainBundleFile = files.find(f => mainBundleRegexp.test(f))
    main2015BundleFile = files.find(f => main2015BundleRegexp.test(f))

    if (mainBundleFile) {
      console.log('Main Bundle: ', mainBundleFile)

      let matchHash = mainBundleFile.match(mainBundleRegexp)

      // if it has a hash in it's name, mark it down
      if (matchHash.length > 1 && !!matchHash[1]) {
        mainHash = matchHash[1]
      }
    }

    if (main2015BundleFile) {
      console.log('Main 2015 Bundle: ', main2015BundleFileBundleFile)

      let matchHash = main2015BundleFile.match(main2015BundleRegexp)

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
    if (!mainBundleFile && !main2015BundleFile) {
      console.log('Main bundle not found, exiting...')
      return
    }

    // Write the hash and version to the main.js file if it is present
    if (mainBundleFile) {
      console.log(`Replacing hash in the ${mainBundleFile}`)

      // Replace the hash and version placeholders in our main.js file so the code knows the current hash and version
      const mainFilepath = `${basePath}${mainBundleFile}`

      readFile(mainFilepath, 'utf8').then(mainFileData => {
        console.log(`Application Version: ${appVersion}`)
        console.log(`Application Hash: ${mainHash}`)

        const replacedFile = mainFileData
          .replace('{{POST_BUILD_ENTERS_HASH_HERE}}', mainHash)
          .replace('{{POST_BUILD_ENTERS_VERSION_HERE}}', appVersion)

        return writeFile(mainFilepath, replacedFile)
      })
    }

    // Write the hash and version to the main-es2015.js file if it is present
    if (main2015BundleFile) {
      console.log(`Replacing hash in the ${main2015BundleFile}`)

      // Replace the hash and version placeholders in our main.js file so the code knows the current hash and version
      const main2015Filepath = `${basePath}${main2015BundleFile}`

      readFile(main2015Filepath, 'utf8').then(mainFileData => {
        console.log(`Application Version: ${appVersion}`)
        console.log(`Application Hash: ${mainHash}`)

        const replacedFile = mainFileData
          .replace('{{POST_BUILD_ENTERS_HASH_HERE}}', mainHash)
          .replace('{{POST_BUILD_ENTERS_VERSION_HERE}}', appVersion)

        return writeFile(mainFilepath, replacedFile)
      })
    }

    console.log('End post build [ngx-version-check]\n')
    return
  })
  .catch(err => {
    console.log('Error with post build:', err)
  })
