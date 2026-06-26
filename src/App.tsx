import { Route, Routes} from "react-router-dom"
import Home from "./pages/Home"
import JuniorGardener from "./pages/JuniorGardener";
import "./styles/app.css"
import SettingsGardener from "./components/SettingsGardener";
function App() {
  return(
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/junior-gardener" element={<JuniorGardener />} />
      <Route path="/settings-gardener" element={<SettingsGardener />}/>
    </Routes>
  );
}

export default App