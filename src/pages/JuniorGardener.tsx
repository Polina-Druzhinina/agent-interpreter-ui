import "../styles/home.css"
import "../styles/gardener.css"
import logo from "../assets/icon.png"
import launch from "../assets/launch-white.png"
import settings from "../assets/setting-white.png"
import loading from "../assets/loading.png"
import reduct from "../assets/reduct.png"
import React, {useRef} from "react"
import useFileUpload from "../hooks/UseFileUpload"
function JuniorGardener(){
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

            <button className="menu-item active">
                <img src={launch} alt="launch" className="icon" />
                <span>Запустить</span>
            </button>

            <button className="menu-item active">
                <img src={settings} alt="settings" className="icon" />
                <span>Настройки</span>
            </button>
        </aside>

        <main className="content-state">

            <div className="car-state">
                Машина состояний: Junior Gardener
            </div>

            <div className="fsm-meta">

                <div className="meta-header">
                    <div className="description">
                        <span>Название:</span>
                        <span>Состояний:</span>
                        <span>Переходов:</span>
                    </div>

                    <div className="button-reduct">
                        <button>
                            <img src={reduct} alt="reduct" className="icon-reduct"/>
                            <span>Режим редактирования</span>
                        </button>
                    </div>

                </div>
            </div>
        </main>
    </div>
  )
}

export default JuniorGardener