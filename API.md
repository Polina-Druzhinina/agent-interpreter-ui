# API Contract  
## State Machine Interpreter Backend

---

# 1. Назначение документа

Данный документ описывает формат взаимодействия между:

- **Backend** — FastAPI сервис интерпретатора машин состояний
- **Frontend** — Electron + React интерфейс

Документ определяет:

- список доступных API‑endpoint
- формат входных данных (Request)
- формат выходных данных (Response)
- возможные статусы выполнения
- правила обработки ошибок
- принципы расширяемости

Этот документ является **единственным источником истины** для взаимодействия frontend и backend.  
Обе стороны обязаны строго следовать указанному формату.

---

# 2. Архитектура взаимодействия

Система построена по клиент‑серверной модели:

```
Frontend (Electron + React)
        ↓ HTTP (JSON)
FastAPI Backend
        ↓
Interpreter Core (StateMachine)
        ↓
JSON Response
```

Frontend отправляет HTTP‑запросы.  
Backend выполняет интерпретацию и возвращает JSON‑ответ.

Все данные передаются **исключительно в формате JSON**.

---

# 3. Общие правила

1. Все ответы backend должны быть валидным JSON.
2. Все endpoint возвращают поле `status`.
3. Возможные значения поля `status`:
   - `"success"`
   - `"error"`
   - `"timeout"`
4. В случае ошибки обязательно возвращается поле `error`.
5. Все имена полей используют **camelCase**.
6. Backend не возвращает Python‑объекты напрямую — только сериализованные данные.
7. Любое изменение формата API должно отражаться в этом документе.

---

# 4. Endpoint: POST /load

## Назначение

Загрузка и парсинг машины состояний из GraphML.

---

## Request

```json
{
  "xml": "string"
}
```

---

## Response (success)

```json
{
  "status": "success",
  "platform": "junior-gardener",
  "name": "MachineName",
  "statesCount": 10,
  "transitionsCount": 15,
  "requiredParameters": ["width", "height", "orientation"]
}
```

---

## Response (error)

```json
{
  "status": "error",
  "error": {
    "type": "ParsingError",
    "message": "Invalid GraphML format"
  }
}
```

---

# 5. Endpoint: POST /run

## Назначение

Запуск машины состояний с заданными параметрами среды выполнения.

---

## Request

```json
{
  "parameters": {
    "width": 10,
    "height": 8,
    "orientation": "EAST"
  }
}
```

---

## Response (success)

```json
{
  "status": "success",
  "timeout": false,
  "calledSignals": ["impulseA"],
  "allSignals": ["entry", "impulseA", "break"],
  "agentState": {
    "x": 3,
    "y": 4,
    "orientation": "EAST",
    "field": [[0,0,0],[0,-1,0]]
  }
}
```

---

## Response (timeout)

```json
{
  "status": "timeout",
  "timeout": true,
  "calledSignals": ["impulseA"]
}
```

---

## Response (error)

```json
{
  "status": "error",
  "timeout": false,
  "error": {
    "type": "GardenerCrash",
    "message": "Hit a wall"
  },
  "calledSignals": ["impulseA"]
}
```

---

# 6. Структура поля agentState

Поле `agentState` зависит от типа агента.

---

## Для junior-gardener

```json
{
  "x": "number",
  "y": "number",
  "orientation": "string",
  "field": "number[][]"
}
```

---

## Для junior-reader

```json
{
  "currentChar": "string",
  "position": "number"
}
```

---

# 7. Стандартная структура ответа

Каждый ответ backend имеет одну из следующих форм:

---

## ✅ Успешное выполнение

```json
{
  "status": "success",
  "timeout": false,
  "calledSignals": [],
  "agentState": {}
}
```

---

## ⏱ Таймаут

```json
{
  "status": "timeout",
  "timeout": true,
  "calledSignals": []
}
```

---

## ❌ Ошибка

```json
{
  "status": "error",
  "timeout": false,
  "error": {
    "type": "ErrorType",
    "message": "Description"
  }
}
```

---

# 8. Расширяемость

1. Добавление новых агентов не должно изменять базовую структуру ответа.
2. Новые агенты могут расширять только поле `agentState`.
3. Поля `status`, `timeout`, `calledSignals` являются обязательными.
4. Frontend должен ориентироваться только на документированный формат.

---

# 9. Версионирование

Текущая версия API: **v1**

При изменении структуры response необходимо:

- увеличить версию API
- обновить данный документ
- согласовать изменения с frontend

---

# 10. Цель использования FastAPI

FastAPI автоматически генерирует документацию по адресу:

```
http://localhost:8000/docs
```

Данная документация является техническим подтверждением соответствия backend настоящему API‑контракту.

Frontend ориентируется именно на эту структуру.

---