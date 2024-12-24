const fetchData = async () => {
  try {
    const response = await fetch("../corteFake.json");
    if (!response.ok) {
      throw new Error(response.status);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }
};

const renderCorte = async () => {
  const data = await fetchData();
  const $occupiedRoomsList = document.querySelector("#occupiedRoomsList");
  $occupiedRoomsList.innerHTML = "";
  data.map(
    ({
      id = "",
      roomNumber = "",
      roomRegisterTime = "",
      guestPlates = "",
      roomType = "",
      totalPrice = 0,
    }) => {
      $occupiedRoomsList.innerHTML += `
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
    }
  );
};

renderCorte();
