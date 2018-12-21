const
  u = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json',
  e = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json',
  w = 960,
  h = 640,
  k = 9,
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

Promise.all([u, e].map(i => d3.json(i))).then((results) => {

  [us, edu] = results;

  const
    min = d3.min(edu, d => d.bachelorsOrHigher),
    max = d3.max(edu, d => d.bachelorsOrHigher),
    r = d3.range(min, max, (max - min) / k),
    someScale = d3
      .scaleQuantize()
      .domain([min, max])
      .range(["#29ABE2", "#2D98DD", "#3185D9", "#3572D5", "#395FD1", "#3E4CCC", "#4239C8", "#4626C4", "#4A13C0", "#4F00BC"]);

  console.log(d3.interpolateBlues(.5));

  svg
    .append('g')
    .selectAll('path')
    .data(topojson.feature(us, us.objects.counties).features)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('d', path)
    .attr('data-fips', d => d.id)
    .attr('data-education', d => edu.filter(i => i.fips == d.id)[0].bachelorsOrHigher)
    .style('fill', d => someScale(
      edu.filter(i => i.fips == d.id)[0].bachelorsOrHigher
    ))
    .on('mouseover', d => tooltip
      .style('display', 'inline')
      .html('Test')
    )
    .on('mouseout', d => tooltip
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

document.body.onmousemove = (event) => {
  const t = document.getElementById('tooltip');
  t.style.top = event.pageY - 15 - t.offsetHeight + 'px';
  t.style.left = event.pageX + 15 + 'px';
};