import "../styles/home.css";
import "../styles/base.css";
import Sidebar from "../components/Sidebar";
function Home() {
	return (
		<div className="home">
			<Sidebar readonly />
			<main className="content">
				<div className="message">Загрузите GraphML файл для начала работы</div>
			</main>
		</div>
	);
}

export default Home;
