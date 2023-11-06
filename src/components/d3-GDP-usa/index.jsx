import "./index.css";

import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

import dataRaw from "../../data/usa-gdp.json";

export function D3USAgdp() {
  // references to current elements
  const svgRef = useRef();
  const tooltipRef = useRef();

  // component block name to use in css
  const Component = `D3USAgdp`;

  // GEOMETRY
  // svg canvas size

  const margin = { top: 100, right: 50, bottom: 75, left: 100 };
  const width = 750 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // article (continer) size: to sync article and footer width with svg
  const widthTotal = width + margin.left + margin.right;

  // TEXTS

  const title = "USA GDP";
  const subtitle = "1947 - 2015";

  const xAxisLabel = "Yearly quarters";
  const yAxisLabel = "Adjusted billions of $";

  // DATA

  const refinedData = dataRaw.data.map((e) => {
    return {
      dateMS: Date.parse(e[0]),
      date: new Date(e[0]),
      dateOriginalString: e[0],
      gdp: e[1],
    };
  });

  const [data, setData] = useState(refinedData);

  // DOMAINS AND RANGES

  // X dimension
  // x-domain: from earliest to latest date (min and max values for x variable)
  const xDomain = d3.extent(data, (datum) => datum.date);
  // x-range: min and max values for horizontal dimension of canvas
  const xRange = [0, width];
  console.log(`xScale domain: ${xDomain}`);
  console.log(`xScale range: ${xRange}`);

  // Y dimension
  // y-domain: for the min it is 0 because if we use the min value of the dataset, it would scale to a gdo of $0 in Q1-1947)
  const yDomain = [0, d3.max(data, (datum) => datum.gdp)];
  // y-range: min and max values for vertical dimension of canvas
  const yRange = [height, 0];
  console.log(`yScale domain: ${yDomain}`);
  console.log(`yScale range: ${yRange}`);

  // CATEGORIES AND COLORS
  // not needed for this chart

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
    // x dimension is time (quarters)
    const xScale = d3.scaleTime().domain(xDomain).range(xRange);

    // y dimension is money
    const yScale = d3.scaleLinear().domain(yDomain).range(yRange);

    // X-AXIS
    const xAxis = d3.axisBottom(xScale);
    // tick marks format: default
    // parameters
    svg
      .append("g")
      .attr("class", `${Component}__axis ${Component}__axisX`)
      // position
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      // label
      .append("text")
      .attr("y", height / 8)
      .attr("x", width / 2)
      .text(`${xAxisLabel}`)
      .attr("class", `${Component}__axisLabel ${Component}__axisXLabel`);

    // Y-AXIS
    const yAxis = d3.axisLeft(yScale);
    // tick marks format: default
    // parameters
    svg
      .append("g")
      .attr("class", `${Component}__axis ${Component}__axisY`)
      // position
      .attr("transform", `translate(0,0)`)
      .call(yAxis)
      // label
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -width / 10)
      .attr("x", -height / 2)
      .text(`${yAxisLabel}`)
      .attr("class", `${Component}__axisLabel ${Component}__axisYLabel`);

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
      const { gdp, dateOriginalString } = event.target.__data__;

      // modify tooltip html content
      const year = dateOriginalString.slice(0, 4);
      const month = dateOriginalString.slice(5, 7);
      let quarter;
      switch (month) {
        case "01":
          quarter = "Q1";
          break;
        case "04":
          quarter = "Q2";
          break;
        case "07":
          quarter = "Q3";
          break;
        case "10":
          quarter = "Q4";
          break;
      }
      tooltip.html(`${quarter}-${year}<br>$${gdp} billion`);

      // modify tooltip position
      tooltip
        .style("left", clientX + 5 + "px")
        .style("top", clientY + 5 + "px");
        // +5 offset prevent tootltip from interfering with mouse
    };

    // DATA-POINTS
    svg
      .selectAll("rect")
      // bind data to points
      .data(data)
      .enter()
      // add points as needed
      .append("rect")
      // origin
      .attr("x", (datum) => xScale(datum.date))
      .attr("y", (datum) => yScale(datum.gdp))
      // size
      .attr("width", 3)
      .attr("height", (datum) => {
        // draw from top to bottom
        return height - yScale(datum.gdp);
      })
      // styles
      .attr("class", `${Component}__datum`)
      // extras to check on devtools
      .attr("data-date", (datum) => {
        return datum.dateOriginalString;
      })
      .attr("data-gdp", (datum) => {
        return datum.gdp;
      })
      // control of tooltip
      .on("mouseover", mouseover)
      .on("mousemove", (event) => mousemove(event)) // send event to acces data-point data
      .on("mouseleave", mouseleave);

    // LEGEND
    // no legend in this chart

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
    <article className={`${Component}`}>
      <div ref={tooltipRef} className={`${Component}__tooltip`}></div>
      <svg ref={svgRef} className={`${Component}__svg`}></svg>
      <p className={`${Component}__footer`} style={{ width: widthTotal }}>
        <strong>{title}</strong>: seasonally adjusted annual rate; source:&nbsp;
        <i>
          A Guide to the National Income and Product Accounts of the United
          States
        </i>
        &nbsp;(NIPA), available at:
        {
          <a href="http://www.bea.gov/national/pdf/nipaguid.pdf" target="new">
            &nbsp;http://www.bea.gov/national/pdf/nipaguid.pdf
          </a>
        }
        .
      </p>
    </article>
  );
}
