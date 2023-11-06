import "./index.css";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
//import * as d3 from "d3";
import * as Plot from "@observablehq/plot";
import * as htl from "htl"; //template literals that generate html elements

import dataRaw from "../../data/global-land-temperature.json";

export function PlotLandTemp({ width = 750, height = 600, margin = 30 }) {
  // references to current elements
  const containerRef = useRef();
  // reference to component block name to use in css with BEM
  const Component = `PlotLandTemp`;

  // DATA
  const [data, setData] = useState(dataRaw.monthlyVariance);

  // RENDERING
  useEffect(() => {
    // render plot
    const plot = Plot.plot({
      className: `${Component}__svg`,
      // texts
      title: "Monthly Global Land-Surface Temperature",
      subtitle: "1753 - 2015",
      caption: htl.html`Average land surface temperature variance respect base temperature of 8.66 ℃.`,

      // svg canvas layout
      width: width,
      height: height,

      grid: false,

      // COLOR
      color: { legend: true, label: `Temperature variance [℃]` },

      // ELEMENTS: marks is an array of layers of geometric shapes that are added to the svg
      marks: [
        // AXIS
        Plot.axisX({
          anchor: `bottom`,
          label: `Year`,
          labelAnchor: "center",
          labelOffset: 45,
          fontSize: "large",
          tickFormat: (d) => {
            return String(d);
          },
          interval: 50, // tick every years
          //ticks: [],
        }),

        Plot.axisY({
          anchor: `left`,
          label: null,
          labelAnchor: "center",
          labelOffset: 55,
          fontSize: "small",
          //tickFormat: Plot.formatMonth("en", "long"),// takes 0=January; but data takes 1=January;
          tickFormat: (d) => {
            switch (d) {
              case 1:
                return "January";
              case 2:
                return "February";
              case 3:
                return "March";
              case 4:
                return "April";
              case 5:
                return "May";
              case 6:
                return "June";
              case 7:
                return "July";
              case 8:
                return "August";
              case 9:
                return "September";
              case 10:
                return "October";
              case 11:
                return "November";
              case 12:
                return "December";
            }
          },
        }),

        // data elements
        Plot.cell(
          data,
          Plot.group(
            { fill: "max" },
            {
              // set x-y variables to plot: as named in data file
              x: `year`,
              y: `month`,
              // color group
              fill: `variance`,
              // tooltip on hover
              tip: true,
              // tooltip extra info
              /* channels: {}, */
            }
          )
        ),

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

PlotLandTemp.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  margin: PropTypes.number,
};
