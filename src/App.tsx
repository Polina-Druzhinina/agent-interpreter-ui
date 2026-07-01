import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import JuniorGardener from "./pages/JuniorGardener";
import "./styles/app.css";
import GardenerEditMode from "./pages/GardenerEditMode";
import { createContext, useState, useEffect, Dispatch, SetStateAction } from "react";
import LaunchGardener from "./pages/LaunchGardener";

export const AppContext = createContext({
	width: 10,
	setWidth: (() => {}) as Dispatch<SetStateAction<number>>,
	height: 8,
	setHeight: (() => {}) as Dispatch<SetStateAction<number>>,
	orientation: "south",
	setOrientation: (() => {}) as Dispatch<SetStateAction<string>>,
	matrix: [] as string[][],
	setMatrix: (() => {}) as Dispatch<SetStateAction<string[][]>>,
});
function App() {
	const [width, setWidth] = useState(10);
	const [height, setHeight] = useState(8);
	const [orientation, setOrientation] = useState("south");
	const [matrix, setMatrix] = useState(() =>
		Array.from({ length: 8 }, () => Array(10).fill("emptiness")),
	);

	useEffect(() => {
		setMatrix((prev) =>
			Array.from({ length: height }, (_, h) =>
				Array.from({ length: width }, (_, w) => prev[h]?.[w] ?? "emptiness"),
			),
		);
	}, [width, height]);

	return (
		<AppContext.Provider
			value={{
				width,
				setWidth,
				height,
				setHeight,
				orientation,
				setOrientation,
				matrix,
				setMatrix,
			}}
		>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/junior-gardener" element={<JuniorGardener />} />
				<Route path="/preview" element={<GardenerEditMode />} />
				<Route path="/launch" element={<LaunchGardener />} />
			</Routes>
		</AppContext.Provider>
	);
}

export default App;
