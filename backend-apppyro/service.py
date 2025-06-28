from typing import List, Optional
from datetime import datetime
import json
import os
from models import Room, RoomCreate, RoomUpdate


class RoomService:
    """Servicio para manejar operaciones CRUD de habitaciones"""

    def __init__(self, data_file: str = "rooms_data.json", memory_only: bool = False):
        self.data_file = data_file
        self.memory_only = memory_only  # Nueva opción para solo memoria
        self.ISH_RATE = 0.04  # 4% Impuesto sobre hospedaje
        self.IVA_RATE = 0.16  # 16% IVA
        
        if self.memory_only:
            # Solo en memoria: siempre empezar limpio
            self.rooms = []
            self.next_id = 1
        else:
            # Modo normal: cargar desde archivo
            self._load_data()

    def _load_data(self) -> None:
        """Cargar datos desde archivo JSON"""
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.rooms = [Room(**room) for room in data.get("rooms", [])]
                    self.next_id = data.get("next_id", 1)
            except (json.JSONDecodeError, KeyError):
                self.rooms = []
                self.next_id = 1
        else:
            self.rooms = []
            self.next_id = 1

    def _save_data(self) -> None:
        """Guardar datos en archivo JSON"""
        # Si está en modo memoria, no guardar en archivo
        if self.memory_only:
            return
            
        data = {
            "rooms": [room.model_dump() for room in self.rooms],
            "next_id": self.next_id,
        }
        with open(self.data_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    def _calculate_taxes_and_total(self, base_price: float) -> tuple[float, float, int]:
        """Calcular impuestos y precio total"""
        ish = base_price * self.ISH_RATE
        iva = base_price * self.IVA_RATE
        total_price = int(base_price + ish + iva)
        return ish, iva, total_price

    def create_room(self, room_data: RoomCreate) -> Room:
        """Crear una nueva habitación"""
        # Verificar si la habitación ya está ocupada
        if self.get_room_by_number(room_data.roomNumber):
            raise ValueError(f"La habitación {room_data.roomNumber} ya está ocupada")

        # Calcular impuestos y precio total
        ish, iva, total_price = self._calculate_taxes_and_total(room_data.basePrice)

        # Crear objeto Room completo
        room = Room(
            id=self.next_id,
            roomType=room_data.roomType,
            basePrice=room_data.basePrice,
            hours=room_data.hours,
            roomNumber=room_data.roomNumber,
            guestPlates=room_data.guestPlates.upper(),
            guestModel=room_data.guestModel.upper(),
            guestId=room_data.guestId.upper(),
            roomRegisterTime=datetime.now().strftime("%d/%m/%Y, %H:%M"),
            ISH=ish,
            IVA=iva,
            totalPrice=total_price,
            isActive=True,
        )

        self.rooms.append(room)
        self.next_id += 1
        self._save_data()

        return room

    def get_all_rooms(self) -> List[Room]:
        """Obtener todas las habitaciones activas"""
        return [room for room in self.rooms if room.isActive]

    def get_all_rooms_history(self) -> List[Room]:
        """Obtener todas las habitaciones (historial completo incluyendo inactivas)"""
        return self.rooms  # Retorna TODAS las habitaciones sin filtro

    def get_room_by_id(self, room_id: int) -> Optional[Room]:
        """Obtener habitación por ID"""
        for room in self.rooms:
            if room.id == room_id:
                return room
        return None

    def get_room_by_number(self, room_number: str) -> Optional[Room]:
        """Obtener habitación por número"""
        for room in self.rooms:
            if room.roomNumber == room_number and room.isActive:
                return room
        return None

    def update_room(self, room_id: int, room_update: RoomUpdate) -> Optional[Room]:
        """Actualizar una habitación existente"""
        room = self.get_room_by_id(room_id)
        if not room:
            return None

        # Actualizar campos proporcionados
        update_data = room_update.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            if hasattr(room, field):
                if field in ["guestPlates", "guestModel", "guestId"]:
                    setattr(room, field, value.upper())
                else:
                    setattr(room, field, value)

        # Recalcular impuestos y total si cambió el precio base
        if "basePrice" in update_data:
            ish, iva, total_price = self._calculate_taxes_and_total(room.basePrice)
            room.ISH = ish
            room.IVA = iva
            room.totalPrice = total_price

        self._save_data()
        return room

    def delete_room(self, room_id: int) -> bool:
        """Marcar habitación como inactiva (checkout)"""
        for room in self.rooms:
            if room.id == room_id and room.isActive:
                room.isActive = False
                self._save_data()
                return True
        return False

    def get_occupied_rooms(self) -> List[Room]:
        """Obtener solo habitaciones ocupadas"""
        return self.rooms

    def clear_all_rooms(self) -> bool:
        """Marcar todas las habitaciones como inactivas (fin de sesión)"""
        for room in self.rooms:
            room.isActive = False
        self._save_data()
        return True
