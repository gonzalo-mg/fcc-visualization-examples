import "./index.css";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
//import * as d3 from "d3";
import * as Plot from "@observablehq/plot";
import * as htl from "htl"; //template literals that generate html elements

import dataRaw from "../../data/usa-gdp.json";
// create array of objects to feed Plot
const dataCooked = dataRaw.data.map((datum) => {
  return { quarter: new Date(datum[0]), gdp: datum[1] };
});

export function PlotUSAgdp({ width = 750, height = 600, margin = 30 }) {
  // references to current elements
  const containerRef = useRef();
  // reference to component block name to use in css with BEM
  const Component = `PlotUSAgdp`;

  // DATA
  const [data, setData] = useState(dataCooked);

  // nVariable is the object key of dataset
  // nVariableLabel is the string to display in axis and tooltip
  const xVariable = "quarter",
    xVariableLabel = "Yearly quarters",
    yVariable = "gdp",
    yVariableLabel = "$ thousansd of billions";
  /* colorVariable = "";
    colorVariableLabel = ""; */

  // RENDERING
  useEffect(() => {
    // render plot
    const plot = Plot.plot({
      className: `${Component}__svg`,
      // texts
      title: "USA GDP",
      subtitle: "1947-2015",
      caption: htl.html`Seasonally adjusted annual rate; source: "A Guide to the National Income and Product Accounts of the United States" (NIPA), available at: <a href="http://www.bea.gov/national/pdf/nipaguid.pdf" target="new">bea.gov</a>.`,

      // svg canvas layout
      width: width,
      height: height,
      /* marginTop: 20,
      marginRight: 30,
      marginBottom: 30,
      marginLeft: 40, */

      grid: true,

      // COLOR
      /* color: { scheme: "BuRd", legend: true,  }, */

      // ELEMENTS: marks is an array of layers of geometric shapes that are added to the svg
      marks: [
        // AXIS
        Plot.axisX({
          anchor: `bottom`,
          label: `${xVariableLabel}`,
          labelAnchor: "center",
          labelOffset: 45,
          fontSize: "large",
        }),

        Plot.axisY({
          anchor: `left`,
          label: `${yVariableLabel}`,
          labelAnchor: "center",
          labelOffset: 55,
          fontSize: "large",
          tickFormat: (d) => {
            return d / 1000;
          }
        }),

        // rules to highlight axis
        Plot.ruleY([0]),
        Plot.ruleX([new Date("01-01-1947")]),

        // internal frames(plot areas)
        //Plot.frame(),

        // data elements
        Plot.lineY(data, {
          // set x-y variables to plot
          x: `${xVariable}`,
          y: `${yVariable}`,
          // set color variable to plot
          stroke: `blue`,
          // tooltip on hover
          tip: true,
          // tooltip extra info
          /* channels: {}, */
        }),
        // INTERACTIVITY
        // highlight datapoint on hover
        /* Plot.dot(
          data,
          Plot.pointer({
            x: `${xVariable}`,
            y: `${yVariable}`,
            fill: "green",
            r: 5,
          })
        ), */
        // link datapoint with axis on hover
        /* Plot.crosshair(
          data,
          Plot.pointerX({ x: `${xVariable}`, y: `${yVariable}`, fill: "red", r: 5 })
        ) */
      ],

      // LEGEND
      /* color: {
        legend: true,
        marginLeft: (width - margin) / 2,
      }, */
    });
    // add chart to container
    containerRef.current.append(plot);
    // useEffect cleanup function: remove previous chart
    return () => plot.remove();
    // useEffect dependency array
  }, [data, Component, width, height, margin]);

  return (
    <article
      ref={containerRef}
      className={Component}
      style={{ width: width }}
    />
  );
}

PlotUSAgdp.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  margin: PropTypes.number,
};
