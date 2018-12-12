const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

d3.json(url).then((data) => {

  const p = 50,
        cw = 5,
        ch = 5,
        w = Math.ceil(data.monthlyVariance.length/12) * cw + 2 * p,
        h = 12 * ch + 2 * p;

  const svg = d3
    .select('body')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

  svg
    .selectAll('rect')
    .data(data.monthlyVariance)
    .enter()
    .append('rect')
    .attr('height', ch)
    .attr('width', cw)
    .attr('x', (d, i) => p + i * (cw + 1))
    .attr('y', 0)
    .style('fill', 'blueviolet');

})