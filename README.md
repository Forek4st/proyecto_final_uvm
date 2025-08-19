# 🏨 Motel Pyro - Sistema de Gestión

Sistema completo de gestión para motel que incluye registro de habitaciones, control de ocupación, cortes de caja y servicios adicionales. Desarrollado con frontend en JavaScript vanilla y backend en FastAPI.

## 🚀 Características Principales

- **🏠 Gestión de Habitaciones**: Registro y control de habitaciones disponibles/ocupadas
- **👥 Registro de Huéspedes**: Control de placas, modelo de vehículo e información del huésped
- **💰 Sistema de Cortes**: Generación de reportes de ingresos y estadísticas
- **🛍️ Servicios Adicionales**: Control de servicios extra (sex shop, restaurant, etc.)
- **📊 Dashboard Administrativo**: Visualización de datos y métricas en tiempo real
- **🔐 Gestión de Sesiones**: Sistema de autenticación y cierre de sesión
- **📱 Diseño Responsivo**: Interfaz adaptable a diferentes dispositivos

## 🛠️ Stack Tecnológico

### Frontend

- **HTML5** - Estructura semántica
- **CSS3** - Estilos y animaciones
- **JavaScript (ES6+)** - Lógica del cliente
- **Toastify.js** - Notificaciones elegantes

### Backend

- **Python 3.13** - Lenguaje base
- **FastAPI** - Framework web moderno y rápido
- **Pydantic** - Validación de datos
- **Uvicorn** - Servidor ASGI
- **Poetry** - Gestión de dependencias

## 📁 Estructura del Proyecto

```
app_motel/
├── 📄 index.html              # Página principal
├── 📦 package.json            # Configuración del proyecto
├── 📋 README.md               # Este archivo
├── 🎨 assets/                 # Recursos estáticos
│   ├── end.svg
│   ├── extra.svg
│   ├── pyrofavicon.svg
│   ├── pyrofavicon.webp
│   ├── restaurant.svg
│   ├── roomchange.svg
│   ├── sales.svg
│   └── sexshop.svg
├── 🖥️ backend-apppyro/        # API Backend
│   ├── main.py               # Punto de entrada FastAPI
│   ├── models.py             # Modelos Pydantic
│   ├── service.py            # Lógica de negocio
│   ├── pyproject.toml        # Configuración Poetry
│   └── requirements.txt      # Dependencias pip
├── 🎨 css/                    # Hojas de estilo
│   ├── cerrar_sesion.css
│   ├── cortes.css
│   └── main.css
├── ⚡ js/                     # Scripts JavaScript
│   ├── app.js                # Lógica principal
│   └── corte.js              # Lógica de cortes
└── 📱 pages/                  # Páginas adicionales
    ├── cerrar_sesion.html
    └── corte.html
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Python 3.13+
- Poetry (recomendado) o pip
- Navegador web moderno

### Backend Setup

1. **Navegar al directorio del backend:**

```bash
cd backend-apppyro
```

2. **Instalar dependencias con Poetry:**

```bash
poetry install
```

**O con pip:**

```bash
pip install -r requirements.txt
```

3. **Activar el entorno virtual (Poetry):**

```bash
poetry shell
```

4. **Ejecutar el servidor:**

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. **Abrir `index.html` directamente en el navegador, o**

2. **Usar un servidor local (recomendado):**

```bash
# Con Python
python -m http.server 3000

# Con Node.js (si tienes live-server instalado)
npx live-server
```

## 🎯 Uso de la Aplicación

### Gestión de Habitaciones

1. **Registrar habitación**: Clic en habitación disponible → Completar formulario
2. **Ver habitaciones ocupadas**: Las habitaciones ocupadas se muestran con color diferente
3. **Liberar habitación**: Clic en habitación ocupada → Finalizar estancia

### Sistema de Cortes

1. Navegar a "Mi Corte" en el menú
2. Visualizar estadísticas del día
3. Generar reportes de ingresos
4. Revisar servicios adicionales vendidos

### Cerrar Sesión

- Usar el botón de cerrar sesión para finalizar la sesión actual
- Confirmar cierre en el modal de confirmación

## 🔧 API Endpoints

La API REST incluye los siguientes endpoints principales:

- `GET /api/rooms` - Obtener todas las habitaciones
- `POST /api/rooms` - Crear nueva habitación
- `PUT /api/rooms/{id}` - Actualizar habitación
- `DELETE /api/rooms/{id}` - Eliminar habitación
- `GET /api/rooms/occupied` - Obtener habitaciones ocupadas
- `POST /api/checkout` - Realizar checkout

## 🌟 Características Avanzadas

- **Validación de datos** con Pydantic
- **CORS configurado** para desarrollo
- **Manejo de errores** robusto
- **Documentación automática** con FastAPI (Swagger UI en `/docs`)
- **Notificaciones en tiempo real** con Toastify
- **Persistencia de estado** en localStorage

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crea un Pull Request

## 👨‍💻 Autor

**Forek4st**

- Email: janeirojm91@gmail.com
- GitHub: [@Forek4st](https://github.com/Forek4st)

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `package.json` para más detalles.

## 🙏 Reconocimientos

- Proyecto desarrollado como trabajo final para CoderHouse
- FastAPI por su excelente documentación
- Toastify.js por las notificaciones elegantes
