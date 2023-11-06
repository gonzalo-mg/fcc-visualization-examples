import "./index.css";

import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

import dataRaw from "../../data/global-land-temperature.json";

// add a property with the month in name, as original data only has month as number
const monthsNamesList = [
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

function addMonthName(dataRaw) {
  // for each datum set the name of the month according to the month number
  dataRaw.monthlyVariance.forEach((month) => {
    month.monthName = monthsNamesList[month.month - 1];
  });
  return dataRaw;
}

const dataWithMonthNames = addMonthName(dataRaw);

export function D3LandTemp() {
  // references to current elements
  const svgRef = useRef();
  const tooltipRef = useRef();

  // component block name to use in css
  const Component = `D3LandTempp`;

  // GEOMETRY
  // svg canvas size

  const margin = { top: 100, right: 50, bottom: 75, left: 100 };
  const width = 750 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // article (continer) size: to sync article and footer width with svg
  const widthTotal = width + margin.left + margin.right;

  // TEXTS

  const title = "Monthly Global Land-Surface Temperature";
  const subtitle = "1753 - 2015: base temperature 8.66℃";

  /*   const xAxisLabel = "Year";
  const yAxisLabel = "Month"; */

  // DATA

  const [data, setData] = useState(dataWithMonthNames);

  // SCALES, DOMAINS AND RANGES
  // domain: valid input values
  // range: valid output values

  // X dimension: years
  // domain: all years in dataset
  const xDomain = d3.map(data.monthlyVariance, (datum) => datum.year);
  // range: min and max values for horizontal dimension of canvas
  const xRange = [0, width];
  // scale: divide in equal size bars one for each year in dataset
  const xScale = d3.scaleBand().domain(xDomain).range(xRange);

  // Y dimension: 12 months
  // domain: 12 months
  const yDomain = monthsNamesList;
  // range: min and max values for vertical dimension of canvas
  const yRange = [0, height];
  // scale: divide in equal size bars one for each onth of year
  const yScale = d3.scaleBand().domain(yDomain).range(yRange);

  /* console.log(`xScale domain: ${xDomain}`);
  console.log(`xScale range: ${xRange}`);
  console.log(`yScale domain: ${yDomain}`);
  console.log(`yScale range: ${yRange}`); */

  // CATEGORIES AND COLORS (to build legend)

  // color dimension: temperature
  // domain: temperatures in dataset
  const colorDomain = d3.extent(
    data.monthlyVariance,
    (datum) => datum.variance + data.baseTemperature
  );
  // range: color palette
  // complex palette: turbo https://observablehq.com/@d3/color-schemes
  const colorRange = [
    "#23171b",
    "#271a28",
    "#2b1c33",
    "#2f1e3f",
    "#32204a",
    "#362354",
    "#39255f",
    "#3b2768",
    "#3e2a72",
    "#402c7b",
    "#422f83",
    "#44318b",
    "#453493",
    "#46369b",
    "#4839a2",
    "#493ca8",
    "#493eaf",
    "#4a41b5",
    "#4a44bb",
    "#4b46c0",
    "#4b49c5",
    "#4b4cca",
    "#4b4ecf",
    "#4b51d3",
    "#4a54d7",
    "#4a56db",
    "#4959de",
    "#495ce2",
    "#485fe5",
    "#4761e7",
    "#4664ea",
    "#4567ec",
    "#446aee",
    "#446df0",
    "#426ff2",
    "#4172f3",
    "#4075f5",
    "#3f78f6",
    "#3e7af7",
    "#3d7df7",
    "#3c80f8",
    "#3a83f9",
    "#3985f9",
    "#3888f9",
    "#378bf9",
    "#368df9",
    "#3590f8",
    "#3393f8",
    "#3295f7",
    "#3198f7",
    "#309bf6",
    "#2f9df5",
    "#2ea0f4",
    "#2da2f3",
    "#2ca5f1",
    "#2ba7f0",
    "#2aaaef",
    "#2aaced",
    "#29afec",
    "#28b1ea",
    "#28b4e8",
    "#27b6e6",
    "#27b8e5",
    "#26bbe3",
    "#26bde1",
    "#26bfdf",
    "#25c1dc",
    "#25c3da",
    "#25c6d8",
    "#25c8d6",
    "#25cad3",
    "#25ccd1",
    "#25cecf",
    "#26d0cc",
    "#26d2ca",
    "#26d4c8",
    "#27d6c5",
    "#27d8c3",
    "#28d9c0",
    "#29dbbe",
    "#29ddbb",
    "#2adfb8",
    "#2be0b6",
    "#2ce2b3",
    "#2de3b1",
    "#2ee5ae",
    "#30e6ac",
    "#31e8a9",
    "#32e9a6",
    "#34eba4",
    "#35eca1",
    "#37ed9f",
    "#39ef9c",
    "#3af09a",
    "#3cf197",
    "#3ef295",
    "#40f392",
    "#42f490",
    "#44f58d",
    "#46f68b",
    "#48f788",
    "#4af786",
    "#4df884",
    "#4ff981",
    "#51fa7f",
    "#54fa7d",
    "#56fb7a",
    "#59fb78",
    "#5cfc76",
    "#5efc74",
    "#61fd71",
    "#64fd6f",
    "#66fd6d",
    "#69fd6b",
    "#6cfd69",
    "#6ffe67",
    "#72fe65",
    "#75fe63",
    "#78fe61",
    "#7bfe5f",
    "#7efd5d",
    "#81fd5c",
    "#84fd5a",
    "#87fd58",
    "#8afc56",
    "#8dfc55",
    "#90fb53",
    "#93fb51",
    "#96fa50",
    "#99fa4e",
    "#9cf94d",
    "#9ff84b",
    "#a2f84a",
    "#a6f748",
    "#a9f647",
    "#acf546",
    "#aff444",
    "#b2f343",
    "#b5f242",
    "#b8f141",
    "#bbf03f",
    "#beef3e",
    "#c1ed3d",
    "#c3ec3c",
    "#c6eb3b",
    "#c9e93a",
    "#cce839",
    "#cfe738",
    "#d1e537",
    "#d4e336",
    "#d7e235",
    "#d9e034",
    "#dcdf33",
    "#dedd32",
    "#e0db32",
    "#e3d931",
    "#e5d730",
    "#e7d52f",
    "#e9d42f",
    "#ecd22e",
    "#eed02d",
    "#f0ce2c",
    "#f1cb2c",
    "#f3c92b",
    "#f5c72b",
    "#f7c52a",
    "#f8c329",
    "#fac029",
    "#fbbe28",
    "#fdbc28",
    "#feb927",
    "#ffb727",
    "#ffb526",
    "#ffb226",
    "#ffb025",
    "#ffad25",
    "#ffab24",
    "#ffa824",
    "#ffa623",
    "#ffa323",
    "#ffa022",
    "#ff9e22",
    "#ff9b21",
    "#ff9921",
    "#ff9621",
    "#ff9320",
    "#ff9020",
    "#ff8e1f",
    "#ff8b1f",
    "#ff881e",
    "#ff851e",
    "#ff831d",
    "#ff801d",
    "#ff7d1d",
    "#ff7a1c",
    "#ff781c",
    "#ff751b",
    "#ff721b",
    "#ff6f1a",
    "#fd6c1a",
    "#fc6a19",
    "#fa6719",
    "#f96418",
    "#f76118",
    "#f65f18",
    "#f45c17",
    "#f25916",
    "#f05716",
    "#ee5415",
    "#ec5115",
    "#ea4f14",
    "#e84c14",
    "#e64913",
    "#e44713",
    "#e24412",
    "#df4212",
    "#dd3f11",
    "#da3d10",
    "#d83a10",
    "#d5380f",
    "#d3360f",
    "#d0330e",
    "#ce310d",
    "#cb2f0d",
    "#c92d0c",
    "#c62a0b",
    "#c3280b",
    "#c1260a",
    "#be2409",
    "#bb2309",
    "#b92108",
    "#b61f07",
    "#b41d07",
    "#b11b06",
    "#af1a05",
    "#ac1805",
    "#aa1704",
    "#a81604",
    "#a51403",
    "#a31302",
    "#a11202",
    "#9f1101",
    "#9d1000",
    "#9b0f00",
    "#9a0e00",
    "#980e00",
    "#960d00",
    "#950c00",
    "#940c00",
    "#930c00",
    "#920c00",
    "#910b00",
    "#910c00",
    "#900c00",
    "#900c00",
    "#900c00",
  ];
 
  // scale: create one group of temperatures for each color
  const colorScale = d3
    .scaleQuantize(colorDomain, colorRange) //scaleQuantize: continuous domain to discrete range (https://d3js.org/d3-scale/quantize)
    .domain(colorDomain);

  // DRAW CHART FUNCTION; it is a callback function of useEffect, so the svg is drawn on component mounting and re-renders
  useEffect(() => {
    // svg element
    const svg = d3
      .select(svgRef.current)
      .attr("id", `${title}`)
      // class set in html element
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // X-AXIS
    const xAxis = d3
      .axisBottom(xScale)
      // tick marks format
      .tickValues(
        data.monthlyVariance.map((datum) => {
          if (datum.year % 25 === 0) {
            return datum.year;
          }
        })
      );
    // parameters
    svg
      .append("g")
      .attr("class", `${Component}__axis`)
      // position
      .attr("transform", `translate(${0}, ${height})`)
      .call(xAxis);
    // label
    /* .append("text")
      .attr("y", height / 8)
      .attr("x", width / 2)
      .text(`${xAxisLabel}`)
      .attr("class", `${Component}__axisLabel`); */

    // Y-AXIS
    const yAxis = d3.axisLeft(yScale);
    // tick marks format
    // parameters
    svg
      .append("g")
      .attr("class", `${Component}__axis`)
      // position
      .attr("transform", `translate(0,0)`)
      .call(yAxis);
    // label
    /* .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -width / 12)
      .attr("x", -height / 2)
      .text(`${yAxisLabel}`)
      .attr("class", `${Component}__axisLabel`); */

    // TOOLTIP
    // tooltip element
    const tooltip = d3
      .select(tooltipRef.current)
      .attr("class", `${Component}__tooltip`)
      .style("opacity", 0); //invisibe on start

    // tooltip control functions

    // f when entering data-point make tooltip visible
    const mouseover = function () {
      tooltip.style("opacity", 0.75);
    };

    // f when leaving data-point make tooltip invisible and delete content
    const mouseleave = function () {
      tooltip.style("opacity", 0).html(``);
    };

    // f when hovering a data-point modify tooltip
    const mousemove = function (event) {
      /* console.log("mousemove - event:");
      console.log(event); */
      // extract pointer position from event to locate tooltip
      const { clientX, clientY } = event;
      // extract the data-point info from event
      const { year, monthName, variance } = event.target.__data__;

      // modify tooltip html content
      tooltip.html(
        `${year} - ${monthName}<br>Temperature: ${
          Math.round((variance + data.baseTemperature) * 100) / 100
        } &#8451;</br>Variance: ${variance} &#8451;`
      );
      // modify tooltip position
      tooltip
        .style("left", clientX + 5 + "px")
        .style("top", clientY + 5 + "px");
      // +5 offset to prevent tootltip from interfering with mouse
    };

    // DATA-POINTS
    const dataPoint = svg
      .selectAll("rect")
      // bind data to points
      .data(data.monthlyVariance)
      .enter()
      // add points as needed
      .append("rect")
      // origin
      .attr("x", (datum) => xScale(datum.year))
      .attr("y", (datum) => yScale(datum.monthName))
      // size
      .attr("width", (datum) => xScale.bandwidth(datum.year))
      .attr("height", (datum) => yScale.bandwidth(datum.month))
      //
      /* .attr("year", (datum) => datum.year)
      .attr("month", (datum) => datum.month)
      .attr("variance", (datum) => datum.variance)
      .attr("temp", (datum) => datum.variance + data.baseTemperature) */
      // styles
      .attr("class", `${Component}__datum`)
      .style("fill", (datum) =>
        colorScale(datum.variance + data.baseTemperature)
      )
      // tooltip control events
      .on("mouseover", mouseover)
      .on("mousemove", (event) => mousemove(event)) // send event so data-point data is accesible to f mousemove
      .on("mouseleave", mouseleave);

    // LEGEND
    // an axis representing temp and its corresponding color

    // geometry
    const legendWidth = 350;
    const legendHeight = 250 / colorDomain.length;

    // container
    const legend = svg
      .append("g")
      .attr("className", `${Component}__legend`)
      .attr(
        "transform",
        `translate(${margin.left + margin.right}, ${
          height + 2.15 * margin.bottom - 2 * legendHeight
        })`
      );

    // scale: numerical temperature range
    const xScaleLegend = d3
      .scaleLinear()
      .domain(colorDomain)
      .range([0, legendWidth]);

    // axis
    const xAxisLegend = d3.axisBottom().scale(xScaleLegend).tickSize(10, 0).tickFormat((d)=>(`${d}℃`));

    // draw axis
    legend
      .append("g")
      .call(xAxisLegend)
      .attr("transform", `translate(${0}, ${legendHeight})`);

    // items-categories
    legend
      .append("g")
      .selectAll("rect")
      //bind data
      .data(colorRange)
      .enter()
      .append("rect")
      // orign
      .attr("x", (d, i) => (legendWidth / colorRange.length) * i) //width of cell positioned by index
      .attr("y", legendHeight)
      // size
      .attr("width", legendWidth / colorRange.length) // all cells equal width
      .attr("height", "10")
      // styles
      .style("fill", (datum) => datum);

    // TITLES
    // main title
    svg
      .append("text")
      .text(`${title}`)
      // orign
      .attr("x", width / 2)
      .attr("y", 0 - margin.top / 2)
      // styles
      .attr("class", `${Component}__title`);

    // subtitle
    svg
      .append("text")
      .text(`${subtitle}`)
      // orign
      .attr("x", width / 2)
      .attr("y", 0 - margin.top / 4)
      // styles
      .attr("class", `${Component}__title ${Component}__title--sub`);

    // useEffect dependencies array
  }, [data]);

  // HTML
  return (
    <article className={`${Component}`}>
      <div ref={tooltipRef} className={`${Component}__tooltip`}></div>
      <svg ref={svgRef} className={`${Component}__svg`}></svg>
      <p className={`${Component}__footer`} style={{ width: widthTotal }}>
        <strong>{title}</strong>: average land surface temperature in Celsius.
      </p>
    </article>
  );
}
