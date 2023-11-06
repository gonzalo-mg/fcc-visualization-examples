import "./index.css";

import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

import dataRaw from "../../data/doping-cycling.json";

export function D3DopingCycling() {
  // references to current elements
  const svgRef = useRef();
  const tooltipRef = useRef();

  // component block name to use in css
  const Component = `D3DopingCycling`;

  // GEOMETRY
  // svg canvas size

  const margin = { top: 100, right: 50, bottom: 75, left: 100 };
  const width = 750 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // article (container) size: to sync article and footer width with svg
  const widthTotal = width + margin.left + margin.right;

  // TEXTS

  const title = "Doping in cycling";
  const subtitle = "35 Fastest times up Alpe d'Huez";

  const xAxisLabel = "Year";
  const yAxisLabel = "Race time [min]";

  // DATA

  const [data, setData] = useState(dataRaw);

  // DOMAINS AND RANGES

  // X dimension
  // x-domain: from earliest to latest date (min and max values for x variable)
  const xDomain = d3.extent(data, (datum) => datum.Year);
  // x-range: min and max values for horizontal dimension of canvas
  const xRange = [0, width];
  console.log(`xScale domain: ${xDomain}`);
  console.log(`xScale range: ${xRange}`);

  // Y dimension
  // y-domain: from min to max value of race time (max value of y variable)
  const yDomain = d3.extent(data, (datum) => datum.Seconds);
  // y-range: min and max values for vertical dimension of canvas
  const yRange = [0, height];
  console.log(`yScale domain: ${yDomain}`);
  console.log(`yScale range: ${yRange}`);

  // CATEGORIES AND COLORS
  const categoryDoping = {
    class: `${Component}__datum--doping`,
    legendText: `Doping allegations`,
  };
  const categoryNoDoping = {
    class: `${Component}__datum--noDoping`,
    legendText: `No doping allegations`,
  };
  const categoriesDomain = [categoryDoping, categoryNoDoping];

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

    // SCALES
    // x dimension is race year
    const xScale = d3.scaleLinear().domain(xDomain).range(xRange);

    // y dimension is racing duration
    const yScale = d3.scaleLinear().domain(yDomain).range(yRange);

    // X-AXIS
    const xAxis = d3
      .axisBottom(xScale)
      // tick marks format
      .tickFormat((d) => d); //remove thousand , pointer
    // parameters
    svg
      .append("g")
      .attr("class", `${Component}__axis`)
      // position
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      // label
      .append("text")
      .attr("y", height / 8)
      .attr("x", width / 2)
      .text(`${xAxisLabel}`)
      .attr("class", `${Component}__axisLabel`);

    // Y-AXIS

    // f to format y-axis tick labels from seconds to mm:ss
    function formatSeconds(seconds) {
      // calculate minutes and seconds
      const minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;

      // format output
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

      return `${formattedMinutes}:${formattedSeconds}`;
    }

    const yAxis = d3
      .axisLeft(yScale)
      // tick marks format
      .tickFormat((d) => formatSeconds(d));
    // parameters
    svg
      .append("g")
      .attr("class", `${Component}__axis`)
      // position
      .attr("transform", `translate(0,0)`)
      .call(yAxis)
      // label
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -width / 12)
      .attr("x", -height / 2)
      .text(`${yAxisLabel}`)
      .attr("class", `${Component}__axisLabel`);

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
      const { Time, Year, Name, Doping } = event.target.__data__;

      // modify tooltip html content
      tooltip.html(`${Name} (${Year})<br>Time: ${Time}<br>${Doping}`);

      // modify tooltip position
      tooltip
        .style("left", clientX + 5 + "px")
        .style("top", clientY + 5 + "px");
         // +5 offset to prevent tootltip from interfering with mouse
    };

    // DATA-POINTS
    svg
      .selectAll("circle")
      // bind data to points
      .data(data)
      .enter()
      // add points as needed
      .append("circle")
      // origin
      .attr("cx", (datum) => xScale(datum.Year))
      .attr("cy", (datum) => yScale(datum.Seconds))
      // size
      .attr("r", "7.5px")
      // styles
      .attr("class", (datum, index) => {
        if (datum.Doping !== "") {
          return `${Component}__datum ${categoryDoping.class}`;
        } else {
          return `${Component}__datum ${categoryNoDoping.class}`;
        }
      })
      // tooltip control events
      .on("mouseover", mouseover)
      .on("mousemove", (event) => mousemove(event)) // send event so data-point data is accesible to f mousemove
      .on("mouseleave", mouseleave);

    // LEGEND
    // legend container
    const legendContainer = svg
      .append("g")
      .attr("class", `${Component}__legend`)
      // position
      .attr("transform", `translate(${width - 2 * margin.right},0)`);
    // legend categories
    const legendItems = legendContainer
      .selectAll(`${Component}__legendItem`)
      .data(categoriesDomain)
      .enter()
      .append("g")
      .attr("class", `${Component}__legendItem`);

    // icons
    legendItems
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 5)
      // styles
      .attr("class", (datum, index) => {
        return datum.class;
      });

    // labels
    legendItems
      .append("text")
      .attr("x", 10)
      .attr("y", 0)
      .attr("dy", "0.35em")
      .text((datum) => datum.legendText);

    // distribute categories inside legend
    const itemWidth = 0;
    const itemHeight = 20;
    legendItems.attr(
      "transform",
      (d, i) => `translate(${i * itemWidth}, ${i * itemHeight})`
    );

    // TITLES
    // main title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 0 - margin.top / 2)
      .attr("text-anchor", "middle")
      .text(`${title}`)
      .attr("class", `${Component}__title`);

    // subtitle
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 0 - margin.top / 4)
      .attr("text-anchor", "middle")
      .text(`${subtitle}`)
      .attr("class", `${Component}__subtitle`);
  }, [data]);

  // HTML
  return (
    <article className={`${Component}`} >
      <div ref={tooltipRef} className={`${Component}__tooltip`}></div>
      <svg ref={svgRef} className={`${Component}__svg`}></svg>
      <p className={`${Component}__footer`} style={{ width: widthTotal }}>
        <strong>{title}</strong>: comparison of climbing times to the Alpe d&apos;Huez for riders with and without doping allegations.
      </p>
    </article>
  );
}
