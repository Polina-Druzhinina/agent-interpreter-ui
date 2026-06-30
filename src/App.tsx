import { Route, Routes} from "react-router-dom"
import Home from "./pages/Home"
import JuniorGardener from "./pages/JuniorGardener";
import "./styles/app.css"
import ReviewGardener from "./pages/ReviewGardener";
import { createContext, useState, useEffect } from "react";
import LaunchGardener from "./pages/LaunchGardener";
export const AppContext = createContext(null)
function App() {
  const [weight, setWeight] = useState(10)
  const [height, setHeight] = useState(8)
  const [orientation, setOrientation] = useState('south')
  const [matrix, setMatrix] = useState(() => Array.from({ length: 8 }, () => Array(10).fill('emptiness')));

  useEffect(() => {
    setMatrix(prev => Array.from({ length: height }, (_, h) =>
      Array.from({ length: weight }, (_, w) => prev[h]?.[w] ?? "emptiness")
    ));
  }, [weight, height]);

  return(
    <AppContext.Provider value={{weight, setWeight, height, setHeight, orientation, setOrientation, matrix, setMatrix}}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/junior-gardener" element={<JuniorGardener />} />
        <Route path="/preview" element={<ReviewGardener />}/>
        <Route path="/launch" element={<LaunchGardener />}/>
      </Routes>
    </AppContext.Provider>
  );
}

export default App