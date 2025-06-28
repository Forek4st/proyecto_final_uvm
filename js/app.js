document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("roomModal");
  const activeModal = document.getElementById("activeRoomModal");
  const closeModalButtons = document.querySelectorAll(".close");
  const hoursSelect = document.getElementById("hours");
  const roomNumberInput = document.getElementById("roomNumber");
  const roomDivs = document.querySelectorAll(".room");

  // API base URL
  const API_BASE_URL = "http://127.0.0.1:8000";

  // Remove the Room class as backend handles room creation

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

  // Fetch occupied rooms from backend
  const fetchOccupiedRooms = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          occupiedRooms = result.data; // Only active rooms
          occupiedRoomStatus();
        }
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const updateOccupiedRooms = async () => {
    // Refresh data from backend
    await fetchOccupiedRooms();
  };

  const createNewRoom = async (event) => {
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

    // Preparar datos para el POST request
    const roomData = {
      roomType: roomType,
      basePrice: basePriceValue,
      hours: hours,
      roomNumber: roomNumber,
      guestPlates: guestPlates,
      guestModel: guestModel,
      guestId: guestId,
    };

    try {
      // Hacer POST request al backend
      const response = await fetch(`${API_BASE_URL}/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Actualizar el estado desde el backend
        await updateOccupiedRooms();

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
      } else {
        // Manejar errores del servidor
        Toastify({
          text:
            result.message || result.detail || "Error al registrar habitación",
          duration: 5000,
          className: "error",
          gravity: "bottom",
          position: "right",
          style: {
            background: "#ff3399",
          },
        }).showToast();
      }
    } catch (error) {
      console.error("Error al crear habitación:", error);
      Toastify({
        text: "Error de conexión con el servidor",
        duration: 5000,
        className: "error",
        gravity: "bottom",
        position: "right",
        style: {
          background: "#ff3399",
        },
      }).showToast();
    }
  };

  document
    .querySelector("#createRoomForm")
    .addEventListener("submit", createNewRoom);

  const calculateEndTime = (startDateTime, hours) => {
    const [date, time] = startDateTime.split(", ");
    const [day, month, year] = date.split("/").map(Number);
    let [hour, minute] = time.split(":").map(Number);

    const startDate = new Date(year, month - 1, day, hour, minute);

    const endDate = new Date(startDate.getTime() + hours * 60 * 60 * 1000);

    const endDay = endDate.getDate().toString().padStart(2, "0");
    const endMonth = (endDate.getMonth() + 1).toString().padStart(2, "0");
    const endYear = endDate.getFullYear();
    const endHour = endDate.getHours().toString().padStart(2, "0");
    const endMinute = endDate.getMinutes().toString().padStart(2, "0");

    return `${endDay}/${endMonth}/${endYear}, ${endHour}:${endMinute}`;
  };

  const openActiveModal = (
    roomNumber,
    guestPlates,
    id,
    roomRegisterTime,
    hours,
    guestModel
  ) => {
    activeModal.style.display = "block";
    const $roomPlates = document.querySelector(".active-room-plates");
    const $roomId = document.querySelector(".active-room-id");
    const $roomIn = document.querySelector(".active-room-in");
    const $roomOut = document.querySelector(".active-room-out");
    const $roomNumber = document.querySelector(".active-room-info");
    const $roomTimeLeft = document.querySelector(".active-room-timeleft");
    const $roomModel = document.querySelector(".active-room-model");
    const $roomTime = document.querySelector(".active-room-time");

    const endTime = calculateEndTime(roomRegisterTime, hours);

    $roomNumber.textContent = `${roomNumber}`;
    $roomPlates.textContent = `Placas: ${guestPlates}`;
    $roomId.textContent = `ID: ${id}`;
    $roomIn.textContent = `Hora de Entrada: ${roomRegisterTime}`;
    $roomOut.textContent = ` Hora de Salida: ${endTime}`;
    $roomTimeLeft.textContent = `${hours} Horas`;
    $roomModel.textContent = `Modelo: ${guestModel}`;
    $roomTime.textContent = `Tiempo: ${hours} Horas`;

    // Add checkout functionality to existing button
    const roomData = occupiedRooms.find(
      (room) => room.roomNumber === roomNumber
    );
    if (roomData) {
      // Find the existing checkout button in the HTML
      const checkoutBtn = document.querySelector(".checkout-btn");

      // Remove any existing event listeners by cloning the element
      if (checkoutBtn) {
        const newCheckoutBtn = checkoutBtn.cloneNode(true);
        checkoutBtn.parentNode.replaceChild(newCheckoutBtn, checkoutBtn);

        // Add the checkout event listener
        newCheckoutBtn.addEventListener("click", (e) => {
          e.preventDefault();
          checkoutRoom(roomData.roomNumber);
        });
      }

      // Find the existing update room button in the HTML
      const updateRoomBtn = document.querySelector(".update-room");

      // Remove any existing event listeners by cloning the element
      if (updateRoomBtn) {
        const newUpdateRoomBtn = updateRoomBtn.cloneNode(true);
        updateRoomBtn.parentNode.replaceChild(newUpdateRoomBtn, updateRoomBtn);

        // Add the update room event listener
        newUpdateRoomBtn.addEventListener("click", (e) => {
          e.preventDefault();
          showChangeRoomModal(roomData.roomNumber);
        });
      }
    }
  };

  const checkoutRoom = async (roomNumber) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${roomNumber}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: false,
        }),
      });

      if (response.ok) {
        await updateOccupiedRooms();
        activeModal.style.display = "none";

        Toastify({
          text: `Habitación ${roomNumber} finalizada exitosamente`,
          duration: 3000,
          className: "info",
          gravity: "bottom",
          position: "right",
          style: {
            background: "#ff3399",
          },
        }).showToast();
      } else {
        const result = await response.json();
        Toastify({
          text: result.detail || "Error al realizar checkout",
          duration: 3000,
          className: "error",
          gravity: "bottom",
          position: "right",
          style: {
            background: "#ff3399",
          },
        }).showToast();
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      Toastify({
        text: "Error de conexión con el servidor",
        duration: 3000,
        className: "error",
        gravity: "bottom",
        position: "right",
        style: {
          background: "#ff3399",
        },
      }).showToast();
    }
  };

  const updateRoomNumber = async (roomNumber) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${roomNumber}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomNumber: "1",
        }),
      });

      if (response.ok) {
        await updateOccupiedRooms();
        activeModal.style.display = "none";

        Toastify({
          text: `Habitación ${roomNumber} cambiada a habitación 01 exitosamente`,
          duration: 5000,
          className: "info",
          gravity: "bottom",
          position: "right",
          style: {
            background: "#ff3399",
          },
        }).showToast();
      } else {
        const result = await response.json();
        Toastify({
          text: result.detail || "Error al cambiar habitación",
          duration: 3000,
          className: "error",
          gravity: "bottom",
          position: "right",
          style: {
            background: "#ff3399",
          },
        }).showToast();
      }
    } catch (error) {
      console.error("Error during room update:", error);
      Toastify({
        text: "Error de conexión con el servidor",
        duration: 3000,
        className: "error",
        gravity: "bottom",
        position: "right",
        style: {
          background: "#ff3399",
        },
      }).showToast();
    }
  };

  const openModal = (event) => {
    const roomElement = event.target;
    const roomNumber = roomElement.getAttribute("data-room");
    if (roomElement.classList.contains("active")) {
      // Find room data from occupiedRooms array (from backend)
      const roomData = occupiedRooms.find(
        (room) => room.roomNumber === roomNumber
      );
      const guestPlates = roomData ? roomData.guestPlates : "N/A";
      const id = roomData ? roomData.guestId : "N/A";
      const roomRegisterTime = roomData ? roomData.roomRegisterTime : "N/A";
      const hours = roomData ? roomData.hours : "N/A";
      const guestModel = roomData ? roomData.guestModel : "N/A";
      openActiveModal(
        roomNumber,
        guestPlates,
        id,
        roomRegisterTime,
        hours,
        guestModel
      );
    } else {
      const roomType = getRoomType(roomNumber);
      const roomRegisterTitle = document.querySelector(".room-register");
      roomRegisterTitle.textContent = `Habitación ${roomNumber} ${roomType}`;

      roomNumberInput.value = roomNumber;

      updateHours(roomType);
      modal.style.display = "block";
    }
  };

  roomDivs.forEach((room) => {
    room.addEventListener("click", openModal);
  });

  roomDivs.forEach((room) => {
    room.addEventListener("click", openModal);
  });

  const updateHours = (roomType) => {
    hoursSelect.innerHTML = "";
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
    activeModal.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target === modal || event.target === activeModal) {
      closeModalHandler();
    }
  };

  closeModalButtons.forEach((closeBtn) => {
    closeBtn.onclick = closeModalHandler;
  });

  const occupiedRoomStatus = () => {
    roomDivs.forEach((room) => room.classList.remove("active"));

    occupiedRooms.forEach((room) => {
      // Normalize room number to remove leading zeros
      const normalizedRoomNumber = parseInt(room.roomNumber, 10).toString();
      const roomElement = document.querySelector(
        `.room[data-room="${normalizedRoomNumber}"]`
      );
      if (roomElement) {
        roomElement.classList.add("active");
      }
    });
  };

  // Initial load of occupied rooms
  fetchOccupiedRooms();

  const endSessionButton = document.querySelector(".endSession");
  if (endSessionButton) {
    endSessionButton.addEventListener("click", () => {
      console.log("End session button clicked - functionality disabled");
    });
  }

  // Variables para el modal de cambio de habitación
  const changeRoomModal = document.getElementById("changeRoomModal");
  let currentRoomToChange = null;

  // Función para obtener habitaciones disponibles del mismo tipo
  const getAvailableRooms = async (currentRoomNumber) => {
    const currentRoomType = getRoomType(currentRoomNumber);
    const allRooms = [];

    // Generar lista de habitaciones según el tipo
    if (currentRoomType === "Jacuzzi") {
      // Solo habitaciones Jacuzzi (15, 16, 17, 18)
      jacuzziRooms.forEach((roomNum) => {
        if (roomNum.toString() !== currentRoomNumber) {
          allRooms.push(roomNum.toString());
        }
      });
    } else {
      // Solo habitaciones Sencillas (1-32 excluyendo Jacuzzi y 13 y 0)
      for (let i = 1; i <= 32; i++) {
        if (
          i === 13 ||
          jacuzziRooms.includes(i) ||
          i.toString() === currentRoomNumber
        )
          continue;
        allRooms.push(i.toString());
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/rooms`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const occupiedRoomNumbers = result.data.map((room) =>
            parseInt(room.roomNumber, 10).toString()
          );

          return allRooms.filter(
            (roomNum) => !occupiedRoomNumbers.includes(roomNum)
          );
        }
      }
    } catch (error) {
      console.error("Error fetching available rooms:", error);
    }
    return [];
  };

  // Función para mostrar el modal de cambio de habitación
  const showChangeRoomModal = async (currentRoomNumber) => {
    currentRoomToChange = currentRoomNumber;
    const currentRoomType = getRoomType(currentRoomNumber);
    const availableRooms = await getAvailableRooms(currentRoomNumber);

    const roomsGrid = document.querySelector(".available-rooms-grid");
    roomsGrid.innerHTML = "";

    // Crear título informativo
    const title = document.createElement("p");
    title.textContent = `Cambiar habitación ${currentRoomType} ${currentRoomNumber} a:`;
    title.style.cssText =
      "margin-bottom: 15px; font-weight: bold; text-align: center;";
    roomsGrid.appendChild(title);

    if (availableRooms.length === 0) {
      const noRoomsMsg = document.createElement("p");
      noRoomsMsg.textContent = `No hay habitaciones ${currentRoomType.toLowerCase()} disponibles`;
      noRoomsMsg.style.cssText = "text-align: center; color: #666;";
      roomsGrid.appendChild(noRoomsMsg);
    } else {
      // Crear select
      const selectContainer = document.createElement("div");
      selectContainer.style.cssText = "text-align: center; margin: 20px 0;";

      const select = document.createElement("select");
      select.id = "roomSelect";
      select.style.cssText = `
        padding: 10px 15px;
        font-size: 16px;
        border: 2px solid #ddd;
        border-radius: 5px;
        background: white;
        cursor: pointer;
        min-width: 200px;
      `;

      // Opción por defecto
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "Seleccionar habitación";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      select.appendChild(defaultOption);

      // Agregar opciones disponibles
      availableRooms.forEach((roomNum) => {
        const option = document.createElement("option");
        option.value = roomNum;
        option.textContent = `Habitación ${roomNum}`;
        select.appendChild(option);
      });

      selectContainer.appendChild(select);
      roomsGrid.appendChild(selectContainer);

      // Crear botón de confirmar
      const buttonContainer = document.createElement("div");
      buttonContainer.style.cssText = "text-align: center; margin-top: 20px;";

      const confirmBtn = document.createElement("button");
      confirmBtn.textContent = "Cambiar Habitación";
      confirmBtn.style.cssText = `
        padding: 10px 20px;
        background: #ff3399;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        margin-right: 10px;
      `;
      confirmBtn.disabled = true;

      // Habilitar botón cuando se seleccione una opción
      select.addEventListener("change", () => {
        confirmBtn.disabled = !select.value;
        confirmBtn.style.background = select.value ? "#ff3399" : "#ccc";
      });

      // Confirmar cambio
      confirmBtn.addEventListener("click", () => {
        if (select.value) {
          selectNewRoom(select.value);
        }
      });

      buttonContainer.appendChild(confirmBtn);
      roomsGrid.appendChild(buttonContainer);
    }

    changeRoomModal.style.display = "block";
  };

  // Función para seleccionar nueva habitación
  const selectNewRoom = async (newRoomNumber) => {
    if (!currentRoomToChange) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/rooms/${currentRoomToChange}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomNumber: newRoomNumber,
          }),
        }
      );

      if (response.ok) {
        await updateOccupiedRooms();
        changeRoomModal.style.display = "none";
        activeModal.style.display = "none";

        Toastify({
          text: `Habitación cambiada de ${currentRoomToChange} a ${newRoomNumber} exitosamente`,
          duration: 5000,
          className: "info",
          gravity: "bottom",
          position: "right",
          style: {
            background: "#ff3399",
          },
        }).showToast();
      } else {
        const result = await response.json();
        Toastify({
          text: result.detail || "Error al cambiar habitación",
          duration: 3000,
          className: "error",
          gravity: "bottom",
          position: "right",
          style: {
            background: "#ff3399",
          },
        }).showToast();
      }
    } catch (error) {
      console.error("Error changing room:", error);
      Toastify({
        text: "Error de conexión con el servidor",
        duration: 3000,
        className: "error",
        gravity: "bottom",
        position: "right",
        style: {
          background: "#ff3399",
        },
      }).showToast();
    }
  };

  // Event listeners para el modal de cambio de habitación
  const closeChangeModal = document.getElementById("closeChangeModal");

  if (closeChangeModal) {
    closeChangeModal.addEventListener("click", () => {
      changeRoomModal.style.display = "none";
    });
  }

  // Cerrar modal al hacer click fuera
  window.addEventListener("click", (event) => {
    if (event.target === changeRoomModal) {
      changeRoomModal.style.display = "none";
    }
  });
});
