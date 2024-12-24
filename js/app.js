document.addEventListener("DOMContentLoaded", () => {
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

    roomNumberInput.value = roomNumber;
    updateHours(roomType);
    modal.style.display = "block";
  };

  const updateHours = (roomType) => {
    hoursSelect.innerHTML = "";
    if (roomType === "Jacuzzi") {
      hoursSelect.innerHTML = '<option value="6">6</option>';
    } else {
      const hours = [6, 9, 12, 24];
      hours.map((hour) => {
        hoursSelect.innerHTML += `<option value="${hour}">${hour}</option>`;
      });
    }
  };

  const closeModalHandler = () => {
    modal.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target === modal) {
      closeModalHandler();
    }
  };

  roomDivs.map((room) => {
    room.addEventListener("click", openModal);
  });

  if (closeModal) {
    closeModal.onclick = closeModalHandler;
  }

  const occupiedRoomStatus = () => {
    roomDivs.map((room) => room.classList.remove("active"));

    occupiedRooms.map((room) => {
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
