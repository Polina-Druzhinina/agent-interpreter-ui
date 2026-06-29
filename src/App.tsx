import { Route, Routes} from "react-router-dom"
import Home from "./pages/Home"
import JuniorGardener from "./pages/JuniorGardener";
import "./styles/app.css"
import ReviewGardener from "./pages/ReviewGardener";
import { createContext, useState } from "react";
export const AppContext = createContext(null)
function App() {
  const [weight, setWeight] = useState(10)
  const [height, setHeight] = useState(8)
  const [orientation, setOrientation] = useState('south')
  return(
    <AppContext.Provider value={{weight, setWeight, height, setHeight, orientation, setOrientation}}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/junior-gardener" element={<JuniorGardener />} />
        <Route path="/preview" element={<ReviewGardener />}/>
      </Routes>
    </AppContext.Provider>
  );
}

export default App