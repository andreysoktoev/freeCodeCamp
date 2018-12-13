const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

d3.json(url).then((data) => {

  const
    ds = data.monthlyVariance,
    p = 50,
    ch = 40,
    cw = 4,
    h = 12 * (ch + 1) - 1 + 2 * p,
    w = Math.ceil(ds.length/12) * (cw + 1) - 1 + 2 * p,
    minY = d3.min(ds, (d) => d.year),
    maxY = d3.max(ds, (d) => d.year),
    formatTime = d3.timeFormat("%Y, %B"),
    parseYear = d3.timeParse('%Y'),
    m = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  
  const svg = d3
    .select('body')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

  const xScale = d3
    .scaleLinear()
    .domain([minY, maxY])
    .range([p, w - p]);
    
  const yScale = d3
    .scaleLinear()
    .domain([0, m.length])
    .range([p, h - p]);

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
    .attr('y', (d) => p + (d.month - 1) * (ch + 1))
    .style('fill', 'blueviolet')
    .attr('class', 'cell')
    .attr('data-month', (d) => d.month - 1)
    .attr('data-year', (d) => d.year)
    .attr('data-temp', (d) => parseFloat(data.baseTemperature + d.variance).toFixed(2) + '°C')
    .on('mouseover', (d) => {tooltip
      .style('top', event.pageY - 10 - document.getElementById('tooltip').offsetHeight + 'px')
      .style('left', event.pageX + 10 + 'px')
      .style('z-index', '999')
      .style('opacity', '1')
      .style('color', 'rgba(255, 255, 255, .75)')
      .html(
        formatTime(new Date(d.year, d.month - 1)) + '<br>' +
        parseFloat(data.baseTemperature + d.variance).toFixed(2) + '°C'
      )
      .attr('data-year', d.year)
    })
    .on('mouseout', (d) => {tooltip
      .style('color', 'transparent')
      .style('opacity', '0')
      .style('z-index', '-999')
    });

  const
    xAxis = d3.axisBottom(xScale),
    yAxis = d3.axisLeft(yScale);

  svg
    .append('g')
    .attr('transform', 'translate(0, ' + (h - p) + ')')
    .attr('id', 'x-axis')
    .call(xAxis);

  svg
    .append('g')
    .attr('transform', 'translate(' + p + ', ' + '0)')
    .attr('id', 'y-axis')
    .call(yAxis);

})