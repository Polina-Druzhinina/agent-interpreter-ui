import "../styles/settingsgardener.css";
function SettingsGardener({
	width,
	height,
	orientation,
	setWidth,
	setHeight,
	setOrientation,
	onClose,
}: {
	width: number;
	height: number;
	orientation: string;
	setWidth: (v: number) => void;
	setHeight: (v: number) => void;
	setOrientation: (v: string) => void;
	onClose: () => void;
}) {
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget as HTMLFormElement;
		const formData = new FormData(form);
		const newWidth = Number(formData.get("widthM"));
		const newHeight = Number(formData.get("heightM"));
		const newOrientation = String(formData.get("orientationM"));
		setWidth(newWidth);
		setHeight(newHeight);
		setOrientation(newOrientation);
		onClose();
	};
	return (
		<div className="settingsWindow">
			<h3 className="nametext">Настройки</h3>
			<hr className="line" />
			<div className="settings">
				<div className="table-header">
					<span>Название</span>
					<span>Значение</span>
				</div>
				<form onSubmit={handleSubmit}>
					<div className="field">
						<label htmlFor="widthM">Ширина матрицы</label>
						<input
							className="matrix"
							type="number"
							id="widthM"
							name="widthM"
							value={width}
							min={1}
							onChange={(e) => setWidth(Number(e.target.value))}
						/>
					</div>

					<div className="field">
						<label htmlFor="heightM">Высота матрицы</label>
						<input
							className="matrix"
							type="number"
							id="heightM"
							name="heightM"
							value={height}
							min={1}
							onChange={(e) => setHeight(Number(e.target.value))}
						/>
					</div>

					<div className="field">
						<label htmlFor="orientationM">Ориентация</label>
						<select
							id="orientationM"
							name="orientationM"
							className="matrix"
							value={orientation}
							onChange={(e) => setOrientation(String(e.target.value))}
						>
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
