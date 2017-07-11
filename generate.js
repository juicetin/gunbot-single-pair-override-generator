const fs = require('fs-extra');
const Promise = require('bluebird');
const glob = require('glob-promise');
const globFiles = glob.glob;
const CONFIG = require('./config.js');

const individualPrecedenceDir = CONFIG.INDIVIDUAL_PRECEDENCE_DIR;
const allPairPrecedenceDir = CONFIG.ALL_PAIR_PRECEDENCE_DIR;
const exchange = CONFIG.EXCHANGE;

function createDirectoryIfNotExists(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`${dir} folder did not previously exist, creating now...`);
    fs.mkdirSync(dir);
  }
}

function getAllIndividualPrecedenceConfigs() {
  return Promise.coroutine(function* () {
    const files = yield glob(`${individualPrecedenceDir}/${exchange}*config.js`);
    return files;
  })();
}

function getConfigFromPath(path) {
  return (require(path));
}

function fillInMissingPAIRPropsWithALLPAIRSProps(individualConfig, ALLPAIRSConfig) {
  // console.log(ALLPAIRSConfig);
  Object.keys(ALLPAIRSConfig).forEach(prop => {
    if(!individualConfig[prop]) {
      individualConfig[prop] = ALLPAIRSConfig[prop];
    }
  });

  return individualConfig;
}

function fillInMissingAllIndividualConfigPropsWithALLPAIRSProps(individualConfigsList, ALLPAIRSConfig) {
  return individualConfigsList.map(individualConfig => {
    return fillInMissingPAIRPropsWithALLPAIRSProps(individualConfig, ALLPAIRSConfig);
  });
}

function writeConfigsToDir(configs, dir) {
  return Promise.map(configs, config => {
    const exchange = config.DEFAULT_MARKET_NAME;
    const pair = config.DEFAULT_CURRENCY_PAIR;
    const curConfigRelWritePath = `${dir}/${exchange}-${pair}-config.js`;
    const JSONstr = JSON.stringify(config,null,'\t');
    const jsFiedJSON = `var config = ${JSONstr};\n\nmodule.exports = config;`;
    console.log(`Writing config file for ${pair} on ${exchange}...`);
    return fs.writeFile(curConfigRelWritePath, jsFiedJSON);
  });
}

function main() {
  return Promise.coroutine(function* () {
    createDirectoryIfNotExists(individualPrecedenceDir);
    createDirectoryIfNotExists(allPairPrecedenceDir);
    const allPairFilePath = `${individualPrecedenceDir}/ALLPAIRS-params.js`;
    if (!fs.existsSync(allPairFilePath)) {
      return Promise.reject('the ALLPAIRS-params.js file needs to exist and be populated correctly in your individual-precedence directory!');
    }
    const individualStyleALLPAIRSConfig = require(allPairFilePath);
    const individualStylePairConfigFileList = yield getAllIndividualPrecedenceConfigs();
    const individualStylePairConfigList = individualStylePairConfigFileList.map(getConfigFromPath);
    const individualALLPAIRSMergedConfigs =  fillInMissingAllIndividualConfigPropsWithALLPAIRSProps(individualStylePairConfigList, individualStyleALLPAIRSConfig);
    yield writeConfigsToDir(individualALLPAIRSMergedConfigs, allPairPrecedenceDir);
  })().catch(err => {
    return Promise.reject(err);
  });
}

main();
