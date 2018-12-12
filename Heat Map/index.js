const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

d3.json(url).then((data) => {

  const
    ds = data.monthlyVariance,
    p = 50,
    c = 20,
    w = 12 * (c + 1) - 1 + 2 * p,
    h = Math.ceil(ds.length/12) * (c + 1) - 1 + 2 * p,
    minY = d3.min(ds, (d) => d.year),
    formatTime = d3.timeFormat("%Y, %B");
  
  const svg = d3
    .select('body')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

  const tooltip = d3
    .select('body')
    .append('div')
    .attr('id', 'tooltip');

  svg
    .selectAll('rect')
    .data(ds)
    .enter()
    .append('rect')
    .attr('height', c)
    .attr('width', c)
    .attr('x', (d) => p + (d.month - 1) * (c + 1))
    .attr('y', (d) => p + (d.year - minY) * (c + 1))
    .style('fill', 'blueviolet')
    .on('mouseover', (d) => {tooltip
      .style('top', event.pageY - 10 - document.getElementById('tooltip').offsetHeight + 'px')
      .style('left', event.pageX + 10 + 'px')
      .style('z-index', '999')
      .style('opacity', '1')
      .html(
        formatTime(new Date(d.year, d.month)) + '<br>' +
        parseFloat(data.baseTemperature + d.variance).toFixed(2) + '°C'
      );
    })
    .on('mouseout', (d) => {tooltip
      .style('opacity', '0')
      .style('z-index', '-999')
    })

})