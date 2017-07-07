
// FP PEOPLE PREFERS DATA TRANSFORMATION OVER DATA MUTATION
// fn:: A -> B, means **map** values of A to B. SET THEORY ;)

ngOnChanges() {
  const clusterRows = this.clusterdata;

  this.logsTimeArr = [];
  this.data = [];

  // clusterRowsToModel :: ClusterRows -> Pair<ClusterModels, LogDates>
  let { clusterModels, logDates } = clusterRowsToModel(clusterRows);
  this.data = clusterModels;
  this.logsTimeArr = logDates;

  if (this.startDate || this.endDate) {
    this.logsTimeArr = [];                  
    this.logsTimeArr.push(this.endDate);    
    this.logsTimeArr.push(this.startDate); 
  }

  if (this.ele) {
    this.renderChart();
  }
}

// pure mathematical function which transforms A to B
// clusterRowsToModel :: ClusterRows -> Pair<ClusterModels, LogDates>
function clusterRowsToModel(clusterRows) {
  // ... since it is pure now, we can easily detach it from its global(class) context
  // ... welcome to clusterRowsToModel.js file !!
}
