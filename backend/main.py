import sys
import os

# Фикс для PyInstaller: добавляем временную папку распаковки в пути поиска
if getattr(sys, 'frozen', False):
    # Если запущен как .exe
    application_path = sys._MEIPASS
    sys.path.insert(0, application_path)


from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from core.simulator import (
    CGMLParser,
    StateMachine,
    run_state_machine,
    Gardener,
    GardenerCrashException  # Добавили обработку крашей
)
from core.parser_service import extract_state_machine, MachineParseException

app = FastAPI(title="State Machine Interpreter API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================
# Root
# =============================
@app.get("/")
def root():
    return {"message": "Backend is running"}

# =============================
# LOAD FILE (анализ без запуска)
# =============================
@app.post("/load-file")
async def load_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        xml_string = content.decode("utf-8")

        # ИСПОЛЬЗУЕМ НАШ СЕРВИС: парсим и сразу получаем объект автомата
        state_machine = extract_state_machine(xml_string)
        
        platform = state_machine.platform.lower() # Получаем тип исполнителя из файла

        # НА ДАННОМ ЭТАПЕ: поддерживаем только Садовника
        if "gardener" not in platform:
            return { 
                "status": "error",
                "message": f"Исполнитель '{state_machine.platform}' пока не поддерживается приложением. Выберите граф для Садовника."
            }

        # Если это Садовник — отдаем успех и всю инфу о графе
        return {
            "status": "success",
            "platform": state_machine.platform,
            "name": state_machine.name,
            "statesCount": len(state_machine.states),
            "transitionsCount": len(state_machine.transitions),
            "requiredParameters": list(state_machine.components.keys()) 
        } 

    except MachineParseException as e:
        # Ловим нашу кастомную ошибку, если в XML нет автоматов
        return {"status": "error", "message": str(e)}
    except Exception as e: 
        return {"status": "error", "message": f"Ошибка чтения XML: {str(e)}"}

# =============================
# RUN (через JSON)
# =============================
class RunRequest(BaseModel):
    xml: str
    parameters: dict

@app.post("/run")
def run_machine(request: RunRequest):
    try:
        parser = CGMLParser()
        elements = parser.parse_cgml(request.xml)

        if not elements.state_machines:
            return {"status": "error", "message": "No state machines found"}

        first_machine_id = list(elements.state_machines.keys())[0]
        cgml_sm = elements.state_machines[first_machine_id]
        platform = cgml_sm.platform.lower()

        # === 1. Junior Gardener ===
        if platform == "junior-gardener":
            width = request.parameters.get("width", 10)
            height = request.parameters.get("height", 8)
            orientation = request.parameters.get("orientation", "SOUTH")

            gardener = Gardener(width, height)

            if orientation.upper() == "NORTH": gardener.orientation = gardener.NORTH
            elif orientation.upper() == "SOUTH": gardener.orientation = gardener.SOUTH
            elif orientation.upper() == "WEST": gardener.orientation = gardener.WEST
            elif orientation.upper() == "EAST": gardener.orientation = gardener.EAST

            sm = StateMachine(cgml_sm, sm_parameters={"gardener": gardener})

            # Ловим краш, чтобы сервер не падал
            try:
                result = run_state_machine(sm, [])
                return {
                    "status": "success",
                    "result": {
                        "timeout": result.timeout,
                        "signals": result.signals,
                        "calledSignals": result.called_signals,
                        "field": gardener.field,
                        "position": {"x": gardener.x, "y": gardener.y},
                        "orientation": gardener.orientation
                    }
                }
            except GardenerCrashException as e:
                return {
                    "status": "crash",
                    "message": str(e),
                    "result": {
                        "timeout": False,
                        "signals": [],
                        "calledSignals": [],
                        "field": gardener.field,
                        "position": {"x": gardener.x, "y": gardener.y},
                        "orientation": gardener.orientation
                    }
                }

        # === 2. Junior Reader ===
        elif platform == "junior-reader":
            message = request.parameters.get("message", "Привет, мир!")
            speed = float(request.parameters.get("speed", 1.0))

            sm = StateMachine(cgml_sm, sm_parameters={"message": message, "speed": speed})
            result = run_state_machine(sm, [])

            return {
                "status": "success",
                "result": {
                    "signals": result.signals,
                    "calledSignals": result.called_signals,
                    "timeout": result.timeout,
                    "field": None,      # У Reader нет поля
                    "position": None,   # У Reader нет позиции
                    "orientation": None
                }
            }

        else:
            return {"status": "error", "message": f"Unsupported platform: {cgml_sm.platform}"}

    except Exception as e:
        return {"status": "error", "message": str(e)}

# =============================
# RUN FILE (для разработки)
# =============================
@app.post("/run-file")
async def run_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        xml_string = content.decode("utf-8")

        parser = CGMLParser()
        elements = parser.parse_cgml(xml_string)

        if not elements.state_machines:
            return {"status": "error", "message": "No state machines found"}

        first_machine_id = list(elements.state_machines.keys())[0]
        cgml_sm = elements.state_machines[first_machine_id]
        platform = cgml_sm.platform.lower()

        # По умолчанию для run-file используем Gardener 10x8
        if "gardener" in platform:
            gardener = Gardener(10, 8)
            sm = StateMachine(cgml_sm, sm_parameters={"gardener": gardener})
            result = run_state_machine(sm, [])
            
            return {
                "status": "success",
                "result": {
                    "field": gardener.field,
                    "position": {"x": gardener.x, "y": gardener.y},
                    "orientation": gardener.orientation,
                    "signals": result.signals,
                    "calledSignals": result.called_signals
                }
            }
        else:
            return {"status": "error", "message": "run-file supports only Gardener for now"}

    except GardenerCrashException as e:
        return {"status": "crash", "message": str(e)}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
if __name__ == "__main__":
    import uvicorn
    # Передаем сам объект app, а не строку "main:app"
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")