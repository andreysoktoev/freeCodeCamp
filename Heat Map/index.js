d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
  .then((data) => {

    const
      ds = data.monthlyVariance,
      p = {top: 50, right: 50, bottom: 50, left: 100},
      ch = 30,
      cw = 3,
      h = 12 * (ch + 1) - 1 + p.top + p.bottom,
      w = Math.ceil(ds.length/12) * (cw + 1) - 1 + p.left + p.right,
      parseYear = d3.timeParse('%Y'),
      formatYear = d3.timeFormat('%Y'),
      formatTime = d3.timeFormat('%Y, %B'),
      minY = d3.min(ds, (d) => d.year),
      maxY = d3.max(ds, (d) => d.year),
      bt = data.baseTemperature,
      minT = d3.min(ds, (d) => bt + d.variance),
      maxT = d3.max(ds, (d) => bt + d.variance),
      rt = [],
      colors = ['#ffffcc','#ffeda0','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#bd0026','#800026'],
      x = colors.length,
      m = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    
    for (i = 1; i <= x; i++) {
      rt.push(minT + (maxT - minT) / x * i);
    };

    const svg = d3
      .select('body')
      .append('svg')
      .attr('width', w)
      .attr('height', h);

    const xScale = d3
      .scaleTime()
      .domain([parseYear(minY), parseYear(maxY)])
      .range([p.left, w - p.right]);
      
    const yScale = d3
      .scaleBand()
      .domain(m.map(i => d3.timeFormat('%B')(new Date('', i - 1))))
      .rangeRound([p.top, h - p.bottom])
      .paddingInner(.1);

    const
      xAxis = d3.axisBottom(xScale).tickFormat(formatYear),
      yAxis = d3.axisLeft(yScale);

    const tooltip = d3
      .select('body')
      .append('div')
      .attr('id', 'tooltip');

    svg
      .selectAll('rect')
      .data(ds)
      .enter()
      .append('rect')
      .attr('height', ch)
      .attr('width', cw)
      .attr('x', (d) => p.left + (d.year - minY) * (cw + 1))
      .attr('y', (d) => p.top + (d.month - 1) * (ch + 1))
      .style('fill', (d) => {
        for (i = 0; i < x; i++) {
          if ((bt + d.variance) <= rt[i]) {
            return colors[i]
          }
        }
      })
      .attr('class', 'cell')
      .attr('data-month', (d) => d.month - 1)
      .attr('data-year', (d) => d.year)
      .attr('data-temp', (d) => parseFloat(bt + d.variance).toFixed(2) + '°C')
      .on('mouseover', (d) => {tooltip
        .style('top', event.pageY - 30 - document.getElementById('tooltip').offsetHeight + 'px')
        .style('left', event.pageX + 10 + 'px')
        .style('z-index', '999')
        .style('opacity', '1')
        .style('color', 'rgba(255, 255, 255, .75)')
        .html(
          formatTime(new Date(d.year, d.month - 1)) + '<br>' +
          parseFloat(bt + d.variance).toFixed(2) + '°C'
        )
        .attr('data-year', d.year)
      })
      .on('mouseout', (d) => {tooltip
        .style('color', 'transparent')
        .style('opacity', '0')
        .style('z-index', '-999')
      });
      
    svg
      .append('g')
      .attr('transform', 'translate(-1, ' + (h - p.bottom) + ')')
      .attr('id', 'x-axis')
      .call(xAxis);

    svg
      .append('g')
      .attr('transform', 'translate(' + (p.left - 1) + ', ' + '0)')
      .attr('id', 'y-axis')
      .call(yAxis);

    const legend = d3
      .select('body')
      .append('svg')
      .attr('width', w)
      .attr('height', p.bottom)
      .attr('id', 'legend');

    const
      lcw = 116,
      lch = 5,
      lw = ((lcw + 1) * colors.length - 1),
      lxScale = d3
        .scaleLinear()
        .domain([minT, maxT])
        .range([0, lw]),
      lxAxis = d3.axisBottom(lxScale).tickValues(rt).tickFormat(d3.format('.2f'));

    legend
      .selectAll('rect')
      .data(rt)
      .enter()
      .append('rect')
      .attr('width', lcw)
      .attr('height', lch)
      .attr('x', (d, i) => p.left + i * (lcw + 1))
      .attr('y', 0)
      .style('fill', (d, i) => colors[i]);

    legend
      .append('g')
      .attr('transform', 'translate(' + (p.left - 1) + ', ' + lch + ')')
      .call(lxAxis)
      .call(g => g.select('.domain').remove());

  })