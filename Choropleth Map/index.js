const
  u = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json',
  e = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json',
  w = 960,
  h = 620,
  lrw = 50,
  lrh = 10,
  c = ['#29ABE2', '#2F8EDB', '#3572D5', '#3C55CF', '#4239C8', '#481CC2', '#4F00BC'],
  path = d3.geoPath();

const svg = d3
  .select('body')
  .append('svg')
  .attr('width', w)
  .attr('height', h);

const legend = d3
  .select('body')
  .append('svg')
  .attr('width', lrw * c.length)
  .attr('height', lrh * 3)
  .attr('id', 'legend');

legend
  .selectAll('rect')
  .data(c)
  .enter()
  .append('rect')
  .attr('width', lrw)
  .attr('height', lrh)
  .attr('x', (d, i) => i * lrw)
  .attr('y', 0)
  .style('fill', d => d);

const
  lScale = d3
    .scaleLinear()
    .domain([0, 70])
    .rangeRound([0, lrw * c.length]),
  lAxis = d3.axisBottom(lScale).tickValues([10, 20, 30, 40, 50, 60]).tickSize(0);

legend
  .append('g')
  .attr('transform', 'translate(0, ' + (lrh + 5) + ')')
  .attr('class', 'axis')
  .call(lAxis)
  .call(g => g.select('.domain').remove());

const tooltip = d3
  .select('body')
  .append('div')
  .attr('id', 'tooltip');

Promise.all([u, e].map(i => d3.json(i))).then((results) => {

  [us, edu] = results;

  const colors = d3
    .scaleQuantize()
    .domain([0, 60])
    .range(c);

  svg
    .append('g')
    .selectAll('path')
    .data(topojson.feature(us, us.objects.counties).features)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('stroke', '#320078')
    .attr('stroke-width', '.1')
    .attr('stroke-linejoin', 'round')
    .attr('d', path)
    .attr('data-fips', d => d.id)
    .attr('data-education', d => edu.filter(i => i.fips == d.id)[0].bachelorsOrHigher)
    .style('fill', d => colors(
      edu.filter(i => i.fips == d.id)[0].bachelorsOrHigher
    ))
    .on('mouseover', d => tooltip
      .style('display', 'inline')
      .attr('data-education', edu.filter(i => i.fips == d.id)[0].bachelorsOrHigher)
      .html(
        edu.filter(i => i.fips == d.id)[0].area_name + ', ' +
        edu.filter(i => i.fips == d.id)[0].state + ': ' +
        edu.filter(i => i.fips == d.id)[0].bachelorsOrHigher + '%'
      )
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