import "../styles/home.css";
import "../styles/reviewGardener.css";
import preview from "../assets/preview.png";
import { useState } from "react";
import MatrixBoard from "../components/MatrixBoard";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../App";
function GardenerEditMode() {
	const { width, height, orientation, matrix, setMatrix } = useContext(AppContext);
	const navigate = useNavigate();
	const [selectedTool, setSelectedTool] = useState("emptiness");
	const handleCellClick = (h: number, w: number) => {
		const newMatrix = matrix.map((row: string[]) => [...row]);
		newMatrix[h][w] = selectedTool;
		setMatrix(newMatrix);
	};
	return (
		<div className="home">
			<Sidebar onLaunchClick={() => {}} />

			<main className="content-state">
				<div className="car-state">Машина состояний: Junior Gardener</div>

				<div className="fsm-meta">
					<div className="meta-header">
						<div className="description">
							<span>Название:</span>
							<span>Состояний:</span>
							<span>Переходов:</span>
						</div>

						<div className="button-reduct">
							<button onClick={() => navigate("/junior-gardener")}>
								<img src={preview} alt="preview" className="iconPreview" />
								<span>Режим просмотра</span>
							</button>
						</div>
					</div>
					<div>
						<MatrixBoard
							width={width}
							height={height}
							orientation={orientation}
							matrix={matrix}
							onCellClick={handleCellClick}
						/>
					</div>
				</div>

				<div className="tool">
					<div className="toolSelection">
						<label className="nameTools" htmlFor="tools">
							Инструмент
						</label>
						<select
							id="tools"
							className="boxTools"
							value={selectedTool}
							onChange={(e) => setSelectedTool(e.target.value)}
						>
							<option value="emptiness">Пустота(0)</option>
							<option value="wall">Стена(-1)</option>
							<option value="rose">Роза(1)</option>
							<option value="mint">Мята(2)</option>
							<option value="cornflower">Василек(3)</option>
						</select>
					</div>

					<div
						className="btn-clearningField"
						onClick={() => {
							setMatrix(
								Array.from({ length: height }, () =>
									Array(width).fill("emptiness"),
								),
							);
						}}
					>
						<button className="clear">Очистить поле</button>
					</div>
				</div>
			</main>
		</div>
	);
}

export default GardenerEditMode;
