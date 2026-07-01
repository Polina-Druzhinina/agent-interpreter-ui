import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import JuniorGardener from "./pages/JuniorGardener";
import "./styles/app.css";
import GardenerEditMode from "./pages/GardenerEditMode";
import LaunchGardener from "./pages/LaunchGardener";
import useGardener from "./hooks/useGardener";

function App() {
	const gardenerProps = useGardener();
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/junior-gardener" element={<JuniorGardener {...gardenerProps}/>} />
			<Route path="/preview" element={<GardenerEditMode {...gardenerProps}/>} />
			<Route path="/launch" element={<LaunchGardener {...gardenerProps}/>} />
		</Routes>
	);
}

export default App;
