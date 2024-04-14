import { readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'

const targetVersion = process.env.npm_package_version
const targetName = process.env.npm_package_name
const targetDescription = process.env.npm_package_description
const targetAuthor = process.env.npm_package_author
const targetFunding = process.env.npm_package_funding ?? 'waiting to be created...'

// read minAppVersion from manifest.json and bump version to target version
const manifest = JSON.parse(readFileSync('manifest.json', 'utf8'))
const { minAppVersion } = manifest
manifest.version = targetVersion
manifest.id = targetName
manifest.name = targetName
manifest.description = targetDescription
manifest.author = targetAuthor
manifest.fundingUrl = targetFunding
writeFileSync('manifest.json', JSON.stringify(manifest, null, '\t'))

// update versions.json with target version and minAppVersion from manifest.json
const versions = JSON.parse(readFileSync('versions.json', 'utf8'))
versions[targetVersion] = minAppVersion
writeFileSync('versions.json', JSON.stringify(versions, null, '\t'))
