import React from "react";
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

function UseFileUpload(){
    const fileInputRef = useRef<HTMLInputElement>(null); //ссылка на input
    const navigate = useNavigate()
    const [fileName, setFileName] = React.useState("")
    const handleButtonClick = () => { //функция, вызывающая клик по скрытому input
        fileInputRef.current?.click();
    };
    const  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if(files && files.length>0){
            const selectedFile = files[0];
            if(!selectedFile.name.endsWith(".graphml")){
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

            fetch("http://localhost:8000/load-file", {
            method: "POST",
            body: formData
            })
            .then(res => res.json())
            .then(data => {
            console.log(data)
            navigate("/junior-gardener")
            })
        }
    }
    return { fileInputRef, handleButtonClick, handleFileChange, fileName };
}

export default UseFileUpload