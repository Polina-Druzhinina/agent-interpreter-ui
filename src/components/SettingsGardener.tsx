import "../styles/settingsgardener.css"
function SettingsGardener({ weight, height, orientation, setWeight, setHeight, setOrientation, onClose }: { weight: any; height: any; orientation:any; setWeight: any; setHeight: any; setOrientation:any; onClose: any }) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget as any; // Принудительно отключаем строгую проверку полей формы

        const newWidth = Number(form.widthM.value);
        const newHeight = Number(form.heightM.value);
        const newOrientation = String(form.orientationM.value)
        // Передаем измененные значения наверх в стейт
        setWeight(newWidth);
        setHeight(newHeight);
        setOrientation(newOrientation);
        onClose();
    };
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
                        <input className="matrix" type="number" id="widthM" value={weight} min={1} onChange={(e) => setWeight(Number(e.target.value))}/>
                    </div>

                    <div className="field">
                        <label htmlFor="heightM">Высота матрицы</label>
                        <input className="matrix" type="number" id="heightM" value={height} min={1} onChange={(e) => setHeight(Number(e.target.value))}/>
                    </div>

                    <div className="field">
                        <label htmlFor="orientationM">Ориентация</label>
                        <select id="orientationM" className="matrix" value={orientation} onChange={(e) => setOrientation(String(e.target.value))}>
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