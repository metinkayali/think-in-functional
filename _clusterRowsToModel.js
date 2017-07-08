function clusterRowsToModel(rows) {
  let { map, flatMap } = require('lodash');
  let clusterModels = map(rows, clusterToModel); // <-- Expression oriented
  
  let allLogs = flatMap(clusterModels, 'techLogs'); // <-- Expression oriented
  let logDates = map(allLogs, 'logDate');     // <-- Expression oriented

  return {
    clusterModels, 
    logDates
  }
}

function clusterToModel(cluster) {
}