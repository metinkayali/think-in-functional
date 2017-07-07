
// BRING FUNCTIONS FROM OTHER FILES

ngOnChanges() {
  const clusterRows = this.clusterdata;

  this.logsTimeArr = [];
  this.data = [];

  let clusterRowsToModel = require('./clusterRowsToModel');
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
