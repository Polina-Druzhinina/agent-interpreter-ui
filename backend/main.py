from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from core.simulator import CGMLParser

from pydantic import BaseModel
from core.simulator import (
    CGMLParser,
    StateMachine,
    run_state_machine,
    Gardener
)

app = FastAPI(title="State Machine Interpreter API", version="1.0.0")

# Разрешаем запросы (для будущего фронта)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Backend is running"}

class RunRequest(BaseModel):
    xml: str
    parameters: dict


@app.post("/load-file")
async def load_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        xml_string = content.decode("utf-8")

        parser = CGMLParser()
        elements = parser.parse_cgml(xml_string)

        if not elements.state_machines:
            return {
                "status": "error",
                "error": {
                    "type": "ParsingError",
                    "message": "No state machines found"
                }
            }

        first_machine_id = list(elements.state_machines.keys())[0]
        state_machine = elements.state_machines[first_machine_id]

        return {
            "status": "success",
            "platform": state_machine.platform,
            "name": state_machine.name,
            "statesCount": len(state_machine.states),
            "transitionsCount": len(state_machine.transitions),
            "requiredParameters": list(state_machine.components.keys())
        }

    except Exception as e:
        return {
            "status": "error",
            "error": {
                "type": "ServerError",
                "message": str(e)
            }
        }
    
@app.post("/run")
def run_machine(request: RunRequest):
    try:
        # 1. Парсим XML
        parser = CGMLParser()
        elements = parser.parse_cgml(request.xml)

        if not elements.state_machines:
            return {
                "status": "error",
                "message": "No state machines found"
            }

        first_machine_id = list(elements.state_machines.keys())[0]
        cgml_sm = elements.state_machines[first_machine_id]

        # 2. Создаём машину в зависимости от платформы
        if cgml_sm.platform.lower() == "junior-gardener":

            width = request.parameters.get("width", 10)
            height = request.parameters.get("height", 8)
            orientation = request.parameters.get("orientation", "SOUTH")

            gardener = Gardener(width, height)

            if orientation == "NORTH":
                gardener.orientation = gardener.NORTH
            elif orientation == "SOUTH":
                gardener.orientation = gardener.SOUTH
            elif orientation == "WEST":
                gardener.orientation = gardener.WEST
            elif orientation == "EAST":
                gardener.orientation = gardener.EAST

            sm = StateMachine(
                cgml_sm,
                sm_parameters={"gardener": gardener}
            )

        elif cgml_sm.platform.lower() == "junior-reader":

            message = request.parameters.get("message", "")
            speed = request.parameters.get("speed", 1.0)

            sm = StateMachine(
                cgml_sm,
                sm_parameters={
                    "message": message,
                    "speed": speed
                }
            )

        else:
            return {
                "status": "error",
                "message": f"Unsupported platform: {cgml_sm.platform}"
            }

        # 3. Запускаем машину
        result = run_state_machine(sm, [])

        # 4. Формируем ответ
        response = {
            "timeout": result.timeout,
            "signals": result.signals,
            "calledSignals": result.called_signals
        }

        # Если это gardener — вернём ещё поле и позицию
        if cgml_sm.platform.lower() == "junior-gardener":
            response["field"] = gardener.field
            response["position"] = {
                "x": gardener.x,
                "y": gardener.y
            }
            response["orientation"] = gardener.orientation

        return {
            "status": "success",
            "result": response
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }