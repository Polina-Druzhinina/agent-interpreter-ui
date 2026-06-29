import { useState, useRef } from 'react';

export default function useFileUpload() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<any>(null); // Тут будут лежать данные от Python

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);
    setError(null);
    setSimulationResult(null);

    // 1. Упаковываем файл для FastAPI
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 2. Отправляем запрос напрямую на запущенный Электроном Python-сервер
      const response = await fetch('http://localhost:8000/run-file', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.status === 'success') {
        console.log('Данные симуляции успешно получены:', data.result);
        setSimulationResult(data.result); // Сохраняем результат симуляции
      } else if (data.status === 'crash') {
        console.warn('Робот врезался:', data.message);
        setSimulationResult(data.result); // Даже при аварии сохраняем поле
        setError(data.message);
      } else {
        setError(data.message || 'Ошибка сервера.');
      }
    } catch (err) {
      console.error('Ошибка сети с бэкендом:', err);
      setError('Не удалось связаться с Python-сервером. Проверьте, запущен ли он.');
    } finally {
      setLoading(false);
    }
  };

  return {
    fileInputRef,
    handleButtonClick,
    handleFileChange,
    fileName,
    loading,
    error,
    simulationResult, // Отдаем результат в компоненты окон
  };
}