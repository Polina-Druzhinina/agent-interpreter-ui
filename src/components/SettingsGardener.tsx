import "../styles/settingsgardener.css"
function SettingsGardener({weight, height, setWeight, setHeight, onClose}){
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const newWidth = Number(form.widthM.value);
        const newHeight = Number(form.heightM.value);
        const newOrientation = form.orientation.value;
        setWeight(newWidth);
        setHeight(newHeight);
        if(onClose){
            onClose();
        }
    }
    return(
        <div className="settingsWindow">
            <h3 className="nametext">Настройки</h3>
            <hr className="line"/>
            <div className="settings">
                <div className="table-header">
                    <span>Название</span>
                    <span>Значение</span>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label htmlFor="widthM">Ширина матрицы</label>
                        <input className="matrix" type="number" id="widthM" defaultValue={10} min={1}/>
                    </div>

                    <div className="field">
                        <label htmlFor="heightM">Высота матрицы</label>
                        <input className="matrix" type="number" id="heightM" defaultValue={8} min={1}/>
                    </div>

                    <div className="field">
                        <label htmlFor="orientation">Ориентация</label>
                        <select id="orientation" className="matrix">
                            <option value="south">Юг</option>
                            <option value="north">Север</option>
                            <option value="west">Запад</option>
                            <option value="east">Восток</option>
                        </select>
                    </div>
                    <div className="btn-container">
                        <button className="save">Сохранить</button>             
                    </div>             
                </form>

            </div>  
        </div>
    );
}

export default SettingsGardener;