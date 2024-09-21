"use strict	";

const plotWidth = 800;
const plotHeight = 600;
const padding = 60;

const barColor = "#607EAA";
const barWidth = 100;
const selectionColor = "#1C3879";

const plotGraph = (data) => {
  console.log(data);

  const tooltip = d3.select("#tooltip");

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d.Year) - 1, d3.max(data, (d) => d.Year) + 1])
    .range([padding, plotWidth - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => new Date(d.Seconds * 1000)),
      d3.max(data, (d) => new Date(d.Seconds * 1000)),
    ])
    .range([padding, plotHeight - padding]);

  const svg = d3
    .select("#container")
    .append("svg")
    .attr("width", plotWidth)
    .attr("height", plotHeight);

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.Year))
    .attr("cy", (d) => yScale(new Date(d.Seconds * 1000)))
    .attr("r", 6)
    .attr("class", "dot")
    .style("stroke", "#555")
    .style("stroke-width", "1")
    .style("opacity", "90%")
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => new Date(d.Seconds * 1000))
    .attr("fill", (d) => (d.Doping === "" ? "#3d348b" : "#f35b04"))
    .on("mouseover", (event, d) => {
      tooltip
        .attr("data-year", event.target.dataset.xvalue)
        .style("visibility", "visible")
        .html(`${d.Name}: ${d.Nationality}<br>Year: ${d.Year}, Time: ${d.Time}`)
        .style("font-family", "sans-serif")
        .style("font-size", "12px")
        .style("left", event.pageX + 20 + "px")
        .style("top", event.pageY - 30 + "px");
    })
    .on("mouseout", (d) => {
      tooltip.style("visibility", "hidden");
    });

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${plotHeight - padding})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis);

  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr(
      "transform",
      `translate(${padding + 25}, ${plotHeight / 2}) rotate(-90)`
    )
    .text("Time in Minutes")
    .style("font-family", "sans-serif")
    .style("font-size", "12px");
};

const getData = (url) => {
  fetch(url)
    .then((response) => response.json())
    .then((data) => plotGraph(data));
};

getData(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
);
