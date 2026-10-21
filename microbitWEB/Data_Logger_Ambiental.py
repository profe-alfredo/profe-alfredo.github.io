from microbit import *
import log

# Configuración inicial
capturar_datos = False
display.show(Image.NO)

# Configurar títulos de las columnas (el registro de datos en MicroPython usa log.set_labels)
log.set_labels("Temperatura", "Luz", "Sonido", "Conductividad")

last_log_time = running_time()

# En MicroPython usamos un bucle principal en lugar de funciones de eventos (on_button_pressed)
while True:
    # Botón A+B: Borrar registro y restablecer etiquetas
    if button_a.is_pressed() and button_b.is_pressed():
        display.show(Image.SKULL)
        log.delete()
        log.set_labels("Temperatura", "Luz", "Sonido", "Conductividad")
        sleep(500) # Pausa para evitar registros múltiples por un solo toque
        # Limpiar cualquier evento residual de los botones individuales
        button_a.was_pressed()
        button_b.was_pressed()

    # Botón A: Iniciar captura
    elif button_a.was_pressed():
        capturar_datos = True
        display.show(Image.YES)

    # Botón B: Detener captura
    elif button_b.was_pressed():
        capturar_datos = False
        display.show(Image.NO)

    # Registro cada 6000 ms (6 segundos)
    if capturar_datos and (running_time() - last_log_time >= 6000):
        last_log_time = running_time()
        display.show(Image.HEART)
        
        try:
            # log.add usa un diccionario con las etiquetas exactas definidas arriba
            log.add({
                "Temperatura": temperature(),
                "Luz": display.read_light_level(),
                "Sonido": microphone.sound_level(),
                "Conductividad": pin1.read_analog()
            })
            sleep(200) # Mostrar el corazón un momento para confirmar visualmente
            display.clear()
        
        # MicroPython lanza un OSError cuando la memoria de registro está llena
        except OSError:
            capturar_datos = False
            # Encender todos los LEDs usando un string de intensidad (9 = máximo)
            display.show(Image("99999:"
                               "99999:"
                               "99999:"
                               "99999:"
                               "99999"))
            
    # Pequeña pausa para no saturar el procesador
    sleep(50)