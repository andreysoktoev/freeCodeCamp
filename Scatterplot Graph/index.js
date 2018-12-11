const w = 640,
      h = 320,
      p = 50;

const svg = d3
  .select('body')
  .append('svg')
  .attr('width', w)
  .attr('height', h);

const legendItems = [
  ['red', 'Riders with doping allegations'],
  ['green', 'No doping allegations']
];

const legend = d3
  .select('body')
  .append('svg')
  .attr('width', 165)
  .attr('height', 35)
  .attr('id', 'legend');

legend
  .selectAll('circle')
  .data(legendItems)
  .enter()
  .append('circle')
  .attr('cx', 5)
  .attr('cy', (d, i) => 5 + i * 20)
  .attr('r', 5)
  .style('fill', (d) => d[0]);

legend
  .selectAll('text')
  .data(legendItems)
  .enter()
  .append('text')
  .attr('x', 15)
  .attr('y', (d, i) => 9 + i * 20)
  .text((d) => d[1]);

let tooltip = d3
  .select('body')
  .append('div')
  .attr('id', 'tooltip');

let parseTime = d3.timeParse('%M:%S');
let parseYear = d3.timeParse('%Y');
let timeFormat = d3.timeFormat("%M:%S");

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(function (data) {

    const xScale = d3
      .scaleTime()
      .domain([
        parseYear(d3.min(data, (d) => d.Year) - 1),
        parseYear(d3.max(data, (d) => d.Year) + 1)
      ])
      .range([p, w - p]);

    const yScale = d3
      .scaleTime()
      .domain([
        parseTime(d3.max(data, (d) => d.Time)),
        parseTime(d3.min(data, (d) => d.Time))
      ])
      .range([h - p, p]);

    svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(parseYear(d.Year)))
      .attr('cy', (d) => yScale(parseTime(d.Time)))
      .attr('r', 5)
      .attr('class', (d) => {
        if (d.Doping == "") { return 'dot dot_nodoping' }
        else { return 'dot' }
      })
      .attr('data-xvalue', (d) => parseYear(d.Year))
      .attr('data-yvalue', (d) => parseTime(d.Time).toISOString())
      .on('mouseover', (d) => {
        tooltip
          .html(
            '<b>' + d.Name + '</b>' +
            'Time: ' + d.Time + '<br>' +
            'Place: ' + d.Place + '<br>' +
            'Year: ' + d.Year + '<br>' +
            'Nationality: ' + d.Nationality + '<br>' +
            (d.Doping != '' ? 'Doping: ' + d.Doping : '')
          )
        .style('opacity', '1')
        .style('z-index', '999')
        .style('top', event.pageY - 15 - document.getElementById('tooltip').offsetHeight + 'px')
        .style('left', event.pageX + 15 + 'px');
        tooltip.attr('data-year', parseYear(d.Year));
      })
      .on('mouseout', () => {tooltip
        .style('opacity', '0')
        .style('z-index', '-999')
      });

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

    svg
      .append('g')
      .attr('transform', 'translate(0, ' + (h - p) + ')')
      .attr('class', 'axis')
      .attr('id', 'x-axis')
      .call(xAxis);

    svg
      .append('g')
      .attr('transform', 'translate(' + p + ', 0)')
      .attr('class', 'axis')
      .attr('id', 'y-axis')
      .call(yAxis);

  });