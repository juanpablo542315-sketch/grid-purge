# GRID PURGE: SYSTEM TRON LEGACY
**Proyecto:** Examen Tema 2 - Graficación 2D  
**Estética:** Tron Legacy / Cyberpunk

## 🚀 Contexto y Justificación
Este simulador de combate en "The Grid" demuestra el dominio de la Canvas API mediante la implementación de un sistema de partículas sólidas y rastros persistentes. Se justifica técnica y académicamente a través de:

Gestión de Matrices (Grids): Control de colisiones mediante una matriz de datos bidimensional para registrar las estelas de luz.

Lógica de IA: Implementación de un agente autónomo que toma decisiones de dirección basadas en el entorno inmediato.

Manejo de Eventos: Interrupción y captura de periféricos (teclado) para el control de vectores de movimiento en tiempo real.

## 🕹️ Operación
- **Objetivo:** Sobrevivir al duelo de motos. Debes maniobrar para que la IA enemiga choque contra tu estela de luz o contra las paredes del sistema.
- **Controles:** Flechas del teclado: Cambiar dirección de la moto (Arriba, Abajo, Izquierda, Derecha).
-Barra Espaciadora / Botones: Controlar el flujo de la misión y reiniciar el sistema.
- **Dificultad:** La velocidad aumenta proporcionalmente al Score.
- **Persistencia:** Almacenamiento de High Score en LocalStorage.

## 📂 Estructura
- `/assets`: Recursos gráficos (PNG, JPG).
- `index.html`: Estructura con Bootstrap 5.
- `script.js`: Lógica de multiobjetos y renderizado.
- `style.css`: Estilos visuales neón.