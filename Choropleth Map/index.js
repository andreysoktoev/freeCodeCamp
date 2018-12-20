const
  w = 960,
  h = 640,
  path = d3.geoPath();

const svg = d3
  .select('body')
  .append('svg')
  .attr('width', w)
  .attr('height', h);

const tooltip = d3
  .select('body')
  .append('div')
  .attr('id', 'tooltip');

d3.json('counties.json').then((us) => {

  svg
    .append('g')
    .selectAll('path')
    .data(topojson.feature(us, us.objects.counties).features)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('d', path)
    .on('mouseover', (d) => tooltip
      .style('display', 'inline')
      .attr('data-education', d.id)
      .html(d.id)
    )
    .on('mouseout', (d) => tooltip
      .style('display', 'none')
      .attr('data-education', null)
      .html(null)
    );

  svg
    .append('path')
    .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
    .attr('fill', 'none')
    .attr('stroke', '#282828')
    .attr('stroke-linejoin', 'round')
    .attr('d', path);

});

document.body.onmousemove = () => {
  const t = document.getElementById('tooltip');
  t.style.top = event.pageY - 15 - t.offsetHeight + 'px';
  t.style.left = event.pageX + 15 + 'px';
};