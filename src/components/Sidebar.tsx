import { useState, useContext } from "react";
import { AppContext } from "../App";
import UseFileUpload from "../hooks/UseFileUpload";
import SettingsGardener from "./SettingsGardener";
import logo from "../assets/icon.png";
import launchWhite from "../assets/launch-white.png";
import launchGray from "../assets/launch-gray.png";
import settingWhite from "../assets/setting-white.png";
import settingGray from "../assets/setting-gray.png";
import loading from "../assets/loading.png";

function Sidebar({
	launchDisabled,
	settingsDisabled,
	onLaunchClick,
}: {
	launchDisabled?: boolean;
	settingsDisabled?: boolean;
	onLaunchClick?: () => void;
}) {
	const { fileInputRef, handleButtonClick, handleFileChange } = UseFileUpload();
	const [isSettings, setIsSettingsOpen] = useState(false);
	const { width, setWidth, height, setHeight, orientation, setOrientation } =
		useContext(AppContext);

	return (
		<aside className="sidebar">
			<div className="logo">
				<img src={logo} alt="logo" />
			</div>

			<input
				type="file"
				className="uploadFile"
				ref={fileInputRef}
				onChange={handleFileChange}
				accept=".graphml"
			/>

			<button className="menu-item active" onClick={handleButtonClick}>
				<img src={loading} alt="loading" className="icon" />
				<span>Загрузить файл</span>
			</button>

			<button
				className={`menu-item ${launchDisabled ? "disabled" : "active"}`}
				onClick={launchDisabled ? undefined : onLaunchClick}
			>
				<img
					src={launchDisabled ? launchGray : launchWhite}
					alt="launch"
					className="icon"
				/>
				<span>Запустить</span>
			</button>

			<button
				className={`menu-item ${settingsDisabled ? "disabled" : "active"}`}
				onClick={settingsDisabled ? undefined : () => setIsSettingsOpen(true)}
			>
				<img
					src={settingsDisabled ? settingGray : settingWhite}
					alt="settings"
					className="icon"
				/>
				<span>Настройки</span>
			</button>

			{!settingsDisabled && isSettings && (
				<div className="modalOverlay" onClick={() => setIsSettingsOpen(false)}>
					<div className="modalContent" onClick={(e) => e.stopPropagation()}>
						<SettingsGardener
							width={width}
							height={height}
							orientation={orientation}
							setOrientation={setOrientation}
							setWidth={setWidth}
							setHeight={setHeight}
							onClose={() => setIsSettingsOpen(false)}
						/>
					</div>
				</div>
			)}
		</aside>
	);
}

export default Sidebar;
