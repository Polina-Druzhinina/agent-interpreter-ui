import React from "react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function useFileUpload() {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();
	const [fileName, setFileName] = React.useState("");
	const [error, setError] = useState<{ title: string; message: string } | null>(null);
	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};
	const clearError = () => setError(null);
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			const selectedFile = files[0];

			// 1. Проверка на расширение файла
			if (!selectedFile.name.toLowerCase().endsWith(".graphml")) {
				setError({
					title: "Ошибка чтения",
					message: `Файл "${selectedFile.name}" не является файлом GraphML.`,
				});
				return;
			}

			setFileName(selectedFile.name);
			const formData = new FormData();
			formData.append("file", selectedFile);

			// 2. Отправка файла на бэкенд
			fetch("http://localhost:8000/load-file", {
				method: "POST",
				body: formData,
			})
				.then((res) => res.json())
				.then((data) => {
					console.log(data);

					if (data.status === "error") {
						setError({
							title: "Ошибка валидации графа",
							message: data.message,
						});
						return;
					}
					if (data.platform) {
						navigate(`/${data.platform}`);
					}
				})
				.catch((err) => {
					console.error("Ошибка при загрузке файла:", err);
					setError({
						title: "Ошибка сети",
						message: "Не удалось связаться с бэкенд-сервером.",
					});
				});
		}
	};

	return { fileInputRef, handleButtonClick, handleFileChange, fileName, error, clearError };
}

export default useFileUpload;
