const fetchData = async () => {
  try {
    const response = await fetch("./corteFake.json");
    if (!response.ok) {
      throw new Error(response.status);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

const renderCorte = async () => {
  const data = await fetchData();
  const $occupiedRoomsList = document.querySelector("#occupiedRoomsList");
  $occupiedRoomsList.innerHTML = "";
  data.map((room) => {
    $occupiedRoomsList.innerHTML += `
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
  });
};

renderCorte();
