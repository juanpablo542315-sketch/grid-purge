# 🟦 TRON LEGACY: EL GRAN RETO 🟧
**Proyecto:** Examen Tema 2 - Graficación 2D  
**Programador:** Juan Pablo Hernandez Martinez  
**Entorno:** The Grid (La Red de Combate)

## 📝 1. Contexto
Este videojuego se sitúa en el universo digital de **Tron Legacy**, donde los programas y usuarios compiten en duelos de motocicletas de luz dentro de "The Grid". La estética se basa en un entorno cian y naranja de alto contraste, utilizando una perspectiva de punto de fuga para simular profundidad en un espacio bidimensional, recreando la atmósfera cyberpunk clásica de la película.

## 🎯 2. Objetivo
El **USUARIO** debe sobrevivir y vencer al **PROGRAMA (GLU)** mediante la creación de muros de luz persistentes. El objetivo primordial es maniobrar con precisión para forzar al oponente a colisionar contra una estela de luz (propia o ajena) o contra los límites perimetrales de la Red, evitando al mismo tiempo ser desintegrado por las trayectorias enemigas.

## ⚖️ 3. Justificación Técnica
El desarrollo de este simulador fundamenta el aprendizaje de la **Canvas API** a través de:
* **Lógica de Colisiones:** Implementación de una matriz de datos que registra cada unidad del "Grid", permitiendo una detección de impactos inmediata y precisa.
* **Inteligencia Artificial (IA):** Creación de un agente autónomo capaz de evaluar direcciones seguras y calcular la proximidad del usuario para ejecutar movimientos tácticos.
* **Perspectiva Dinámica:** Renderizado de un fondo con punto de fuga y líneas de horizonte que se desplazan para generar una sensación de velocidad y movimiento infinito.
* **Gestión de Ciclos:** Uso de un `gameLoop` controlado para manejar niveles de dificultad mediante el ajuste de la velocidad de refresco (frames).

## 🕹️ 4. Operación del Videojuego
* **Inicio del Sistema:** El usuario navega a través de un registro de misión (Data Log) mediante el botón **SIGUIENTE** hasta establecer la conexión.
* **Mecánica de Movimiento:** * Se utilizan las **FLECHAS** del teclado para cambiar la dirección de la motocicleta en ángulos de 90°.
    * La tecla **ESPACIO** actúa como el comando universal para iniciar el combate o reiniciar el sistema tras una desintegración.
* **Progresión:** El juego escala a través de **3 Niveles** donde la velocidad de la Red aumenta progresivamente, desafiando los reflejos del usuario.
* **Interfaz de Datos:** Un panel lateral muestra en tiempo real el Nivel actual, el Tiempo de supervivencia y el Récord histórico almacenado en el sistema.