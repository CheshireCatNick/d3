function main() {
  // svg settings
  const svgH = 600, svgW = 800;
  const svg = d3.select('.content').append('svg')
                                .attr('height', svgH)
                                .attr('width', svgW);
  // well, it's a secret                              
  function secretTransform(d, i) {
    return d * 10 + i + 200;
  }
  // read data array, find min max and draw axis
  const dataNum = 200;
  let data = null; 
  let maxX, maxY;
  d3.csv('https://cheshirecatnick.github.io/d3/data.csv', (d) => {
    data = d.slice(1, dataNum);
    const maxY = d3.max(data, (d) => {
      return secretTransform(d.beds);
    });
    const maxX = svgW;
    // draw axis
    const scaleX = d3.scaleLinear()
          .domain([300, 1000])
          .range([0, svgW - 30]);
    const scaleY = d3.scaleLinear()
          .domain([0, maxY])
          .range([0, svgH - 20]);

    svg.append("g")
        .attr("transform", "translate(10," + (svgH - 20) + ")")
        .call(d3.axisBottom(scaleX));
    svg.append("g")
        .attr("transform", "translate(" + 0 + ", 0)")
        .call(d3.axisLeft(scaleY));

  });
  // define line function and axis
  const lineFunction = d3.line()
                          .x((d, i) => { return ((svgW - 10) / dataNum) * i; })
                          .y((d, i) => { return svgH - secretTransform(d.beds, i); });

  // draw the display data every 0.1s
  let displayData = [];
  let displayDataNum = 0;
  const timer = setInterval(() => {
    if (displayDataNum >= dataNum - 2)
      clearInterval(timer);
    displayData.push(data[displayDataNum]);
    displayDataNum += 1;
    svg.append('path').data([displayData])
                      .attr('d', lineFunction)
                      .attr('stroke', 'red')
                      .attr('fill', 'none');

  }, 20);
}