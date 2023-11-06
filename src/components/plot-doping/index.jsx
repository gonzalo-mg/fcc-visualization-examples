import "./index.css";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import * as Plot from "@observablehq/plot";
import * as htl from "htl"; //template literals that generate html elements

import dataRaw from "../../data/doping-cycling.json";

// to each biker add a porperty to check if he has doping allegations
dataRaw.forEach((biker) => {
  if (biker.Doping === "") {
    biker.Status = "no doping allegations";
  } else {
    biker.Status = "suspect of doping";
    biker.Allegations = biker.Doping;
  }
});

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

export function PlotDopingCycling({ width = 750, height = 600, margin = 30 }) {
  // references to current elements
  const containerRef = useRef();
  // reference to component block name to use in css with BEM
  const Component = `PlotDopingCycling`;

  // DATA

  const [data, setData] = useState(dataRaw);

  // nVariable is the object key of dataset
  // nVariableLabel is the string to display in axis and tooltip
  const xVariable = "Year",
    xVariableLabel = "Year",
    yVariable = "Seconds",
    yVariableLabel = "Time [min]",
    colorVariable = "Status";
  /* colorVariableLabel = "sex"; */

  // RENDERING
  useEffect(() => {
    // render plot
    const plot = Plot.plot({
      className: `${Component}__svg`,
      // texts: styles in css file
      title: "Doping in cycling",
      subtitle: "35 Fastest times up Alpe d'Huez",
      caption: htl.html`Comparison of climbing times to Alpe d'Huez for bikers with and without doping allegations.`,

      // svg canvas layout (in px)
      width: width,
      height: height,
      /* marginTop: 20,
      marginRight: 30,
      marginBottom: 30,
      marginLeft: 40, */

      grid: true,

      // COLOR
      color: { scheme: "BuRd", legend: true },

      // ELEMENTS: marks is an array of layers of geometric shapes that are added to the svg
      marks: [
        // AXIS
        Plot.axisX({
          anchor: `bottom`,
          label: `${xVariableLabel}`,
          labelAnchor: "center",
          labelOffset: 40,
          fontSize: "large",
          tickFormat: (d) => d.toString(),
        }),

        Plot.axisY({
          anchor: `left`,
          label: `${yVariableLabel}`,
          labelAnchor: "center",
          labelOffset: 75,
          fontSize: "large",
          tickFormat: (d) => formatSeconds(d),
        }),

        Plot.axisY({
          anchor: `right`,
          label: `${yVariableLabel}`,
          labelAnchor: "center",
          labelOffset: 75,
          fontSize: "large",
          tickFormat: (d) => formatSeconds(d),
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
          // geometry of datapoint
          r: 7,
          strokeWidth: 3,
          // tooltip (declared as an option of data element)
          /* tip: true,
          // tooltip extra info
          channels: { 
              Name: "Name",
              Year: "Year",
              Time: "Time",
              Status: "Status",
              Allegations: "Allegations",},*/
        }),
        // INTERACTIVITY
        // tooltip (declared explicity as independent mark, allows more customization)
        Plot.tip(
          data,
          Plot.pointer({
            // positioning and data to be displayed
            x: "Year",
            y: "Seconds",
            // info to be displayed: use "title" or "channels"
            // title: provides a single text, wraping of lines for long text
            // channels: provides a line for each data; for short texts
            title: (d) => {
              return `${d.Name} (${d.Nationality})
            \nYear: ${d.Year}
            \nTime: ${d.Time}
            \nStatus: ${d.Status}
            \nAllegations: ${d.Allegations ? d.Allegations: "n/a"}`;
            },
            // extra data to be displayed in tooltip
            /*  channels: {
              Name: "Name",
              Year: "Year",
              Time: "Time",
              Status: "Status",
              Allegations: "Allegations",
            }, */
          })
        ),
        // highlight datapoint on hover
        Plot.dot(
          data,
          Plot.pointer({
            x: `${xVariable}`,
            y: `${yVariable}`,
            fill: "black",
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

PlotDopingCycling.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  margin: PropTypes.number,
};
