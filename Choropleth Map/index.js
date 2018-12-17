const
  w = 800,
  h = 600;

const map = d3
  .select('body')
  .append('svg')
  .attr('width', w)
  .attr('height', h);

map.append("path")
  .attr("d", d3.geoPath());