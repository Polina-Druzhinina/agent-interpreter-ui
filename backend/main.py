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
from core.parser_service import extract_state_machine, MachineParseException
from core.executor_factory import execute_platform



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
        # 1. Используем наш parser_service для извлечения автомата
        cgml_sm = extract_state_machine(request.xml)

        # 2. Передаем автомат и параметры в фабрику исполнителей
        execution_result = execute_platform(cgml_sm, request.parameters)

        # 3. Возвращаем уже готовый чистый ответ фронтенду
        return execution_result

    except MachineParseException as e:
        return {"status": "error", "message": f"Ошибка парсинга графа: {str(e)}"}
    except Exception as e:
        return {"status": "error", "message": f"Критическая ошибка сервера: {str(e)}"}
    
    
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