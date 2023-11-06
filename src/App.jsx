import "./App.css";
import { D3USAgdp } from "./components/d3-GDP-usa/index";
import { D3DopingCycling } from "./components/d3-dopping/index";
import { D3LandTemp } from "./components/d3-land-temp/index";
import { PlotUSAgdp } from "./components/plot-GDPUSA/index";
import { PlotDopingCycling } from "./components/plot-doping/index";
import { PlotLandTemp } from "./components/plot-land-temp/index";
import { PlotEnglishLetterFrequency } from "./components/plot-EnglishLetterFrequency/index";
import { PlotOlympiansWHRatio } from "./components/plot-OlympiansWHRatio/index";
import { PlotUSAChoroEducation } from "./components/plot-usa-choro-education";
import { PlotMosaicVideoGames } from "./components/plot-videogames";
import { PlotMosaicMovies } from "./components/plot-movies";
import { PlotMosaicKickstarter } from "./components/plot-kickstarter";

function App() {
  return (
      <main>
        <D3USAgdp></D3USAgdp>
        <D3DopingCycling></D3DopingCycling>
        <D3LandTemp></D3LandTemp>
        <PlotUSAgdp></PlotUSAgdp>
        <PlotDopingCycling></PlotDopingCycling>
        <PlotLandTemp></PlotLandTemp>
        <PlotEnglishLetterFrequency></PlotEnglishLetterFrequency>
        <PlotOlympiansWHRatio></PlotOlympiansWHRatio>
        <PlotUSAChoroEducation></PlotUSAChoroEducation>
        <PlotUSAChoroEducation nBins="2"></PlotUSAChoroEducation>
        <PlotMosaicVideoGames></PlotMosaicVideoGames>
        <PlotMosaicMovies></PlotMosaicMovies>
        <PlotMosaicKickstarter></PlotMosaicKickstarter>
      </main>
  );
}

export default App;
