import React, { useEffect, useState } from "react";
import { FaCar, FaSearch, FaCalendarAlt } from "react-icons/fa";

function Historial() {
  const [currentTime, setCurrentTime] = useState("");
  const [records, setRecords] = useState([]);
  const [visibleRecords, setVisibleRecords] = useState(10);
  const [filterCarnet, setFilterCarnet] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    // Actualizar la hora actual
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };

    const interval = setInterval(updateTime, 60000);
    updateTime(); // Llamada inicial
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const entriesData = [
          { accion: "Entró al parqueo", carnet: "ext", fecha_hora: "2024-10-20 05:45:47" },
          { accion: "Entró al parqueo", carnet: "4654", fecha_hora: "2024-10-20 05:46:08" },
          { accion: "Entró al parqueo", carnet: "4655", fecha_hora: "2024-10-20 06:47:08" },
          { accion: "Entró al parqueo", carnet: "4656", fecha_hora: "2024-10-20 06:48:08" },
          { accion: "Entró al parqueo", carnet: "4657", fecha_hora: "2024-10-20 06:55:08" },
          { accion: "Entró al parqueo", carnet: "4658", fecha_hora: "2024-10-20 08:46:08" },
          { accion: "Entró al parqueo", carnet: "4659", fecha_hora: "2024-10-20 08:47:08" },
          { accion: "Entró al parqueo", carnet: "4660", fecha_hora: "2024-10-20 08:46:08" },
          { accion: "Entró al parqueo", carnet: "4661", fecha_hora: "2024-10-20 12:46:08" },
          { accion: "Entró al parqueo", carnet: "4662", fecha_hora: "2024-10-20 12:55:08" },
        ];

        const exitsData = [
          { accion: "Salió del parqueo", carnet: "ext", fecha_hora: "2024-10-20 09:45:47" },
          { accion: "Salió del parqueo", carnet: "4654", fecha_hora: "2024-10-20 09:47:08" },
          { accion: "Salió del parqueo", carnet: "4655", fecha_hora: "2024-10-20 09:48:08" },
          { accion: "Salió del parqueo", carnet: "4656", fecha_hora: "2024-10-20 09:49:08" },
          { accion: "Salió del parqueo", carnet: "4657", fecha_hora: "2024-10-20 10:50:08" },
          { accion: "Salió del parqueo", carnet: "4658", fecha_hora: "2024-10-20 11:55:08" },
          { accion: "Salió del parqueo", carnet: "4659", fecha_hora: "2024-10-20 11:56:08" },
          { accion: "Salió del parqueo", carnet: "4660", fecha_hora: "2024-10-20 12:46:08" },
          { accion: "Salió del parqueo", carnet: "4661", fecha_hora: "2024-10-20 19:46:08" },
          { accion: "Salió del parqueo", carnet: "4662", fecha_hora: "2024-10-20 19:46:08" },
        ];

        // Combinar entradas y salidas en un solo registro
        const combinedRecords = [
          ...entriesData.map(entry => ({ ...entry, type: "entrada" })),
          ...exitsData.map(exit => ({ ...exit, type: "salida" })),
        ];

        // Ordenar los registros por fecha y hora
        combinedRecords.sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora));

        setRecords(combinedRecords);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredRecords = records.filter((record) => {
    return (
      (filterCarnet ? record.carnet.includes(filterCarnet) : true) &&
      (filterDate ? record.fecha_hora.startsWith(filterDate) : true)
    );
  }).slice(0, visibleRecords);

  const handleLoadMore = () => {
    setVisibleRecords((prev) => prev + 10);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Historial de entradas y salidas
      </h2>

      <div className="mb-4 p-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-lg text-white text-center">
        <span className="text-2xl font-semibold">Hora actual:</span>
        <div className="text-5xl font-bold">{currentTime}</div>
      </div>

      <div className="flex items-center mb-4">
        <div className="relative w-full max-w-xs">
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por carnet..."
            value={filterCarnet}
            onChange={(e) => setFilterCarnet(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="relative w-full max-w-xs ml-4">
          <FaCalendarAlt className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
        {filteredRecords.map((record, index) => (
          <div key={index} className={`flex justify-between items-center border-b pb-2 mb-2 p-2 rounded-lg ${record.type === "entrada" ? "bg-green-100" : "bg-red-100"}`}>
            <div className="flex items-center">
              <FaCar className={`mr-2 ${record.type === "entrada" ? "text-green-600" : "text-red-600"}`} />
              <span className={`font-semibold ${record.type === "entrada" ? "text-green-800" : "text-red-800"}`}>{record.accion}</span>
            </div>
            <span className="text-gray-500">{record.carnet}</span>
            <span className="text-gray-600 font-semibold">
              {new Date(record.fecha_hora).toLocaleString("es-GT", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </span>
          </div>
        ))}
      </div>

      {filteredRecords.length < records.length && (
        <button
          onClick={handleLoadMore}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition duration-200"
        >
          Cargar más
        </button>
      )}
    </div>
  );
}

export default Historial;
