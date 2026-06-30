from core.simulator import CGMLParser

class MachineParseException(Exception):
    #Вызывается, если не удалось распарсить файл или в нём нет автоматов
    pass

def extract_state_machine(xml_string: str):
    
   # Принимает XML-строку, парсит её и возвращает первый найденный автомат.
    #Если автоматов нет, выбрасывает ошибку.
 
    parser = CGMLParser()
    elements = parser.parse_cgml(xml_string)

    # Проверяем, есть ли вообще автоматы в файле
    if not elements.state_machines:
        raise MachineParseException("В файле не найдены State Machines")

    # Если всё ок, забираем самый первый автомат и возвращаем его
    first_machine_id = list(elements.state_machines.keys())[0]
    return elements.state_machines[first_machine_id]