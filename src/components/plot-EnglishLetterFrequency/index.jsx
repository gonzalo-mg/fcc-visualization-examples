import "./index.css";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
//import * as d3 from "d3";
import * as Plot from "@observablehq/plot";
import * as htl from "htl"; //template literals that generate html elements

import rawData from "../../data/english-alphabet-freq.json";

export function PlotEnglishLetterFrequency({
  width = 750,
  height = 600,
  margin = 30,
}) {
  // references to current elements
  const containerRef = useRef();
  // reference to component block name to use in css with BEM
  const Component = `PlotEnglishLetterFrequency`;

  // DATA
  const [data, setData] = useState(rawData);

  // nVariable is the object key of dataset
  // nVariableLabel is the string to display in axis and tooltip
  const xVariable = "letter",
    xVariableLabel = "letter",
    yVariable = "frequency",
    yVariableLabel = "relative frequency";
  /* colorVariable = "",
    colorVariableLabel = ""; */

  // RENDERING
  useEffect(() => {
    // render plot
    const plot = Plot.plot({
      className: `${Component}__svg`,
      // texts
      title: `Letter frequency in English`,
      subtitle: ``,
      caption: htl.html`How often each letter of the alphabet appears on average in written English language. Source: <a href="https://en.wikipedia.org/wiki/Letter_frequency">Wikipedia</a>.`,

      // svg canvas layout
      width: width,
      height: height,
      /* marginTop: 20,
      marginRight: 30,
      marginBottom: 30,
      marginLeft: 40, */

      grid: true,

      // COLOR
      /* color: { scheme: "BuRd", legend: true}, */

      // ELEMENTS: marks is an array of layers of geometric shapes that are added to the svg
      marks: [
        // AXIS
        Plot.axisX({
          anchor: `bottom`,
          label: `${xVariableLabel}`,
          labelAnchor: "center",
          labelOffset: 40,
          fontSize: "large",
        }),

        Plot.axisY({
          anchor: `left`,
          label: `${yVariableLabel}`,
          labelAnchor: "center",
          labelOffset: 75,
          fontSize: "large",
        }),

        Plot.axisY({
          anchor: `right`,
          label: `${yVariableLabel}`,
          labelAnchor: "center",
          labelOffset: 75,
          fontSize: "large",
        }),

        // internal frames(plot areas)
        //Plot.frame(),

        // rules to highlight axis and set min-max points
        Plot.ruleY([0]),
        /* Plot.ruleX([0]), */ // disabled as data is categorical

        // data elements: Plot.TYPE(dataSet, {OPTIONS})
        Plot.barY(data, {
          // set x-y variables to plot
          x: `${xVariable}`,
          y: `${yVariable}`,
          // set color of bar
          fill: "orange",
          // bar offsets
          dx: 0,
          dy: 0,
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
          Plot.pointerX({ x: "weight", y: "height", fill: "blue", r: 5 })
        ) */
      ],
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

PlotEnglishLetterFrequency.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  margin: PropTypes.number,
};
