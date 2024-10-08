"use strict	";

const plotWidth = 1500;
const plotHeight = 600;
const padding = 60;

const legendWidth = 400;
const legendHeight = 50;
const legendPadding = 50;

const barColor = "#607EAA";
const barWidth = 100;
const selectionColor = "#1C3879";

const colors = [
  "rgb(69, 117, 180)",
  "rgb(116, 173, 209)",
  "rgb(171, 217, 233)",
  "rgb(224, 243, 248)",
  "rgb(255, 255, 191)",
  "rgb(254, 224, 144)",
  "rgb(253, 174, 97)",
  "rgb(244, 109, 67)",
  "rgb(215, 48, 39)",
  "rgb(165, 0, 38)",
];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const plotGraph = (data) => {
  const { baseTemperature, monthlyVariance } = data;

  const years = Array.from(new Set(monthlyVariance.map((d) => d.year)));
  const months = Array.from(new Set(monthlyVariance.map((d) => d.month)));

  const tooltip = d3.select("#tooltip");

  const xScale = d3
    .scaleBand()
    .domain(years)
    .range([padding, plotWidth - padding]);

  const yScale = d3
    .scaleBand()
    .domain(months)
    .range([padding, plotHeight - padding]);

  const temperatureScale = d3
    .scaleLinear()
    .domain([2.8, 12.8])
    .range([0, colors.length - 1]);

  const legendScale1 = d3
    .scaleBand()
    .domain(colors.map((_c, i) => i))
    .range([legendPadding, legendWidth - legendPadding]);

  const legendScale2 = d3
    .scaleLinear()
    .domain([0, colors.length - 1])
    .range([legendPadding, legendWidth - legendPadding]);

  const legendScale3 = d3
    .scaleLinear()
    .domain([0, colors.length - 1])
    .range([2.8, 12.8]);

  const svg = d3
    .select("#container")
    .append("svg")
    .attr("width", plotWidth)
    .attr("height", plotHeight);

  svg
    .selectAll("rect")
    .data(monthlyVariance)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(d.month))
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .attr("class", "cell")
    .attr(
      "fill",
      (d) => colors[Math.floor(temperatureScale(baseTemperature + d.variance))]
    )
    .attr("data-month", (d) => d.month - 1)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => baseTemperature + d.variance)
    .on("mouseover", (event, d) => {
      const rectElement = event.target;

      d3.select(rectElement).attr("stroke", "black").attr("stroke-width", 2);

      tooltip
        .attr("data-year", d.year)
        .style("visibility", "visible")
        .html(
          `${d.year} - ${monthNames[d.month - 1]}<br>${
            baseTemperature + d.variance
          } ℃<br>${d.variance} ℃`
        )
        .style("font-family", "sans-serif")
        .style("font-size", "12px")
        .style("left", event.pageX + 20 + "px")
        .style("top", event.pageY - 30 + "px");
    })
    .on("mouseout", (event) => {
      const rectElement = event.target;

      d3.select(rectElement).attr("stroke", "none");

      tooltip.style("visibility", "hidden");
    });

  const xAxis = d3
    .axisBottom(xScale)
    .tickValues(years.filter((year, i) => i % 10 === 0))
    .tickFormat(d3.format("d"));

  const yAxis = d3
    .axisLeft(yScale)
    .tickFormat((month) => monthNames[month - 1]);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${plotHeight - padding})`)
    .call(xAxis);

  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${plotWidth / 2}, ${plotHeight - 20})`)
    .style("font-family", "sans-serif")
    .style("font-size", "12px")
    .text("Years");

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
      `translate(${padding - 50}, ${plotHeight / 2}) rotate(-90)`
    )
    .style("font-family", "sans-serif")
    .style("font-size", "12px")
    .text("Months");

  const legend = d3
    .select("#legend")
    .append("svg")
    .attr("width", legendWidth)
    .attr("height", legendHeight);

  legend
    .selectAll("rect")
    .data(colors)
    .enter()
    .append("rect")
    .attr("x", (_d, i) => legendScale1(i))
    .attr("y", 0)
    .attr("width", legendScale1.bandwidth())
    .attr("height", 30)
    .attr("fill", (d) => d);

  const legendAxis = d3
    .axisBottom(legendScale2)
    .tickValues(d3.range(0, colors.length))
    .tickFormat((d) => legendScale3(d).toFixed(1));

  legend
    .append("g")
    .attr("id", "legend-axis-axis")
    .attr("transform", `translate(0, ${30})`)
    .call(legendAxis);

  legend
    .append("text")
    .attr("text-anchor", "middle")
    .style("font-family", "sans-serif")
    .style("font-size", "12px")
    .text("Years");
};

const getData = (url) => {
  fetch(url)
    .then((response) => response.json())
    .then((data) => plotGraph(data));
};

getData(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
);
