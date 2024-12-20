// Recuperar las habitaciones ocupadas desde localStorage
const occupiedRooms = JSON.parse(localStorage.getItem("occupiedRooms")) || [];

// Función para calcular el balance total
function calculateTotalBalance(rooms) {
  return rooms
    .reduce((sum, room) => sum + room.totalPrice, 0)
    .toLocaleString("es-MX", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
}

// Función para crear una fila de habitación
function createRoomRow(room) {
  return `
    <tr>
      <td>${room.id}</td>
      <td>${room.roomNumber}</td>
      <td>${room.roomRegisterTime}</td>
      <td>${room.guestPlates}</td>
      <td>${room.roomType}</td>
      <td>${room.totalPrice.toLocaleString("es-MX", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}</td>
    </tr>
  `;
}

// Función para renderizar las habitaciones ocupadas en la tabla
function renderOccupiedRooms() {
  const occupiedRoomsList = document.getElementById("occupiedRoomsList");
  const finalBalanceElement = document.getElementById("finalBalance");

  // Limpiar la tabla antes de agregar las filas
  occupiedRoomsList.innerHTML = "";

  // Calcular el balance total
  const sumTotalPrice = calculateTotalBalance(occupiedRooms);

  // Actualizar el balance final fuera de la tabla
  finalBalanceElement.textContent = `Balance Final: $${sumTotalPrice}`;

  // Iterar sobre las habitaciones ocupadas y crear una fila para cada una
  occupiedRooms.forEach((room) => {
    occupiedRoomsList.innerHTML += createRoomRow(room);
  });
}

// Inicializar la vista al cargar la página
document.addEventListener("DOMContentLoaded", renderOccupiedRooms);
