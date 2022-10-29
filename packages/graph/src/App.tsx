import "./App.css";
import { Afterglow } from "./examples/afterglow/Afterglow";
import { RogueTrader } from "./examples/rogue-trader/RogueTrader";
import { Wolsung } from "./examples/wolsung/Wolsung";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "./Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/afterglow" element={<Afterglow />} />

        <Route path="/wolsung" element={<Wolsung />} />

        <Route path="/rogue-trader" element={<RogueTrader />} />

        <Route path="/*" element={<Navigate to="/afterglow" />} />
      </Routes>
    </>
  );
}

export function AppWithProviders() {
  return (
      <BrowserRouter>
        <App />
      </BrowserRouter>
  );
}
