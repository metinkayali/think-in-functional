
// FP PEOPLE PREFERS **COMPOSITION** OVER **MODELING**
// FUNCTIONS ARE CONSTRUCTION BLOCKS WHICH ARE COMPOSED TO
// LARGER FUNCTIONS
// f:: A -> B
// g:: B -> C
// f.g = f >> g :: (A -> B >> B -> C), composed function
// FP PEOPLE CONSIDERS FUNCTIONS AS COMPOSABLE **THINGS** LIKE LEGO BRICKS

//f:: ClusterRows -> [ ClusterModels, LogDates ]
// ...  composed by [map, flatmap, clusterToModel] functions
function clusterRowsToModel(rows) {
  // bring FP to your language!
  let { map, flatMap } = require('lodash');
  let clusterModels = map(rows, clusterToModel); // <-- Expression oriented
  
  let allLogs = flatMap(clusterModels, 'techLogs'); // <-- Expression oriented
  let logDates = map(allLogs, 'logDate');     // <-- Expression oriented

  // COMPOSITION IS EVERYWHERE!!
  // FP PEOPLE COMPOSES LARGER DATA USING SMALLER DATA
  // A X B = Pair<A,B>    Cartesian product of A and B, Set Theory ;)

  // ClusterModels X LogDates
  return {
    clusterModels, 
    logDates
  }
}

// f:: Cluster -> ClusterModel
function clusterToModel(cluster) {
  // ... another 
}