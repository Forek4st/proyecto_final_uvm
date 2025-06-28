from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List
import uvicorn

from models import (
    Room,
    RoomCreate,
    RoomUpdate,
    RoomResponse,
    RoomsListResponse,
    ErrorResponse,
)
from service import RoomService

# Crear instancia de FastAPI
app = FastAPI(
    title="Motel Room Management API",
    description="API para gestionar habitaciones de motel con FastAPI y Pydantic",
    version="1.0.0",
)

# Configurar CORS para permitir requests desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instancia del servicio en modo memoria (no persistir datos)
room_service = RoomService(memory_only=True)


@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=ErrorResponse(
            message=str(exc), error_code="VALIDATION_ERROR"
        ).model_dump(),
    )


@app.get("/")
async def root():
    """Endpoint raíz"""
    return {"message": "Motel Room Management API", "version": "1.0.0"}


@app.post("/rooms", response_model=RoomResponse, status_code=status.HTTP_201_CREATED)
async def create_room(room_data: RoomCreate):
    """Crear una nueva habitación"""
    try:
        # Verificar si la habitación ya existe
        existing_room = room_service.get_room_by_number(room_data.roomNumber)
        if existing_room:
            raise ValueError(f"La habitación {room_data.roomNumber} ya está ocupada")

        room = room_service.create_room(room_data)
        return RoomResponse(
            success=True,
            message=f"Habitación {room.roomNumber} registrada exitosamente",
            data=room,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@app.get("/rooms", response_model=RoomsListResponse)
async def get_all_rooms():
    """Obtener todas las habitaciones ocupadas"""
    rooms = room_service.get_all_rooms()
    return RoomsListResponse(
        success=True,
        message="Habitaciones obtenidas exitosamente",
        data=rooms,
        total=len(rooms),
    )


@app.get("/rooms/history", response_model=RoomsListResponse)
async def get_all_rooms_history():
    """Obtener todas las habitaciones (historial completo incluyendo inactivas)"""
    rooms = room_service.get_all_rooms_history()
    return RoomsListResponse(
        success=True,
        message="Historial de habitaciones obtenido exitosamente",
        data=rooms,
        total=len(rooms),
    )


@app.get("/rooms/{room_id}", response_model=RoomResponse)
async def get_room_by_id(room_id: int):
    """Obtener habitación por ID"""
    room = room_service.get_room_by_id(room_id)
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Habitación con ID {room_id} no encontrada",
        )

    return RoomResponse(success=True, message="Habitación encontrada", data=room)


@app.get("/rooms/number/{room_number}", response_model=RoomResponse)
async def get_room_by_number(room_number: str):
    """Obtener habitación por número"""
    room = room_service.get_room_by_number(room_number)
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Habitación {room_number} no encontrada",
        )

    return RoomResponse(success=True, message="Habitación encontrada", data=room)


@app.put("/rooms/{room_number}", response_model=RoomResponse)
async def update_room_by_number(room_number: str, room_update: RoomUpdate):
    """Actualizar una habitación por número de habitación"""
    room = room_service.get_room_by_number(room_number)
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Habitación {room_number} no encontrada",
        )

    updated_room = room_service.update_room(room.id, room_update)
    return RoomResponse(
        success=True,
        message=f"Habitación {room_number} actualizada exitosamente",
        data=updated_room,
    )


@app.delete("/rooms/{room_id}", response_model=dict)
async def checkout_room(room_id: int):
    """Hacer checkout de una habitación (eliminar)"""
    success = room_service.delete_room(room_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Habitación con ID {room_id} no encontrada",
        )

    return {
        "success": True,
        "message": f"Checkout realizado exitosamente para habitación ID {room_id}",
    }


@app.delete("/rooms/number/{room_number}", response_model=dict)
async def checkout_room_by_number(room_number: str):
    """Hacer checkout de una habitación por número de habitación"""
    room = room_service.get_room_by_number(room_number)
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Habitación {room_number} no encontrada",
        )

    success = room_service.delete_room(room.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Error al hacer checkout de habitación {room_number}",
        )

    return {
        "success": True,
        "message": f"Checkout realizado exitosamente para habitación {room_number}",
    }


@app.delete("/rooms", response_model=dict)
async def clear_all_rooms():
    """Limpiar todas las habitaciones (fin de sesión)"""
    room_service.clear_all_rooms()
    return {"success": True, "message": "Todas las habitaciones han sido liberadas"}


@app.get("/health")
async def health_check():
    """Endpoint de salud"""
    return {"status": "healthy", "service": "room-management-api"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, log_level="info")
