const w = 700;
const h = 300;
const padding = 50;

const svg = d3.select('body')
   .append('svg')
   .attr('width', w)
   .attr('height', h);

let tooltip = d3
   .select('body')
   .append('div')
   .attr('id', 'tooltip');

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
   .then(function (data) {

      const dataset = data.data;

      const xScale = d3.scaleTime()
         .domain([d3.min(dataset, (d) => new Date(d[0])), d3.max(dataset, (d) => new Date(d[0]))])
         .range([padding, w - padding])

      const yScale = d3.scaleLinear()
         .domain([0, d3.max(dataset, (d) => d[1])])
         .range([h - padding, padding]);

      const rectW = (w - 2 * padding) / dataset.length;

      svg.selectAll('rect')
         .data(dataset)
         .enter()
         .append('rect')
         .attr('height', (d) => h - padding - yScale(d[1]))
         .attr('width', rectW)
         .attr('x', (d, i) => padding + i * rectW)
         .attr('y', (d) => yScale(d[1]))
         .style('fill', 'blueviolet')
         .attr('class', 'bar')
         .on('mouseover', (d) => {tooltip
            .html(d[1])
            .style('opacity', 1);
         })
         .on('mouseout', () => {tooltip
            .style('opacity', 0);
         })

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      svg.append('g')
         .attr('transform', 'traslate(0, ' + (h - padding) + ')')
         .attr('class', 'axis')
         .call(xAxis);

      svg.append('g')
         .attr('transform', 'translate(' + padding + ', 0)')
         .attr('class', 'axis')
         .call(yAxis);

   });

document.body.onmousemove = (e) => {
   document.getElementById('tooltip').style.top = e.pageY - 60 + 'px';
   document.getElementById('tooltip').style.left = e.pageX - 120 + 'px';
   // document.getElementById('tooltip').style.opacity = '1';
};