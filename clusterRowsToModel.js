
// FP PEOPLE LOVES **COMPOSITION** OVER **MODELING**
// FUNCTIONS ARE THE COMPOSABLE BLOCKS WHICH ARE COMPOSED TO
// LARGER FUNCTIONS
// fn1:: A -> B
// fn2:: B -> C
// fn3 = fn1 >> fn2 :: (A -> B >> B -> C), composed function
// FP PEOPLE CONSIDERS FUNCTIONS AS COMPOSABLE **THINGS** LIKE LEGOS!

// it composed by [map, flatmap, clusterToModel] functions
function clusterRowsToModel(rows) {
  // bring FP to your language!
  let { map, flatMap } = require('lodash');
  let clusterModels = map(rows, clusterToModel);
  
  let allLogs = flatMap(clusterModels, 'techLogs');
  let logDates = map(allLogs, 'logDate');

  // COMPOSITION IS EVERYWHERE!!
  // FP PEOPLE COMPOSES LARGER DATA USING FROM SMALLER DATA
  // A X B = Pair<A,B>    Cartesian product of sets A and B ;)

  // ClusterModels X LogDates
  return {
    clusterModels, 
    logDates
  }
}

// Cluster -> ClusterModel
function clusterToModel(cluster) {
  // ... another 
}