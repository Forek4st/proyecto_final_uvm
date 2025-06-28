const apiUrl = "http://127.0.0.1:8000/rooms/history";

const fetchData = async () => {
  try {
    // Agregar timestamp para evitar caché
    const timestamp = new Date().getTime();
    const urlWithCacheBuster = `${apiUrl}?_t=${timestamp}`;

    const response = await fetch(urlWithCacheBuster, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Rooms data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};

// Función para cargar y mostrar los datos cuando se carga la página
const loadRoomsData = async () => {
  try {
    const responseData = await fetchData();

    // Verificar que la respuesta sea exitosa y tenga datos
    if (responseData.success && responseData.data) {
      // Mostrar notificación de éxito
      Toastify({
        text: "Datos cargados correctamente",
        duration: 3000,
        gravity: "bottom",
        position: "right",
        style: {
          background: "#00b09b",
        },
      }).showToast();

      // Pasar solo el array de datos a la función
      updateRoomsTable(responseData.data);
    } else {
      throw new Error("No se encontraron datos válidos");
    }
  } catch (error) {
    // Mostrar notificación de error
    Toastify({
      text: "Error de conexión con el servidor",
      duration: 3000,
      gravity: "bottom",
      position: "right",
      style: {
        background: "#ff3399",
      },
    }).showToast();
  }
};

// Función para actualizar la tabla con los datos
const updateRoomsTable = (rooms) => {
  const tableBody = document.getElementById("occupiedRoomsList");
  if (tableBody && rooms) {
    // Limpiar tabla
    tableBody.innerHTML = "";

    // Agregar filas con los datos
    rooms.forEach((room) => {
      const row = tableBody.insertRow();
      // Agregar clase CSS basada en el estado
      row.className = room.isActive ? "room-active" : "room-inactive";

      row.innerHTML = `
        <td>${room.id || "N/A"}</td>
        <td>${room.roomNumber || "N/A"}</td>
        <td>${room.roomRegisterTime || "N/A"}</td>
        <td>${room.guestPlates || "N/A"}</td>
        <td>${room.roomType || "N/A"}</td>
        <td>$${room.totalPrice || "N/A"}</td>
       
      `;
    });
  }
};

// Cargar datos cuando se carga la página
document.addEventListener("DOMContentLoaded", loadRoomsData);
