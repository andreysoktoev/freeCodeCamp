const
  w = 800,
  h = 600;

const svg = d3
  .select('#map')
  .append('svg')
  .attr('width', w)
  .attr('height', h);

const projection = geoEqualEarth();

svg
  .append('path')
  .datum('https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json')
  .attr('d', geoPath(projection));