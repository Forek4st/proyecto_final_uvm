const occupiedRooms = JSON.parse(localStorage.getItem("occupiedRooms")) || [];

const calculateTotalBalance = (rooms) =>
  rooms
    .reduce((sum, room) => sum + room.totalPrice, 0)
    .toLocaleString("es-MX", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

const createRoomRow = ({
  id = "",
  roomNumber = "",
  roomRegisterTime = "",
  guestPlates = "",
  roomType = "",
  totalPrice = 0,
} = {}) => `
  <tr>
    <td>${id}</td>
    <td>${roomNumber}</td>
    <td>${roomRegisterTime}</td>
    <td>${guestPlates}</td>
    <td>${roomType}</td>
    <td>${totalPrice.toLocaleString("es-MX", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}</td>
  </tr>
`;

const renderOccupiedRooms = () => {
  const occupiedRoomsList = document.getElementById("occupiedRoomsList");
  const finalBalanceElement = document.getElementById("finalBalance");

  occupiedRoomsList.innerHTML = "";

  const sumTotalPrice = calculateTotalBalance(occupiedRooms);

  finalBalanceElement.textContent = `Balance Final: $${sumTotalPrice}`;

  occupiedRooms.forEach((room) => {
    occupiedRoomsList.innerHTML += createRoomRow(room);
  });
};

document.addEventListener("DOMContentLoaded", renderOccupiedRooms);
