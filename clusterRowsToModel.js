
// COMPOSITION EVERYWHERE!
// FUNCTIONS ARE LEGO BRICKS THAT ARE COLLECTED IN
// PACKAGES(MODULES)

// f X g X h
// ... functions are just values like any immutable data
//     have a lego box here :)
module.exports = {
  clusterRowsToModel,
  clusterToModel,
  techLogToModel
};

// clusterRowsToModel.js
function clusterRowsToModel(rows) {
  let { map, flatMap } = require('lodash');
  let clusterModels = map(rows, clusterToModel); 
  let allLogs = flatMap(clusterModels, 'techLogs'); 
  let logDates = map(allLogs, 'logDate');     

  return {
    clusterModels, 
    logDates
  }
}

// clusterToModel.js
function clusterToModel(cluster) {
  let { extend, map } = require('lodash');
  let model = extend({}, cluster, {
    techLogs = map(cluster.techLogs, techLogToModel(cluster))
  });
  return model;
}

// techLogToModel.js
function techLogToModel(cluster) {
  return techLog => {
    let { extend } = require('lodash');
    let model = extend({}, techLog, {
      priority: cluster.priority,
      logDate: new Date(techLog.logDate)
    });
    return model;
  }
}