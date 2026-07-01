import "../styles/home.css";
import "../styles/gardener.css";
import reduct from "../assets/reduct.png";
import MatrixBoard from "../components/MatrixBoard";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../App";
function LaunchGardener() {
	const { width, height, orientation, matrix } = useContext(AppContext);
	const navigate = useNavigate();
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

						<div className="buttonReduct">
							<button onClick={() => navigate("/preview")}>
								<img src={reduct} alt="reduct" className="icon-reduct" />
								<span>Режим редактирования</span>
							</button>

							<button className="btnDemo" onClick={() => navigate("")}>
								<span>Посмотреть DemoРежим</span>
							</button>
						</div>
					</div>
					<div>
						<MatrixBoard
							width={width}
							height={height}
							orientation={orientation}
							matrix={matrix}
						/>
					</div>
				</div>
			</main>
		</div>
	);
}

export default LaunchGardener;
