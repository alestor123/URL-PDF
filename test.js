const tap = require('tap')
const toPDF = require('./App')
const { sync } = require('rimraf')
const { readdirSync, existsSync } = require('fs')
const { join, resolve } = require('path')
const tsdta = ['https://raw.githubusercontent.com/alestor123/MANGA-CLI/master/demo/shots/manga-cli.png', 'https://raw.githubusercontent.com/alestor123/MANGA-CLI/master/demo/shots/manga-cli1.png', 'https://raw.githubusercontent.com/alestor123/MANGA-CLI/master/demo/shots/manga-cli2.png'].concat(readdirSync(resolve(join(__dirname, 'test/input'))).map(path => resolve(join(__dirname, 'test/input', path))))
tap.test('Error test', async t => {
  await t.rejects(toPDF(), { message: 'Please enter a valid array' }) // test for checking error caused no argument
  await t.rejects(toPDF(2323), { message: 'Please enter a valid array' }) // test for checking error caused by wrong datatype
  await t.rejects(toPDF([]), { message: 'Please enter a valid array' })// test for checking error caused by empty rray
  await t.rejects(toPDF(tsdta), { message: 'Please enter a valid path' })
  await t.rejects(toPDF(tsdta, []), { message: 'Please enter a valid path' })
  await t.rejects(toPDF(tsdta, ''), { message: 'Please enter a valid path' })
})
tap.test('Output test', async t => {
  toPDF(tsdta, './test/output/output.pdf')
  t.equal(existsSync('./test/output/output.pdf'), true)
  sync('./test/output/output.pdf')
})
