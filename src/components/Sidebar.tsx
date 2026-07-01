import { useState } from "react";
import SettingsGardener from "./SettingsGardener";
import logo from "../assets/icon.png";
import launchWhite from "../assets/launch-white.png";
import launchGray from "../assets/launch-gray.png";
import settingWhite from "../assets/setting-white.png";
import settingGray from "../assets/setting-gray.png";
import loading from "../assets/loading.png";
import useFileUpload from "../hooks/useFileUpload";

interface SidebarProps {
	readonly?: boolean;
	onLaunchClick?: () => void;
	width?: number;
	height?: number;
	orientation?: string;
	setWidth?: (v: number) => void;
	setHeight?: (v: number) => void;
	setOrientation?: (v: string) => void;
}

function Sidebar({
	readonly,
	onLaunchClick,
	width,
	height,
	orientation,
	setWidth,
	setHeight,
	setOrientation,
}: SidebarProps) {
	const { fileInputRef, handleButtonClick, handleFileChange, error, clearError } =
		useFileUpload();
	const [isSettings, setIsSettingsOpen] = useState(false);

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
				className={`menu-item ${readonly ? "disabled" : "active"}`}
				onClick={readonly ? undefined : onLaunchClick}
			>
				<img
					src={readonly ? launchGray : launchWhite}
					alt="launch"
					className="icon"
				/>
				<span>Запустить</span>
			</button>

			<button
				className={`menu-item ${readonly ? "disabled" : "active"}`}
				onClick={readonly ? undefined : () => setIsSettingsOpen(true)}
			>
				<img
					src={readonly ? settingGray : settingWhite}
					alt="settings"
					className="icon"
				/>
				<span>Настройки</span>
			</button>

			{!readonly && isSettings && (
				<div className="modalOverlay" onClick={() => setIsSettingsOpen(false)}>
					<div className="modalContent" onClick={(e) => e.stopPropagation()}>
						<SettingsGardener
							width={width ?? 10}
							height={height ?? 8}
							orientation={orientation ?? "south"}
							setWidth={setWidth ?? (() => {})}
							setHeight={setHeight ?? (() => {})}
							setOrientation={setOrientation ?? (() => {})}
							onClose={() => setIsSettingsOpen(false)}
						/>
					</div>
				</div>
			)}

			{error && (
				<div className="modalOverlay" onClick={clearError}>
					<div className="settingsWindow" onClick={(e) => e.stopPropagation()}>
						<h3 className="nametext">{error.title}</h3>
						<hr className="line" />
						<div className="settings">
							<form onSubmit={(e) => e.preventDefault()}>
								<div
									className="table-header"
									style={{ justifyContent: "center", textAlign: "center" }}
								>
									<p>{error.message}</p>
								</div>
								<button className="save" onClick={clearError}>
									Понятно
								</button>
							</form>
						</div>
					</div>
				</div>
			)}
		</aside>
	);
}

export default Sidebar;
