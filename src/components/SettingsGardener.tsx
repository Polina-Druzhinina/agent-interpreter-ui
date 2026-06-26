import "../styles/settingsgardener.css"
function SettingsGardener(){
    return(
        <div className="settingsWindow">
            <h3 className="nametext">Настройки</h3>
            <hr className="line"/>
            <div className="settings">
                <div className="field">
                    <label htmlFor="widthM">Ширина матрицы</label>
                    <input type="number" id="widthM"/>
                </div>

                <div className="field">
                    <label htmlFor="heightM">Высота матрицы</label>
                    <input type="number" id="heightM"/>
                </div>

                <div className="field">
                    <label htmlFor="heightM">Ориентация</label>
                    <select id="orientation">
                        <option value="south">Юг</option>
                        <option value="north">Север</option>
                        <option value="west">Запад</option>
                        <option value="east">Восток</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default SettingsGardener;