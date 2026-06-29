import React from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

function UseFileUpload() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const [fileName, setFileName] = React.useState("");

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const selectedFile = files[0];
            
            // 1. Проверка на расширение файла (теперь неважно, капсом оно или нет)
            if (!selectedFile.name.toLowerCase().endsWith(".graphml")) {
                window.ipcRenderer.send(
                    "show-error-dialog",
                    "Ошибка чтения",
                    `Файл "${selectedFile.name}" не является файлом GraphML.`
                );
                return;
            }
            
            setFileName(selectedFile.name);
            const formData = new FormData();
            formData.append("file", selectedFile);

            // 2. Отправка файла на бэкенд
            fetch("http://localhost:8000/load-file", {
                method: "POST",
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                
                // 3. Проверяем, что ответил Python-сервер
                if (data.status === "error") {
                    window.ipcRenderer.send(
                        "show-error-dialog",
                        "Ошибка валидации графа",
                        data.message || "Этот файл не содержит логику для задачи Садовника."
                    );
                    return; // Останавливаем выполнение, никуда не переходим
                }
                
                // Если бэкенд подтвердил Садовника — переключаем экран
                navigate("/junior-gardener");
            })
            .catch(err => {
                console.error("Ошибка при загрузке файла:", err);
                window.ipcRenderer.send(
                    "show-error-dialog",
                    "Ошибка сети",
                    "Не удалось связаться с бэкенд-сервером."
                );
            });
        }
    };

    return { fileInputRef, handleButtonClick, handleFileChange, fileName };
}

export default UseFileUpload;