
// REMEMBER THAT FUNCTIONS ARE **THINGS**
// HIGHER-ORDER FUNCTIONS ARE FUNCTIONS THAT TAKE
// FUNCTIONS AS PARAMETER OR RETURN FUNCTIONS AS VALUE
// map:: [ A[], (A -> B) ] -> B[]
// flatMap:: [ A[], (A -> B[]) ] -> B[]
// [ map, flatMap ] are higher-order functions take function as parameter 
function clusterRowsToModel(rows) {
  let { map, flatMap } = require('lodash');
  let clusterModels = map(rows, clusterToModel); 
  
  // ... notice that FP people are very concise
  //     if there is a short way expressing intent, they prefer it
  let allLogs = flatMap(clusterModels, 'techLogs'); 
  let logDates = map(allLogs, 'logDate');     

  return {
    clusterModels, 
    logDates
  }
}

// f:: Cluster -> ClusterModel
function clusterToModel(cluster) {
  let { extend, map } = require('lodash');
  // ... FP people does not mutate data.
  //     Notice that if we'd have mutated 'cluster' here,
  //     like cluster.techLogs = ...
  //     it wouldn't be functional programming.
  let model = extend({}, cluster, {
    techLogs = map(cluster.techLogs, techLogToModel(cluster))
  });
  return model;
}

// f:: Cluster -> (TechLog -> TechLogModel)
// ... is a higher order function which takes a cluster and returns
//     a function 
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