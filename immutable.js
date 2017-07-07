
// FP PEOPLE VERY DISLIKE UNNECESSARY CODE AND PARENTHESIS
// "THE BEST CODE IS NO CODE" PRINCIPLE

ngOnChanges() {
  const rowData = this.clusterdata;  // <-- Redundant code

  this.logsTimeArr = [];
  this.data = [];

  rowData.forEach(cluster => {      // <-- Excess parans
    const priority = cluster.priority;
    const clusterData = {
      techLogs: [],
      priority: priority,
      id: cluster.id
    };
    cluster.techLogs.forEach(log => {  // <-- Excess parans
      const logDate = new Date(log.logDate);
      clusterData.techLogs.push({    
        logDate: logDate,
        ata: log.ata,
        preprocessedText: log.preprocessedText,
        text: log.rawText,
        priority: priority
      });

      this.logsTimeArr.push(logDate);
    });
    this.data.push(clusterData);
  });

  if (this.startDate || this.endDate) {
    this.logsTimeArr = [];                 
    this.logsTimeArr.push(this.endDate);   
    this.logsTimeArr.push(this.startDate); 
  }

  // <-- Redundant code 

  if (this.ele) {
    this.renderChart();
  }
}
