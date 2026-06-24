import logo from "../assets/icon.png"
import launch from "../assets/launch-gray.png"
import settings from "../assets/setting-gray.png"
import loading from "../assets/loading.png"
import "../styles/home.css"
import React, {useRef} from "react"
function Home() {
    const fileInputRef = useRef<HTMLInputElement>(null); //ссылка на input
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
                    `Файд "${selectedFile.name}" не является файлом GraphML.`
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
            .then(data => console.log(data))
            .catch(err => console.error("Fetch error:", err));
        }
    }
    return (
    <div className="home">
        <aside className="sidebar">
            <div className="logo">
                <img src={logo} alt="logo" />
            </div>
            <input type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".graphml"
            />
            <button className="menu-item active" onClick={handleButtonClick}>
                <img src={loading} alt="loading" className="icon" />
                <span>Загрузить файл</span>
            </button>
            <button className="menu-item disabled">
                <img src={launch} alt="launch" className="icon" />
                <span>Запустить</span>
            </button>
            <button className="menu-item disabled">
                <img src={settings} alt="settings" className="icon" />
                <span>Настройки</span>
            </button>
        </aside>
        <main className="content">
            <div className="message">
                Загрузите GraphML файл для начала работы
            </div>
        </main>
    </div>
  )
}

export default Home
