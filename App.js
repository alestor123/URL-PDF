'use strict'

const { createWriteStream, statSync, writeFileSync, readdirSync } = require('fs')
const size = require('image-size')
const PDFKit = require('pdfkit')
const { sync } = require('rimraf')
const { existsSync } = require('fs')
const { dirSync } = require('tmp')
const axios = require('axios')
const { resolve, join, basename } = require('path')
let doc = new PDFKit()

module.exports = async (arr, outpath) => {
  if (!(arr && typeof arr === 'object' && arr.length > 0)) throw new Error('Please enter a valid array')
  else if (!(outpath && typeof outpath === 'string' && outpath.length > 0)) throw new Error('Please enter a valid path')
  const tmpdir = dirSync().name
  const validarr = [...new Set(arr.filter(element => element !== ''))]
  let c = 0
  for (const pth of validarr) {
    if (isURL(pth)) {
      writeFileSync(resolve(join(tmpdir, basename(new URL(pth).pathname))), (await axios.get(pth, { responseType: 'arraybuffer' })).data, err => {
        if (err) throw err
      })
      genPDF(resolve(join(tmpdir, basename(new URL(pth).pathname))), c)
    } else if (existsSync(resolve(pth)) && statSync(resolve(pth)).isFile()) genPDF(resolve(pth), c)
    else if (existsSync(resolve(pth)) && statSync(resolve(pth)).isDirectory()) for (const dirpths of readdirSync(resolve(pth)).map(file => resolve(join(resolve(pth), file)))) genPDF(resolve(dirpths), c)
    else throw new Error('Invalid element type')
    c++
  }
  doc.pipe(createWriteStream(resolve(outpath))) // writing tp output path
  doc.end()
  sync(tmpdir) // removing tmp dir 
}

function isURL (string) {
  let url
  try {
    url = new URL(string)
  } catch (_) {
    return false
  }
  return url.protocol === 'http:' || url.protocol === 'https:'
}

function genPDF (pth, count) {
  const { width, height } = size(pth)
  if (count === 0) doc = new PDFKit({ size: [width, height] })
  else doc.addPage({ size: [width, height] })
  doc.image(pth, 0, 0, { width, height })
}
