import "./index.css";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
//import * as d3 from "d3";
import * as Plot from "@observablehq/plot";
import * as htl from "htl"; //template literals that generate html elements

import dataRaw from "../../data/olympians.json";

export function PlotOlympiansWHRatio({
  width = 750,
  height = 600,
  margin = 30
}) {
  // references to current elements
  const containerRef = useRef();
  // reference to component block name to use in css with BEM
  const Component = `PlotOlympiansWHRatio`;

  // DATA
  const [data, setData] = useState(dataRaw);

  // nVariable is the object key of dataset
  // nVariableLabel is the string to display in axis and tooltip
  const xVariable = "weight",
    xVariableLabel = "weight [kg]",
    yVariable = "height",
    yVariableLabel = "height [m]",
    colorVariable = "sex";
  /* colorVariableLabel = "sex"; */

  // RENDERING
  useEffect(() => {
    // render plot
    const plot = Plot.plot({
      className: `${Component}__svg`,
      // texts: styles in css file
      title: "Olympians weigth-to-heigth relation",
      subtitle: "",
      caption: htl.html`Data for the 2016 Olympic Games in Rio de Janeiro. Sources: <a href="https://observablehq.com/@observablehq/sample-datasets#-olympians" target="new">observablehq.com</a>; <a href="https://www.flother.is/blog/olympic-games-data/" target="new">flother.is</a>.`,

      // svg canvas layout (in px)
      width: width,
      height: height,
      /* marginTop: 20,
      marginRight: 30,
      marginBottom: 30,
      marginLeft: 40, */

      grid: true,

      // COLOR
      color: { scheme: "BuRd", legend: true,  },

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

        Plot.axisX({
          anchor: `top`,
          label: `${xVariableLabel}`,
          labelAnchor: "center",
          labelOffset: 45,
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

        // rules to highlight axis
        /* Plot.ruleY([1.0]),
        Plot.ruleX([20]), */

        // internal frames(plot areas)
        //Plot.frame(),

        // data elements
        Plot.dot(data, {
          // set x-y variables to plot
          x: `${xVariable}`,
          y: `${yVariable}`,
          // set color variable to plot
          stroke: `${colorVariable}`,
          /* fill: `${colorVariable}`, */
          // tooltip on hover
          tip: true,
          // tooltip extra info
          channels: { name: "name", sport: "sport" },
        }),
        // INTERACTIVITY
        // highlight datapoint on hover
        Plot.dot(
          data,
          Plot.pointer({
            x: `${xVariable}`,
            y: `${yVariable}`,
            fill: "green",
            r: 5,
          })
        ),
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

PlotOlympiansWHRatio.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  margin: PropTypes.number,
};
