import "../styles/home.css"
import "../styles/gardener.css"
import logo from "../assets/icon.png"
import launch from "../assets/launch-white.png"
import settings from "../assets/setting-white.png"
import loading from "../assets/loading.png"
import reduct from "../assets/reduct.png"
import React, {useRef, useState} from "react"
import useFileUpload from "../hooks/UseFileUpload"
import SettingsGardener from "../components/SettingsGardener"
import MatrixBoard from "../components/MatrixBoard"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AppContext } from "../App"
function JuniorGardener(){
    const { fileInputRef, handleButtonClick, handleFileChange, fileName } = useFileUpload();
    const [isSettings, setIsSettingsOpen] = useState(false);
    const { weight, setWeight, height, setHeight} = useContext(AppContext)
    const navigate = useNavigate()
    const [robotPos, setRobotPos] = useState({x:0,y:0});
    const [robotOrientation, setRobotOrientation] = useState<string>('south')
    return (
    <div className="home">

        <aside className="sidebar">

            <div className="logo">
                <img src={logo} alt="logo" />
            </div>

            <input type="file"
                className="uploadFile"
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

            <button className="menu-item active" onClick={() => setIsSettingsOpen(true)} >
                <img src={settings} alt="settings" className="icon openSettings"/>
                <span>Настройки</span>
            </button>
            {isSettings && (
                <div className="modalOverlay" onClick={() => setIsSettingsOpen(false)}>
                    <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                        <SettingsGardener
                        weight={weight}
                        height={height} 
                        setWeight={setWeight}
                        setHeight={setHeight}

                        onClose={() => setIsSettingsOpen(false)}/>
                    </div>
                </div>
            )}
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
                        <button onClick={() => navigate("/preview")}>
                            <img src={reduct} alt="reduct" className="icon-reduct"/>
                            <span>Режим редактирования</span>
                        </button>
                    </div>
                </div>
                <div>
                    <MatrixBoard weight={weight} height={height}/>
                </div>
            </div>
        </main>
    </div>
  )
}

export default JuniorGardener