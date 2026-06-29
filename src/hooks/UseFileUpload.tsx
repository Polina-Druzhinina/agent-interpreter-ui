import React from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

function UseFileUpload() {
    const fileInputRef = useRef<HTMLInputElement>(null); // ссылка на input
    const navigate = useNavigate();
    const [fileName, setFileName] = React.useState("");

    const handleButtonClick = () => { // функция, вызывающая клик по скрытому input
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const selectedFile = files[0];
            
            // 1. Грубая проверка на расширение файла
            if (!selectedFile.name.endsWith(".graphml")) {
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
                
              //  # 3. Проверка ответа от Python-сервера
                if (data.status === "error") {
                    window.ipcRenderer.send(
                        "show-error-dialog",
                        "Ошибка валидации графа",
                        data.message || "Этот файл не содержит логику для задачи Садовника."
                    );
                    return; // Прерываем выполнение, на страницу садовника не переходим
                }
                
                // Если всё отлично — переключаем экран
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