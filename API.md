# 📖 State Machine Interpreter API Documentation

**Версия:** 1.0.0
**Базовый URL:** http://localhost:8000
**Формат данных:** JSON / multipart/form-data
**CORS:** Разрешён для всех источников (*)

---

## 📋 Общая структура ответов
Все эндпоинты возвращают JSON-объект с полем "status":

- "success" — Запрос обработан успешно
- "crash" — Симуляция прервана из-за столкновения/ошибки агента (возвращает состояние до падения)
- "error" — Ошибка парсинга, неподдерживаемая платформа или внутренняя ошибка сервера

---

## 🟢 1. GET /
**Назначение:** Проверка доступности сервера.

**Ответ:**
{ "message": "Backend is running" }

---

## 📤 2. POST /load-file
**Назначение:** Загрузка .graphml файла, парсинг и возврат метаданных машины состояний без запуска.

**Запрос:** multipart/form-data
- file: (File) .graphml файл с описанием машины состояний

**Ответ (Успех):**
{
  "status": "success",
  "platform": "junior-gardener",
  "name": "MyMachine",
  "statesCount": 10,
  "transitionsCount": 11,
  "requiredParameters": ["cMover1", "cFlower1"]
}

**Ответ (Ошибка):**
{
  "status": "error",
  "message": "No state machines found"
}

---

## 🚀 3. POST /run
**Назначение:** Запуск симуляции машины состояний. Передача XML-строки и параметров среды выполнения.

**Запрос:** application/json
{
  "xml": "<graphml>...содержимое файла...</graphml>",
  "parameters": {
    "width": 10,
    "height": 8,
    "orientation": "SOUTH"
  }
}

**Поведение в зависимости от platform (определяется автоматически из XML):**

1. junior-gardener:
   - Ожидаемые parameters: width (int), height (int), orientation (NORTH/SOUTH/WEST/EAST)

2. junior-reader:
   - Ожидаемые parameters: message (string), speed (float)

**Ответ (Успех):**
{
  "status": "success",
  "result": {
    "timeout": false,
    "signals": ["entry", "impulseA", "break"],
    "calledSignals": ["impulseA"],
    "field": [[0, 1, -1], [0, 0, 2]],
    "position": { "x": 2, "y": 1 },
    "orientation": 1
  }
}

**Ответ (Crash - Gardener):**
{
  "status": "crash",
  "message": "Crash: out of bounds!",
  "result": {
    "timeout": false,
    "signals": [],
    "calledSignals": [],
    "field": [[0, 1, -1]],
    "position": { "x": 2, "y": 1 },
    "orientation": 1
  }
}
*(Для junior-reader поля field, position, orientation возвращают null)*

**Ответ (Ошибка):**
{
  "status": "error",
  "message": "Unsupported platform: unknown-platform"
}

---

## ⚡ 4. POST /run-file
**Назначение:** Быстрый запуск симуляции через загрузку файла.
Ограничение: На данный момент работает только для junior-gardener (поле инициализируется как 10x8 по умолчанию).

**Запрос:** multipart/form-data
- file: (File) .graphml файл (платформа должна содержать слово gardener)

**Ответ:** Аналогичен POST /run (структура result с полем field, position, orientation).

**Ответ (Ошибка платформы):**
{
  "status": "error",
  "message": "run-file supports only Gardener for now"
}

---

## 📊 Справочник данных

### Значения ячеек поля (field)
- 0: Пустая клетка
- -1: Стена
- 1: Роза
- 2: Мята
- 3: Василёк

### Ориентация (orientation)
- 0: Юг (SOUTH)
- 1: Север (NORTH)
- 2: Запад (WEST)
- 3: Восток (EAST)

---

## 🛡️ Обработка ошибок
1. Парсинг XML: Если структура GraphML невалидна или отсутствует ключ gFormat, вернётся status: "error".
2. Краш агента: GardenerCrashException перехватывается на бэкенде. Сервер не падает, возвращает status: "crash" и состояние поля в момент аварии.
3. Таймаут: Если машина состояний выполняется дольше лимита, в ответе будет "timeout": true.