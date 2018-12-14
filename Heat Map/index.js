const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

d3.json(url).then((data) => {

  const
    ds = data.monthlyVariance,
    p = 100,
    ch = 40,
    cw = 4,
    h = 12 * (ch + 1) - 1 + ch,
    w = Math.ceil(ds.length/12) * (cw + 1) - 1 + 2 * p,
    parseYear = d3.timeParse('%Y'),
    formatYear = d3.timeFormat('%Y'),
    formatTime = d3.timeFormat("%Y, %B"),
    minY = d3.min(ds, (d) => d.year),
    maxY = d3.max(ds, (d) => d.year),
    bt = data.baseTemperature,
    minT = d3.min(ds, (d) => bt + d.variance),
    maxT = d3.max(ds, (d) => bt + d.variance),
    x = 10,
    rt = [],
    colors = [
      // '#08306b', '#08519c', '#2171b5', '#4292c6', '#6baed6', '#9ecae1', '#c6dbef', '#deebf7', '#f7fbff',
      // '#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'
      // '#0571b0', '#92c5de', '#f7f7f7', '#f4a582', '#ca0020'
      '#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'
    ],
    m = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  
  for (i = 1; i <= x; i++) {
    rt.push(minT + (maxT - minT) / x * i);
  };
  console.log(maxT);
  console.log(rt);

  const svg = d3
    .select('body')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

  const xScale = d3
    .scaleTime()
    .domain([parseYear(minY), parseYear(maxY)])
    .range([p, w - p]);
    
  const yScale = d3
    .scaleBand()
    .domain(m.map(i => d3.timeFormat('%B')(new Date('', i - 1))))
    .rangeRound([0, h - ch])
    .paddingInner(.1);

  const tooltip = d3
    .select('body')
    .append('div')
    .attr('id', 'tooltip');

  svg
    .selectAll('rect')
    .data(ds)
    .enter()
    .append('rect')
    .attr('height', ch)
    .attr('width', cw)
    .attr('x', (d) => p + (d.year - minY) * (cw + 1))
    .attr('y', (d) => (d.month - 1) * (ch + 1))
    .style('fill', (d) => {
      for (i = 0; i < x; i++) {
        if ((bt + d.variance) <= rt[i]) {
          return colors[i]
        }
      }
    })
    .attr('class', 'cell')
    .attr('data-month', (d) => d.month - 1)
    .attr('data-year', (d) => d.year)
    .attr('data-temp', (d) => parseFloat(bt + d.variance).toFixed(2) + '°C')
    .on('mouseover', (d) => {tooltip
      .style('top', event.pageY - 30 - document.getElementById('tooltip').offsetHeight + 'px')
      .style('left', event.pageX + 10 + 'px')
      .style('z-index', '999')
      .style('opacity', '1')
      .style('color', 'rgba(255, 255, 255, .75)')
      .html(
        formatTime(new Date(d.year, d.month - 1)) + '<br>' +
        parseFloat(bt + d.variance).toFixed(2) + '°C'
      )
      .attr('data-year', d.year)
    })
    .on('mouseout', (d) => {tooltip
      .style('color', 'transparent')
      .style('opacity', '0')
      .style('z-index', '-999')
    });

  const
    xAxis = d3.axisBottom(xScale).tickFormat(formatYear),
    yAxis = d3.axisLeft(yScale);

  svg
    .append('g')
    .attr('transform', 'translate(-1, ' + (h - ch) + ')')
    .attr('id', 'x-axis')
    .call(xAxis);

  svg
    .append('g')
    .attr('transform', 'translate(' + (p - 1) + ', ' + '0)')
    .attr('id', 'y-axis')
    .call(yAxis);

})