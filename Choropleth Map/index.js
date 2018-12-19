const
  w = 960,
  h = 640,
  path = d3.geoPath();

const svg = d3
  .select('body')
  .append('svg')
  .attr('width', w)
  .attr('height', h);

d3.json('counties.json').then((us) => {

  svg
    .append('g')
    .selectAll('path')
    .data(topojson.feature(us, us.objects.counties).features)
    .enter()
    .append('path')
    .attr('fill', 'lightsalmon')
    .attr('d', path);

  svg
    .append('path')
    .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-linejoin', 'round')
    .attr('d', path);

});