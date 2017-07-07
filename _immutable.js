


ngOnChanges() {
  const clusterRows = this.clusterdata;  

  this.logsTimeArr = [];
  this.data = [];

  clusterRows.forEach(clusterRow => {      
    const priority = clusterRow.priority;
    const clusterData = {
      techLogs: [],
      priority: priority,
      id: clusterRow.id
    };
    clusterRow.techLogs.forEach(techLog => {
      const logDate = new Date(techLog.logDate);
      clusterData.techLogs.push({    
        logDate: logDate,
        ata: techLog.ata,
        preprocessedText: techLog.preprocessedText,
        text: techLog.rawText,
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
