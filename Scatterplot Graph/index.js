const w = 640;
const h = 320;
const p = 50;

const svg = d3
  .select('body')
  .append('svg')
  .attr('width', w)
  .attr('height', h);

let tooltip = d3
  .select('body')
  .append('div')
  .attr('id', 'tooltip');

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(function (data) {

    const xScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.Year), d3.max(data, (d) => d.Year)])
      .range([p, w - p]);

    const yScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.Seconds), d3.max(data, (d) => d.Seconds)])
      .range([h - p, p]);

    svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.Year))
      .attr('cy', (d) => yScale(d.Seconds))
      .attr('r', 5)
      .attr('class', 'dot')
      .attr('data-xvalue', (d) => xScale(d.Year))
      .attr('data-yvalue', (d) => yScale(d.Seconds))
      .on('mouseover', (d) => {tooltip
        .html(d.Year)
        .style('opacity', '1')
        .style('top', event.pageY - 60 + 'px')
        .style('left', event.pageX - 120 + 'px');
      })
      .on('mouseout', () => {tooltip
        .style('opacity', '0');
      })

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg
      .append('g')
      .attr('transform', 'translate(0, ' + (h - p) + ')')
      .attr('id', 'x-axis')
      .call(xAxis);

    svg
      .append('g')
      .attr('transform', 'translate(' + p + ', 0)')
      .attr('id', 'y-axis')
      .call(yAxis);

  });