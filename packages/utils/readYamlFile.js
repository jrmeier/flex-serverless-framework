const fs = require('fs')
const yaml = require('js-yaml')

const readYamlFile = (file) => {
  const fileContents = fs.readFileSync(file, 'utf8')
  return yaml.load(fileContents)
}

module.exports = readYamlFile
