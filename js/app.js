document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("roomModal");
  const activeModal = document.getElementById("activeRoomModal");
  const closeModalButtons = document.querySelectorAll(".close");
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
      roomType = "",
      basePrice = 0,
      hours = 0,
      roomNumber = "",
      guestPlates = "",
      guestModel = "",
      guestId = ""
    ) {
      this.id = Room.id++;
      this.roomType = roomType;
      this.basePrice = basePrice;
      this.hours = hours;
      this.roomNumber = roomNumber;
      this.guestPlates = guestPlates;
      this.guestModel = guestModel;
      this.guestId = guestId.toUpperCase();
      this.roomRegisterTime = new Date().toLocaleString("es-MX", {
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
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
  };

  const openModal = (event) => {
    const roomElement = event.target;
    const roomNumber = roomElement.getAttribute("data-room");
    if (roomElement.classList.contains("active")) {
      const occupiedRooms =
        JSON.parse(localStorage.getItem("occupiedRooms")) || [];
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

  const endSessionButton = document.querySelector(".endSession");
  if (endSessionButton) {
    endSessionButton.addEventListener("click", clearLocalStorage);
  }
});
