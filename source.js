import { Component, OnInit, OnChanges, ElementRef, Input, Output, ViewEncapsulation, ViewChild, HostListener, HostBinding, EventEmitter } from '@angular/core';
import * as d3 from 'd3';
import * as $ from 'jquery';
import virtualScroller from './virtualScroll';
import { Logger } from 'angular2-logger/core';

class ChartOptions {
  singleRowheight: 36;
  dotsDensity: 200;
};


class ClusterData {
  priority: string;
  logs: Array<any>;
};

@Component({
  selector: 'cluster-chart',
  template: '<div class="clusterChart" #clusterChart></div>',
  styleUrls: ['./cluster-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '(show)': 'resizeWorks()'
  }

})
export class ClusterChartComponent implements OnInit, OnChanges {

  @ViewChild('clusterChart') private $element: ElementRef;
  @Input() clusterdata: Array<ClusterData>;
  @Input() options: ChartOptions;
  @Input() snapTable: any;
  @Input() startDate: Date;
  @Input() endDate: Date;

  @Output()
  updateList = new EventEmitter;
  @Output()
  timeAxis = new EventEmitter();


  @HostListener('window:resize', ['$event.target'])
  onResize() {
    this.resizing();
  }

  constructor(private _logger: Logger) { }

  private chart: any;
  private resizeId: any;
  private data: any;
  private ele: any;
  private logsTimeArr: Array<any>;
  private chartWrapper: any;
  private timeLineWrapper: any;
  private logDots: any;

  private chartRendered: boolean = false;

  private debug: boolean = false;

  private log(m: any, time?: any) {
    if (this.debug) {
      this._logger.log(m, time);
    }
  };

  private priorityColors = {
    high: '#D71920',
    '1': '#D71920',
    low: '#F5A623',
    '2': '#F5A623',
    medium: '#0F94F6',
    '3': '#0F94F6',
    none: '#9b9b9b'
  };

  private priorityClass = {
    '1': 'high',
    '2': 'low',
    '3': 'medium',
    none: 'none'
  };

  ngOnInit() {
    this.chart = {};
  }

  ngOnChanges() {


    const rowData = JSON.parse(JSON.stringify(this.clusterdata));

    this.logsTimeArr = [];
    this.data = [];

    rowData.forEach((cluster) => {
      const priority = cluster.priority;
      const clusterData = {
        techLogs: [],
        priority: priority,
        id: cluster.id,
      };
      cluster.techLogs.forEach((log) => {
        const logDate = new Date(log.logDate);
        clusterData.techLogs.push({
          logDate: logDate,
          ata: log.ata,
          preprocessedText: log.preprocessedText,
          text: log.rawText,
          priority: priority,
          status: log.status
        });

        this.logsTimeArr.push(logDate);
      });
      this.data.push(clusterData);
    });
    // to log
    if (this.startDate || this.endDate) {
      this.logsTimeArr = [];
      this.logsTimeArr.push(this.endDate);
      this.logsTimeArr.push(this.startDate);
    }
    this.options = this.options;

    if (this.ele) {
      this.renderChart();
    }
  }

  ngAfterViewInit() {
    this.ele = this.$element.nativeElement;
    this.snapTable = $('#' + this.snapTable);
    this.renderChart();
  }


  renderChart() {
    const t1: any = new Date();
    this.setChartWrapperHeight(this.ele, this.snapTable);
    this.setChartRowwidth(this.ele, this.snapTable);
    this.drawChart(this.data, this.options, this.ele);
    const t2: any = new Date();
    this.log(`Render chart took ${t2 - t1} ms`);
  }

  getPriorityColor(p, s) {
    if (s === 'V') {
      return (this.priorityColors[p] || this.priorityColors['none']);
    } else {
      return 'none';
    }
  }

  getDotsDataArray(len, pColor) {
    return Array.apply(null, Array(len)).map(() => pColor);
  }

  resizing() {
    clearTimeout(this.resizeId);
    this.resizeId = setTimeout(this.renderChart.bind(this), 10);
  }

  setChartRowwidth(ele: any, snapTable: any) {
    if (!this.snapTable.length) {
      return;
    }
    const rows = this.snapTable.find('.cluster-chart-row');
    rows.css({ 'width': ele.offsetWidth + 'px' });
  }

  setChartWrapperHeight(ele: any, snapTable: any) {
    if (!this.snapTable.length) {
      return;
    }

    this.snapTable.css('visibility', 'visible');

    const wHeight = $(window).innerHeight(),
      snapEle = this.snapTable.find('tbody#cluster-chart-snap'),
      height = wHeight - snapEle.offset().top;

    // $(ele).css({ 'height': height + 'px' });
    $(snapEle).css({ 'height': height + 'px' });
  }

  setChartProperties(data, options) {

    if (!options) {
      options = {};
    } else if (typeof options === 'string') {
      options = JSON.parse(options);
    }

    this.chart.rowHeight = options.rowHeight || 36;
    this.chart.dotsDensity = options.dotsDensity || 150;

    if (!options.margin) {
      options.margin = {};
    }

    this.chart.margin = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    };

    this.chart.timeline = options.timeline === false ? false : true;
    this.chart.timelineTableLines = options.timelineTableLines === false ? false : true;
    this.chart.timeLineHeight = options.timeLineHeight || 36;
    this.chart.timeLineTicks = options.timeLineTicks || 10;

  }

  drawChart(data: any, options: any, ele: any) {

    this.log('Start drawing');
    const t1: any = new Date();

    ele.innerHTML = '';

    this.setChartProperties(data, options);

    const that = this;

    const clusterNumber = data.length;
    if (clusterNumber < 1) {
      this.log('Empty data : cannot create cluster chart');
      return;
    }


    let margin = this.chart.margin,
      rowHeight = this.chart.rowHeight,
      chartDots = this.chart.dotsDensity,
      width = ele.offsetWidth,
      height = data.length * rowHeight;

    const x = d3.scaleTime().range([0, width - margin.right]);
    const xLinear = d3.scaleLinear().range([0, width - margin.right]).domain([0, chartDots]);

    const minX = d3.min(this.logsTimeArr);
    const maxX = d3.max(this.logsTimeArr);
    x.domain([minX, maxX]);

    let top = 0;

    if (this.chart.timeline && this.snapTable.length === 0) {
      top = this.chart.timeLineHeight;
      height = top + height;
    }


    const svg = d3.select(ele).append('svg')
      .attr('viewBox', '0 0 ' + width + ' ' + height)
      .attr('preserveAspectRatio', 'none')
      .style('width', '100%')
      .style('height', height + 'px')
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const t2: any = new Date();
    this.log(`Add svg to element in ${t2 - t1} ms`);

    if (this.chart.timelineTableLines) {
      this.drawTimelineTableLines(svg, x, height);
    }

    this.chartWrapper = svg.append('g').attr('class', 'chartRowsWrapper')
      .attr('transform', 'translate(0,0)');

    if (this.chart.timeline) {
      const setTimeline = this.drawTimelineHeader(x, svg);
      this.setBrush(svg, x, width, height, setTimeline);
    }



    const tootlTipStructure = `<div><span>ATA : </span><span class="ata"></span></div>
          <div><span>Date : </span><span class="date"></span></div>
          <div><span>Desc : </span><span class="desc"></span></div>`;

    const div = $('<div>');
    div.html(tootlTipStructure)
      .attr('class', 'cLogTooltip')
      .css('opacity', 0);

    $('body').find('.cLogTooltip').remove();
    $('body').append(div);

    let viewport = null,
      marginTop = 0;

    if (this.snapTable.length) {
      viewport = d3.selectAll('tbody#cluster-chart-snap');
      marginTop = 0;
    } else {
      viewport = d3.selectAll('.clusterChart');
      marginTop = this.chart.timeLineHeight;
    }


    const scroller = virtualScroller({
      viewport: viewport,
      enter: function (rowSelection) {
        that.rowEnter(rowSelection, x, width, height, rowHeight, div, that);
      },
      update: function (rowSelection) {
        that.rowUpdate(rowSelection, x, width, height, rowHeight, div, that);
      },
      exit: function (rowSelection) {
      },
      data: data,
      dataid: function (d) { return d.id; },
      totalRows: data.length,
      rowHeight: rowHeight,
      marginTop: marginTop,
      emitScroll: function (pos, start, end) {
        that.updateList.emit({ pos: pos, start: start, end: end });
      }

    });

    this.chartWrapper.call(scroller);
    const t3: any = new Date();
    this.log('Add lines and ${this.logsTimeArr.length} logs dots in ${t3 - t2} ms');

  }

  rowEnter(rowSelection, x, width, height, rowHeight, div, that) {

    rowSelection.selectAll('line')
      .data(function (d: any) {
        return [d.priority];
      })
      .enter()
      .append('line')
      .attr('class', function (d) {
        return 'dot ' + that.priorityClass[d];
      })
      .attr('x1', 0)
      .attr('y1', rowHeight / 2)
      .attr('x2', width)
      .attr('y2', rowHeight / 2)
      .attr('stroke-dasharray', '2 2');


  }
  rowUpdate(rowSelection, x, width, height, rowHeight, div, that) {

    const logDots = this.logDots = rowSelection.selectAll('circle.log')
      .data(function (d: any) { return d.techLogs; })
      .enter().append('circle')
      .attr('stroke', function (d: any, i) { return that.getStrokeColor(d.priority, d.status); })
      .attr('stroke-width', 2)
      .attr('r', 3)
      .attr('cx', function (d: any, i) { return x(d.logDate); })
      .attr('cy', function (d: any, i) { return (rowHeight / 2); })
      .style('fill', function (d: any) {
        return that.getPriorityColor(d.priority, d.status);
      });


    logDots.on('mouseover', function (d) {
      const left = d3.event.pageX - 15, // - $(ele).offset().left,
        top = d3.event.pageY - 90; // - $(ele).offset().top;

      div.find('.ata').text(d.ata);
      div.find('.date').text(d.logDate.toGMTString());
      div.find('.desc').text(d.text);

      div.css({
        'opacity': .9,
        'left': left + 'px',
        'top': top + 'px'
      });
    })
      .on('mouseout', function (d) {
        div.css({
          'opacity': 0,
          'left': '-100px',
          'top': '-100px'
        });
      });
  }

  getStrokeColor(p, s) {
    if (s !== 'V') {
      return (this.priorityColors[p] || this.priorityColors['none']);
    } else {
      return 'none';
    }
  }

  drawTimelineHeader(x, svg) {

    const width = x.range()[1],
      height = this.chart.timeLineHeight;

    if (this.snapTable.length) {
      const snapTimline = this.snapTable.find('#cluster-chart-timeline')[0];
      snapTimline.innerHTML = '';
      svg = d3.select(snapTimline).append('svg').attr('viewBox', '0 0 ' + width + ' ' + height)
        .attr('preserveAspectRatio', 'none')
        .style('width', '100%')
        .style('height', height + 'px');
    }

    const timeFormat = d3.timeFormat('%y'),
      rangeX0 = x.range()[0],
      rangeX1 = x.range()[1],
      x2 = d3.scaleTime().range([0, rangeX1]),
      rowHeight = this.chart.timeLineHeight;

    x2.domain(x.domain());

    // timline
    const timeLineWrap = this.timeLineWrapper = svg.append('g').attr('class', 'timeLine');
    timeLineWrap.attr('transform', 'translate(0,' + 0 + ')');
    timeLineWrap.append('rect')
      .attr('width', x.range()[1])
      .attr('height', rowHeight);
    const axisXScale = d3.axisBottom(x);
    // .tickFormat(timeFormat);
    timeLineWrap.call(axisXScale);

    return axisXScale;

  }

  setBrush(svg: any, x, width, height, timeAxis) {

    const that = this;

    let brush = d3.brushX().on('end', brushended),
      idleTimeout,
      idleDelay = 350,
      domain = x.domain().slice(0);

    brush.extent([[0, 0], [width, height]]);

    const brushWrapper = this.chartWrapper.append('g')
      .attr('class', 'brush')
      .call(brush);


    function brushended() {
      if (!d3.event.sourceEvent) {
        return;
      }

      const s = d3.event.selection;
      if (!s) {
        if (!idleTimeout) {
          return idleTimeout = setTimeout(idled, idleDelay);
        }
        x.domain(domain);
        zoomOutBtn.addClass('disabled');
      } else {
        x.domain([s[0], s[1]].map(x.invert, x));
        brushWrapper.call(brush.move, null);
        zoomOutBtn.removeClass('disabled');
      }
      scaleToNewX();
    }

    function idled() {
      idleTimeout = null;
    }

    function scaleToNewX() {
      const t = svg.transition().duration(750);
      const chartRows = d3.selectAll('.cluster');
      chartRows.selectAll('circle.log').transition(t)
        .attr('cx', function (d: any) { return x(d.logDate); });
      that.timeLineWrapper.transition(t).call(timeAxis);
      that.timeAxis.emit({ startTime: x.domain()[0], endTime: x.domain()[1]});

    }

    const canZoom = false,
      snapEle = this.snapTable.find('tbody#cluster-chart-snap');

    function disableBrush() {
      brush.extent([[0, 0], [0, 0]]);
      svg.select('.brush').call(brush);
    }

    function enableBrush() {
      brush.extent([[0, 0], [width, height]]);
      svg.select('.brush').call(brush);
    }

    function onKeyDown(e) {
      if (e.ctrlKey && e.keyCode === 17) {
        disableBrush();
      }
    }

    function onKeyUp(e) {
      if (e.keyCode === 17) {
        enableBrush();
      }
    }

    window.onkeydown = onKeyDown;
    window.onkeyup = onKeyUp;

    const zoomOutBtn = $('.zoomOutChart');
    zoomOutBtn.addClass('disabled');

    zoomOutBtn.on('click', () => {
      if (zoomOutBtn.hasClass('disabled')) {
        return;
      }
      x.domain(domain);
      scaleToNewX();
      zoomOutBtn.addClass('disabled');
    });
    this.timeAxis.emit({ startTime: x.domain()[0], endTime: x.domain()[1]});


    // this.snapTable.on('mousedown', enableBrush);
    // this.snapTable.on('mouseup', disableBrush);

    // disableBrush();

  }

  drawTimelineTableLines(svg, x, height) {

    const linesWrapper = svg.append('g').attr('class', 'linesWrapper'),
      rangeX0 = x.range()[0],
      rangeX1 = x.range()[1],
      spacing = (rangeX1 / this.chart.timeLineTicks);

    let top = 0;

    if (this.chart.timeline && this.snapTable.length === 0) {
      top = this.chart.timeLineHeight;
    }

    const tickValues = [];

    for (let i = rangeX0; i < rangeX1; i += spacing) {
      tickValues.push(i);
    }

    linesWrapper
      .selectAll('line')
      .data(tickValues)
      .enter()
      .append('line')
      .attr('x1', (d, i) => { return d; })
      .attr('y1', (d, i) => { return top; })
      .attr('x2', (d, i) => { return d; })
      .attr('y2', (d, i) => { return height; });
  }

}