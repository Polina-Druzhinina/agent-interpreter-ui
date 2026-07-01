from core.simulator import StateMachine, run_state_machine, Gardener, GardenerCrashException, set_step_saver

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
        custom_field = parameters.get("field", None)

        gardener = Gardener(width, height)

        # Если фронт передал матрицу, записываем её в симулятор
        if custom_field and len(custom_field) == height and len(custom_field[0]) == width:
            gardener.field = [row[:] for row in custom_field]

        # Настраиваем ориентацию робота
        if orientation.upper() == "NORTH":
            gardener.orientation = gardener.NORTH
        elif orientation.upper() == "WEST":
            gardener.orientation = gardener.WEST
        elif orientation.upper() == "EAST":
            gardener.orientation = gardener.EAST
        else:
            gardener.orientation = gardener.SOUTH
        
        # Перевод направления в строковый формат для фронта
        def get_orientation_str(o):
            orientation_names = {
                gardener.NORTH: "north",
                gardener.SOUTH: "south",
                gardener.WEST: "west",
                gardener.EAST: "east"
            }
            return orientation_names.get(o, "south")

        # Массив для пошаговой трассировки
        steps_history = []

        # Фиксация текущего положения робота и копирование матрицы поля
        def save_current_step():
            steps_history.append({
                "position": {"x": gardener.x, "y": gardener.y},
                "orientation": get_orientation_str(gardener.orientation),
                "field": [row[:] for row in gardener.field]
            })

        
        # Передаём коллбэк в декоратор
        set_step_saver(save_current_step)

        # Создаём машину состояний
        sm = StateMachine(cgml_sm, sm_parameters={"gardener": gardener})

         # Сохраняем стартовую точку перед ходом
        save_current_step()

        # Запускаем симуляцию и ловим краши
        try:
            result = run_state_machine(sm, [])
            return {
                "status": "success",
                "message": "Симуляция успешно завершена",
                "steps": steps_history,
                "result": {
                    "signals": result.signals,
                    "calledSignals": result.called_signals
                }
            }
        except GardenerCrashException as e:
            # Возвращаем последний валидный шаг (предпоследний перед crash)
            return {
                "status": "crash",
                "message": str(e),
                "steps": steps_history,
                "result": {
                    "signals": [],
                    "calledSignals": []
                }
            }
        finally:
            # Сбрасываем коллбэк после завершения
            set_step_saver(None)

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