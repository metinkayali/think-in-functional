
// FP PEOPLE PREFERS DATA **TRANSFORMATION** OVER DATA **MUTATION**

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
      clusterData.techLogs.push({    // <-- mutating
        logDate: logDate,
        ata: techLog.ata,
        preprocessedText: techLog.preprocessedText,
        text: techLog.rawText,
        priority: priority
      });

      this.logsTimeArr.push(logDate); // <-- mutating
    });
    this.data.push(clusterData); // <-- mutating
  });

  if (this.startDate || this.endDate) {
    this.logsTimeArr = [];                  // <-- mutating
    this.logsTimeArr.push(this.endDate);    // <-- mutating
    this.logsTimeArr.push(this.startDate);  // <-- mutating
  }

  if (this.ele) {
    this.renderChart();
  }
}
