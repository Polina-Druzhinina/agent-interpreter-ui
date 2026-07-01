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
        custom_field = parameters.get("field", None)

        gardener = Gardener(width, height)

        # Если фронт передал матрицу, записываем её в симулятор
        if custom_field and len(custom_field) == height and len(custom_field[0]) == width:
            gardener.field = [row[:] for row in custom_field]

        # Настраиваем ориентацию робота
        orientation_map = {
            "NORTH": gardener.NORTH,
            "SOUTH": gardener.SOUTH,
            "WEST": gardener.WEST,
            "EAST": gardener.EAST
        }
        gardener.orientation = orientation_map.get(orientation.upper(), gardener.SOUTH)

        # Массив для пошаговой трассировки
        steps_history = []

        # Перевод направления в строковый формат для фронта
        def get_orientation_str(o):
            orientation_names = {
                gardener.NORTH: "north",
                gardener.SOUTH: "south",
                gardener.WEST: "west",
                gardener.EAST: "east"
            }
            return orientation_names.get(o, "south")

        # Фиксация текущего положения робота и копирование матрицы поля
        def save_current_step():
            steps_history.append({
                "position": {"x": gardener.x, "y": gardener.y},
                "orientation": get_orientation_str(gardener.orientation),
                "field": [row[:] for row in gardener.field]
            })

        # Создаём машину состояний
        sm = StateMachine(cgml_sm, sm_parameters={"gardener": gardener})

        # Находим компонент Mover и патчим его методы для записи истории шагов
        mover_component = None
        for comp_id, comp in sm.components.items():
            if comp.type == "Mover":
                mover_component = comp.obj
                break

        if mover_component:
            # Сохраняем оригинальные методы
            original_move_forward = mover_component.move_forward
            original_move_backward = mover_component.move_backward
            original_turn_left = mover_component.turn_left
            original_turn_right = mover_component.turn_right

            # Патчим move_forward
            def patched_move_forward():
                save_current_step()  # Сохраняем состояние перед движением
                original_move_forward()
                save_current_step()  # Сохраняем состояние после движения

            # Патчим move_backward
            def patched_move_backward():
                save_current_step()
                original_move_backward()
                save_current_step()

            # Патчим turn_left
            def patched_turn_left():
                save_current_step()
                original_turn_left()
                save_current_step()

            # Патчим turn_right
            def patched_turn_right():
                save_current_step()
                original_turn_right()
                save_current_step()

            # Заменяем методы
            mover_component.move_forward = patched_move_forward
            mover_component.move_backward = patched_move_backward
            mover_component.turn_left = patched_turn_left
            mover_component.turn_right = patched_turn_right

        # Сохраняем стартовую точку перед началом движения
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