import { NavLink } from "react-router-dom";

export function Navbar() {
  return (
    <div>
      <NavLink to="/afterglow">Afterglow</NavLink>

      <NavLink to="/wolsung">Wolsung</NavLink>

      <NavLink to="/rogue-trader">RogueTrader</NavLink>

      <NavLink to="/shadowrun">Shadowrun</NavLink>
    </div>
  );
}
