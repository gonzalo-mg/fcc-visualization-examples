import "./index.css";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
//import * as d3 from "d3";
import * as Plot from "@observablehq/plot";
import * as htl from "htl"; //template literals that generate html elements
import * as topojson from "topojson";

import data from "../../data/usa-education-data.json";

// create a FIPS:education-data map
// FIPS is a 5 digit ID for each county; in fcc-education-data.json it is a type number (ommitting intial 0); in topology json FIPS is a string including initial 0; here education data is conformed to topology format, so fill function can match county to educationl data
const educationMap = new Map(
  data.map((countie) => [
    String(countie.fips).length < 5 ? `0${countie.fips}` : `${countie.fips}`,
    countie.bachelorsOrHigher,
  ])
);

// topolgy from: https://github.com/topojson/us-atlas; USA map
import us from "../../data/usa-counties-albers-10m.json";

// counties: countie object
const counties = topojson.feature(us, us.objects.counties);

// create a FIPS:state map; each state is identified by the first two digits of the FIPS
const states = topojson.feature(us, us.objects.states);
const statemap = new Map(states.features.map((d) => [d.id, d]));

export function PlotUSAChoroEducation({
  width = 1000,
  height = 600,
  margin = 30,
  nBins = 10,
}) {
  // references to current elements
  const containerRef = useRef();
  // reference to component block name to use in css with BEM
  const Component = `PlotUSAChoroEducation`;

  // DATA
  const [education, setEdu] = useState(educationMap);

  // RENDERING
  useEffect(() => {
    // render plot
    const plot = Plot.plot({
      className: `${Component}__svg`,
      // texts
      title: "United States Educational Attainment",
      subtitle:
        "Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)",
      caption: htl.html`Alaska at 0.35 times its true relative area.`,

      // svg canvas layout
      width: width,
      height: height,

      // COLOR
      color: {
        type: "quantize",
        n: nBins, // number of groups/bins
        domain: [0, 100],
        scheme: "Inferno",
        label: "% of adults age +25 with a bachelor's degree or higher",
        legend: true,
        tip: true,
      },

      projection: "identity",

      marks: [
        Plot.geo(
          counties,
          Plot.centroid({
            fill: (d) => education.get(d.id),
            tip: true,
            channels: {
              County: (d) => d.properties.name,
              State: (d) => statemap.get(d.id.slice(0, 2)).properties.name, //each state is identified by the first two digits of the FIPS
              Education: (d) => education.get(d.id),
              FIPS: (d) => d.id,
            },
          })
        ),
        Plot.geo(states, { stroke: "grey" }),
      ],
    });
    // add chart to container
    containerRef.current.append(plot);
    // useEffect cleanup function: remove previous chart
    return () => plot.remove();
    // useEffect dependency array
  }, [education, Component, width, height, margin]);

  return (
    <article
      ref={containerRef}
      className={Component}
      style={{ width: width }}
    />
  );
}

PlotUSAChoroEducation.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  margin: PropTypes.number,
  nBins: PropTypes.number,
};
