import "./index.css";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import * as Plot from "@observablehq/plot";
//import * as htl from "htl"; //template literals that generate html elements

import dataRaw from "../../data/video-game-sales.json";

export function PlotMosaicVideoGames({
  width = 1000,
  height = 600,
  margin = 30,
}) {
  // references to current elements
  const containerRef = useRef();
  // reference to component block name to use in css with BEM
  const Component = `PlotMosaicVideoGames`;

  // DATA
  const [data, setData] = useState(dataRaw);

  const [leaves, setLeaves] = useState(buildLeaves());

  //console.log(`leaves: ${typeof leaves}`);
  //console.log(leaves);

  // https://d3js.org/d3-hierarchy/hierarchy
  function buildLeaves() {
    const hierarchy = d3.hierarchy(data).sum((d) => parseFloat(d.value));
    d3.treemap().size([width, height]).padding(2)(hierarchy);
    return hierarchy.leaves();
  }

  // RENDERING
  useEffect(() => {
    // render plot
    const plot = Plot.plot({
      className: `${Component}__svg`,
      // texts
      title: "Videogames Sales",
      subtitle: "Top 100 Most Sold Video Games Grouped by Platform",
      //caption: htl.html`.`,

      // svg canvas layout
      width: width,
      height: height,

      // axis
      x: { axis: null },
      y: { axis: null },

      color: { legend: true, type:"categorical" },//by platform

      marks: [
        Plot.rect(leaves, {
          x1: "x0",
          x2: "x1",
          y1: "y0",
          y2: "y1",
          fill: (d) => d.parent.data.name,
          title: (d) =>
            ` ${d.parent.data.name} \n ${d.data.name} \n Sales: ${d.value}`,
          tip: true,
        }),

        Plot.text(leaves, {
          x: "x0",
          y: "y1",
          dx: 5,
          dy: 15,
          text: (d) => {
            // name must fit to available space of tile
            
            const widthAvailable_px = parseInt(d.x1 - d.x0);
            const widthAvailable_em = parseInt(widthAvailable_px / 8); //fontSize approx 1em; 1em approx 1 char

            const checkSpace = (string) => {
              return string.length <= widthAvailable_em;
            };

            const shrinkString = (string) => {
              // if string fits tile width display it
              if (checkSpace(string)) {
                return string;
              } else {
                // if string is too big, shorten it
                return string.slice(0, widthAvailable_em - 1).concat("..."); // -1 to add "..."
              }
            };
            return `${shrinkString(d.data.name)} \n ${shrinkString(d.data.value)}`; 
          },
          // PROBLEM: it apllies same lineWidth to all datum; if lineWidth set with function call generates error; tried to call a variable and it does not get error, but value is not updated for each datum; solved it by te text function and shrinkString
          //lineWidth: (d) => {
          //return parseInt((d.x1 - d.x0)/8)
          //},
          //clip: true,
          //textOverflow: "ellipsis",
          fontSize: 8,
          textAnchor: "start",
          fill: "white",
        }),
      ],
    });
    // add chart to container
    containerRef.current.append(plot);
    // useEffect cleanup function: remove previous chart
    return () => plot.remove();
    // useEffect dependency array
  }, [data, leaves, Component, width, height, margin]);

  return (
    <article
      ref={containerRef}
      className={Component}
      style={{ width: width }}
    />
  );
}

PlotMosaicVideoGames.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  margin: PropTypes.number,
};
