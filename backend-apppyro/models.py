from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime


class RoomBase(BaseModel):
    """Modelo base para habitaciones"""

    roomType: Literal["Sencilla", "Jacuzzi"] = Field(
        ..., description="Tipo de habitación"
    )
    basePrice: float = Field(..., gt=0, description="Precio base de la habitación")
    hours: int = Field(..., gt=0, le=24, description="Número de horas contratadas")
    roomNumber: str = Field(..., min_length=1, description="Número de habitación")
    guestPlates: str = Field(
        ..., min_length=1, description="Placas del vehículo del huésped"
    )
    guestModel: str = Field(..., min_length=1, description="Modelo del vehículo")
    guestId: str = Field(..., min_length=1, description="ID del huésped")


class RoomCreate(RoomBase):
    """Modelo para crear una nueva habitación"""

    pass


class RoomUpdate(BaseModel):
    """Modelo para actualizar una habitación existente"""

    roomType: Optional[Literal["Sencilla", "Jacuzzi"]] = None
    basePrice: Optional[float] = Field(None, gt=0)
    hours: Optional[int] = Field(None, gt=0, le=24)
    roomNumber: Optional[str] = Field(None, min_length=1)
    guestPlates: Optional[str] = Field(None, min_length=1)
    guestModel: Optional[str] = Field(None, min_length=1)
    guestId: Optional[str] = Field(None, min_length=1)
    isActive: Optional[bool] = None


class Room(RoomBase):
    """Modelo completo de habitación con campos calculados"""

    id: int = Field(..., description="ID único de la habitación")
    roomRegisterTime: str = Field(..., description="Fecha y hora de registro")
    ISH: float = Field(..., description="Impuesto sobre hospedaje (4%)")
    IVA: float = Field(..., description="Impuesto al valor agregado (16%)")
    totalPrice: int = Field(..., description="Precio total incluyendo impuestos")
    isActive: bool = Field(default=True, description="Estado activo de la habitación")

    class Config:
        from_attributes = True


class RoomResponse(BaseModel):
    """Respuesta estándar para operaciones de habitación"""

    success: bool
    message: str
    data: Optional[Room] = None


class RoomsListResponse(BaseModel):
    """Respuesta para listado de habitaciones"""

    success: bool
    message: str
    data: list[Room]
    total: int


class ErrorResponse(BaseModel):
    """Respuesta de error estándar"""

    success: bool = False
    message: str
    error_code: Optional[str] = None
