
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

function clusterToModel(cluster) {
  let { extend, map } = require('lodash');
  let model = extend({}, cluster, {
    techLogs = map(cluster.techLogs, techLogToModel(cluster))
  });
  return model;
}

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