





ngOnChanges() {
  const rowData = this.clusterdata;

  this.logsTimeArr = [];
  this.data = [];

  rowData.forEach(cluster => {      
    const priority = cluster.priority;
    const clusterData = {
      techLogs: [],
      priority: priority,
      id: cluster.id
    };
    cluster.techLogs.forEach(log => {  
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

  if (this.ele) {
    this.renderChart();
  }
}
