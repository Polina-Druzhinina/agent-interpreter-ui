import { Route, Routes} from "react-router-dom"
import Home from "./pages/Home"
import JuniorGardener from "./pages/JuniorGardener";
import "./styles/app.css"
function App() {
  return(
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/junior-gardener" element={<JuniorGardener />} />
    </Routes>
  );
}

export default App