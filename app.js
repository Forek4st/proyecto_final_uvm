// Esperar que el DOM esté completamente cargado antes de ejecutar cualquier acción
document.addEventListener("DOMContentLoaded", () => {
  // Obtener referencias del DOM
  const modal = document.getElementById("roomModal");
  const closeModal = document.querySelector(".close");
  const hoursSelect = document.getElementById("hours");
  const roomNumberInput = document.getElementById("roomNumber");
  const roomDivs = document.querySelectorAll(".room");

  let occupiedRooms = JSON.parse(localStorage.getItem("occupiedRooms")) || [];

  class Room {
    static ISH = 0.04;
    static IVA = 0.16;
    static id = occupiedRooms.length
      ? Math.max(...occupiedRooms.map((room) => room.id)) + 1
      : 1;

    constructor(
      roomType,
      basePrice,
      hours,
      roomNumber,
      guestPlates,
      guestModel,
      guestId
    ) {
      this.id = Room.id++;
      this.roomType = roomType;
      this.basePrice = basePrice;
      this.hours = hours;
      this.roomNumber = roomNumber;
      this.guestPlates = guestPlates;
      this.guestModel = guestModel;
      this.guestId = guestId.toUpperCase();
      this.roomRegisterTime = new Date().toLocaleString("es-MX");
      this.ISH = basePrice * Room.ISH;
      this.IVA = basePrice * Room.IVA;
      this.totalPrice = Math.ceil(basePrice + this.ISH + this.IVA);
    }
  }

  const basePrices = {
    Jacuzzi: 583.33,
    Sencilla: {
      6: 308.33,
      9: 458.33,
      12: 583.33,
      24: 666.66,
    },
  };

  const basePrice = (roomType, hours) =>
    roomType === "Jacuzzi"
      ? basePrices.Jacuzzi
      : roomType === "Sencilla"
      ? basePrices.Sencilla[hours] || 0
      : 0;

  const jacuzziRooms = [15, 16, 17, 18];

  const getRoomType = (roomNumber) => {
    const num = parseInt(roomNumber, 10);
    return jacuzziRooms.includes(num) ? "Jacuzzi" : "Sencilla";
  };

  const updateOccupiedRooms = (newRoom) => {
    occupiedRooms.push(newRoom);
    localStorage.setItem("occupiedRooms", JSON.stringify(occupiedRooms));
    occupiedRoomStatus();
  };

  const createNewRoom = (event) => {
    event.preventDefault();
    const form = event.target;
    const roomNumber = form.roomNumber.value;
    const roomType = getRoomType(roomNumber);
    const hours = parseInt(form.hours.value);
    const guestPlates = form.guestPlates.value.toUpperCase();
    const guestModel = form.guestModel.value.toUpperCase();
    const guestId = form.guestId.value ? form.guestId.value.toUpperCase() : "*";

    if (!roomType || isNaN(hours) || isNaN(roomNumber) || !guestId) {
      return;
    }

    const basePriceValue = basePrice(roomType, hours);

    const newRoom = new Room(
      roomType,
      basePriceValue,
      hours,
      roomNumber,
      guestPlates,
      guestModel,
      guestId
    );

    console.log("New room: ", newRoom);

    updateOccupiedRooms(newRoom);

    Toastify({
      text: `Habitación ${roomNumber} registrada exitosamente por ${hours} horas`,
      duration: 5000,
      className: "info",
      gravity: "bottom",
      position: "right",
      style: {
        background: "#ff3399",
      },
    }).showToast();

    form.reset();
    modal.style.display = "none";
  };

  document
    .querySelector("#createRoomForm")
    .addEventListener("submit", createNewRoom);

  const openModal = (event) => {
    const roomNumber = event.target.getAttribute("data-room");
    const roomType = getRoomType(roomNumber);
    const roomRegisterTitle = document.querySelector(".room-register");
    roomRegisterTitle.textContent = `Habitación ${roomNumber} ${roomType}`;

    // Actualizar valores en el formulario
    roomNumberInput.value = roomNumber;
    updateHours(roomType);

    // Mostrar el modal
    modal.style.display = "block";
  };

  // Actualizar las opciones de horas según el tipo de habitación
  const updateHours = (roomType) => {
    hoursSelect.innerHTML = ""; // Limpiar opciones previas
    if (roomType === "Jacuzzi") {
      hoursSelect.innerHTML = '<option value="6">6</option>';
    } else {
      const hours = [6, 9, 12, 24];
      hours.forEach((hour) => {
        hoursSelect.innerHTML += `<option value="${hour}">${hour}</option>`;
      });
    }
  };

  const closeModalHandler = () => {
    modal.style.display = "none";
  };

  // Cerrar modal al hacer clic fuera de él
  window.onclick = (event) => {
    if (event.target === modal) {
      closeModalHandler();
    }
  };

  // Agregar eventos a las habitaciones
  roomDivs.forEach((room) => {
    room.addEventListener("click", openModal);
  });

  // Evento para cerrar modal
  if (closeModal) {
    closeModal.onclick = closeModalHandler;
  }

  const occupiedRoomStatus = () => {
    // Limpiar clases activas
    roomDivs.forEach((room) => room.classList.remove("active"));

    // Agregar clase "active" a las habitaciones ocupadas
    occupiedRooms.forEach((room) => {
      const roomElement = document.querySelector(
        `.room[data-room="${room.roomNumber}"]`
      );
      if (roomElement) {
        roomElement.classList.add("active");
      }
    });
  };

  occupiedRoomStatus();

  const clearLocalStorage = () => {
    localStorage.clear();
    occupiedRooms = [];
    occupiedRoomStatus();
  };

  // Botón para finalizar sesión
  const endSessionButton = document.querySelector(".endSession");
  if (endSessionButton) {
    endSessionButton.addEventListener("click", clearLocalStorage);
  }
});
