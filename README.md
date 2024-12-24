# Motel Pyro

Motel Pyro es una aplicación web diseñada para gestionar las reservas y servicios de habitaciones de un motel. La aplicación proporciona una interfaz fácil de usar para registrar habitaciones, gestionar habitaciones ocupadas y simular llamadas a una API para obtener datos de habitaciones.

## Características

- **Registro de Habitaciones**: Registra nuevas habitaciones con detalles como tipo de habitación, horas, placas del huésped, modelo del huésped e ID del huésped.
- **Gestión de Habitaciones Ocupadas**: Visualiza y gestiona las habitaciones ocupadas.
- **Llamadas a API Simuladas**: Obtén datos de habitaciones desde un archivo JSON local utilizando la API `fetch`.
- **Diseño Responsivo**: La aplicación está diseñada para ser responsiva y fácil de usar.

## Tecnologías Utilizadas

- HTML
- CSS
- JavaScript
- Toastify.js para notificaciones

## Uso


Haz clic en cualquier habitación disponible para abrir el modal de registro.
Rellena los detalles requeridos como horas, placas del huésped, modelo del huésped e ID del huésped.
Haz clic en el botón "Registrar" para registrar la habitación.
Ver Habitaciones Ocupadas:

Las habitaciones ocupadas se resaltan con un color de fondo diferente.
Haz clic en una habitación ocupada para abrir el modal de habitación activa.
Llamada a API Simulada:

La aplicación simula una llamada a API para obtener datos de habitaciones desde un archivo JSON local utilizando la API fetch en el apartado "Mas cortes"

## Estructura de Archivos
index.html: El archivo HTML principal de la aplicación.
main.css: El archivo CSS principal para el estilo de la aplicación.
app.js: El archivo JavaScript principal para la lógica de la aplicación.
data/rooms.json: El archivo JSON local utilizado para simular llamadas a API.
