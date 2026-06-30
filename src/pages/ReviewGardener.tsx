import "../styles/home.css"
import "../styles/reviewGardener.css"
import logo from "../assets/icon.png"
import launch from "../assets/launch-white.png"
import settings from "../assets/setting-white.png"
import loading from "../assets/loading.png"
import preview from "../assets/preview.png"
import { useState } from "react"
import useFileUpload from "../hooks/UseFileUpload"
import SettingsGardener from "../components/SettingsGardener"
import MatrixBoard from "../components/MatrixBoard"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AppContext } from "../App"
function ReviewGardener(){
    const { fileInputRef, handleButtonClick, handleFileChange} = useFileUpload();
    const [isSettings, setIsSettingsOpen] = useState(false);
    const { weight, setWeight, height, setHeight, orientation, setOrientation, matrix, setMatrix} = useContext(AppContext)
    const navigate = useNavigate();
    const [selectedTool, setSelectedTool] = useState('emptiness');
    const handleCellClick = (h: number, w: number) => {
        const newMatrix = matrix.map(row => [...row]);
        newMatrix[h][w] = selectedTool;
        setMatrix(newMatrix);
    }
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
                        orientation={orientation}
                        setOrientation={setOrientation} 
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
                        <button onClick={()  => navigate("/junior-gardener")}>
                            <img src={preview} alt="preview" className="iconPreview"/>
                            <span>Режим просмотра</span>
                        </button>
                    </div>
                </div>
                <div>
                    <MatrixBoard weight={weight} height={height} orientation={orientation} matrix={matrix} onCellClick={handleCellClick}/>
                </div>
            </div>

            <div className="tool">
                <div className="toolSelection">
                    <label className="nameTools" htmlFor="tools">Инструмент</label>
                    <select id="tools" className="boxTools" value={selectedTool} onChange={(e) => setSelectedTool(e.target.value)}>
                        <option value="emptiness">Пустота(0)</option>
                        <option value="wall">Стена(-1)</option>
                        <option value="rose">Роза(1)</option>
                        <option value="mint">Мята(2)</option>
                        <option value="cornflower">Василек(3)</option>
                    </select>
                </div>

                <div className="btn-clearningField" onClick={() => {setMatrix(Array.from({ length: height }, () => Array(weight).fill('emptiness')));}}>
                    <button className="clear">Очистить поле</button>
                </div>

            </div>

        </main>
    </div>
  )
}

export default ReviewGardener