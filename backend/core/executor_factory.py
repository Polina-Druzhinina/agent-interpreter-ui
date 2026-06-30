from core.simulator import StateMachine, run_state_machine, Gardener, GardenerCrashException

def execute_platform(cgml_sm, parameters: dict) -> dict:
    
    #Фабрика исполнителей. Инициализирует нужную платформу (Gardener или Reader на данном этапе)
    #с переданными параметрами, запускает машину состояний и возвращает
    #ответ для фронта
    platform = cgml_sm.platform.lower()

    # ===============
    # Junior Gardener 
    # ===============
    if platform == "junior-gardener":
        width = parameters.get("width", 10)
        height = parameters.get("height", 8)
        orientation = parameters.get("orientation", "SOUTH")

        gardener = Gardener(width, height)

        # Настраиваем ориентацию робота
        if orientation.upper() == "NORTH": 
            gardener.orientation = gardener.NORTH
        elif orientation.upper() == "SOUTH": 
            gardener.orientation = gardener.SOUTH
        elif orientation.upper() == "WEST": 
            gardener.orientation = gardener.WEST
        elif orientation.upper() == "EAST": 
            gardener.orientation = gardener.EAST

        sm = StateMachine(cgml_sm, sm_parameters={"gardener": gardener})

        # Запускаем симуляцию и ловим краши, чтобы сервер не падал
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

    # =============
    # Junior Reader
    # =============

    elif platform == "junior-reader":
        message = parameters.get("message", "Привет")
        speed = float(parameters.get("speed", 1.0))

        sm = StateMachine(cgml_sm, sm_parameters={"message": message, "speed": speed})
        result = run_state_machine(sm, [])

        return {
            "status": "success",
            "result": {
                "signals": result.signals,
                "calledSignals": result.called_signals,
                "timeout": result.timeout,
                "field": None,      # У Reder нет поля
                "position": None,   # У Reader нет позиции
                "orientation": None
            }
        }

    # ==========================
    # Неподдерживаемая платформа
    # ==========================

    else:
        return {"status": "error", "message": f"Unsupported platform: {cgml_sm.platform}"}