import logo from "../assets/icon.png"
import launch from "../assets/launch-gray.png"
import settings from "../assets/setting-gray.png"
import loading from "../assets/loading.png"
import "../styles/home.css"
import "../styles/base.css"
import useFileUpload from "../hooks/UseFileUpload"
function Home() {
    const { fileInputRef, handleButtonClick, handleFileChange, fileName } = useFileUpload();
    return (
    <div className="home">
        <aside className="sidebar">
            <div className="logo">
                <img src={logo} alt="logo" />
            </div>
            <input type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".graphml"
            />
            <button className="menu-item active" onClick={handleButtonClick}>
                <img src={loading} alt="loading" className="icon" />
                <span>Загрузить файл</span>
            </button>
            <button className="menu-item disabled">
                <img src={launch} alt="launch" className="icon" />
                <span>Запустить</span>
            </button>
            <button className="menu-item disabled">
                <img src={settings} alt="settings" className="icon" />
                <span>Настройки</span>
            </button>
        </aside>
        <main className="content">
            <div className="message">
                Загрузите GraphML файл для начала работы
            </div>
        </main>
    </div>
  )
}

export default Home
