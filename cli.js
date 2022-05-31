#!/usr/bin/env node
'use strict'
const toPDF = require('./App')
const opts = require('./opts')
const chalk = require('chalk')
const options = require('minimist')(process.argv.slice(2))
const { resolve } = require('path')

try {
  const { path, outpath } = opts(options) // checking for arguments
  toPDF(path, outpath)
  console.log(chalk.redBright.bold('PDF File saved at : ') + chalk.greenBright.bold(resolve(outpath)))
} catch (e) {
  console.log(chalk.redBright.bold('Oops : ' + e.message))
  process.exit(1) // no trq (sure)
}
