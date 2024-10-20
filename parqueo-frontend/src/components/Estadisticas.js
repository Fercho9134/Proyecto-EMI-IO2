import React, { useEffect, useState } from "react";
import { FaCarAlt, FaClock, FaTachometerAlt } from "react-icons/fa"; // Íconos

function Estadisticas() {
  const [arrivalRate, setArrivalRate] = useState(0); // Tasa de llegada (Entradas)
  const [exitRate, setExitRate] = useState(0); // Tasa de salida
  const [serviceRate] = useState(60); // Tasa de servicio constante

  //Probabilidad ningun cliente
  const [p0_entry, setP0_entry] = useState(0);
  const [p0_exit, setP0_exit] = useState(0);

  //Numero medio de clientes en el sistema
  const [L_entry, setL_entry] = useState(0);
  const [L_exit, setL_exit] = useState(0);

  //Tasa efectiva de llegada
  const [lambda_entry, setLambda_entry] = useState(0);
  const [lambda_exit, setLambda_exit] = useState(0);

  //Tiempo de estancia en el sistema
  const [W_entry, setW_entry] = useState(0);
  const [W_exit, setW_exit] = useState(0);

  //Tiempo de espera en la cola
  const [Wq_entry, setWq_entry] = useState(0);
  const [Wq_exit, setWq_exit] = useState(0);

  //Tiempo en el servicio
  const [Ws_entry, setWs_entry] = useState(0);
  const [Ws_exit, setWs_exit] = useState(0);

  //Numero medio de clientes en la cola
  const [Lq_entry, setLq_entry] = useState(0);
  const [Lq_exit, setLq_exit] = useState(0);

  //Tasa de utilizacion del sistema
  const [p_entry, setP_entry] = useState(0);
  const [p_exit, setP_exit] = useState(0);

  //K constante
  const k = 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Datos de entradas y salidas
        const entriesData = [
          {
            accion: "Entró al parqueo",
            carnet: "ext",
            fecha_hora: "2024-10-20 05:45:47",
          },
          {
            accion: "Entró al parqueo",
            carnet: "4654",
            fecha_hora: "2024-10-20 05:46:08",
          },
          {
            accion: "Entró al parqueo",
            carnet: "4655",
            fecha_hora: "2024-10-20 06:47:08",
          },
          {
            accion: "Entró al parqueo",
            carnet: "4656",
            fecha_hora: "2024-10-20 06:48:08",
          },
          {
            accion: "Entró al parqueo",
            carnet: "4657",
            fecha_hora: "2024-10-20 06:55:08",
          },
          {
            accion: "Entró al parqueo",
            carnet: "4658",
            fecha_hora: "2024-10-20 08:46:08",
          },
          {
            accion: "Entró al parqueo",
            carnet: "4659",
            fecha_hora: "2024-10-20 08:47:08",
          },
          {
            accion: "Entró al parqueo",
            carnet: "4660",
            fecha_hora: "2024-10-20 08:46:08",
          },
          {
            accion: "Entró al parqueo",
            carnet: "4661",
            fecha_hora: "2024-10-20 12:46:08",
          },
          {
            accion: "Entró al parqueo",
            carnet: "4662",
            fecha_hora: "2024-10-20 12:55:08",
          },
        ];

        const exitsData = [
          {
            accion: "Salió del parqueo",
            carnet: "ext",
            fecha_hora: "2024-10-20 09:45:47",
          },
          {
            accion: "Salió del parqueo",
            carnet: "4654",
            fecha_hora: "2024-10-20 09:47:08",
          },
          {
            accion: "Salió del parqueo",
            carnet: "4655",
            fecha_hora: "2024-10-20 09:48:08",
          },
          {
            accion: "Salió del parqueo",
            carnet: "4656",
            fecha_hora: "2024-10-20 09:49:08",
          },
          {
            accion: "Salió del parqueo",
            carnet: "4657",
            fecha_hora: "2024-10-20 10:50:08",
          },
          {
            accion: "Salió del parqueo",
            carnet: "4658",
            fecha_hora: "2024-10-20 11:55:08",
          },
          {
            accion: "Salió del parqueo",
            carnet: "4659",
            fecha_hora: "2024-10-20 11:56:08",
          },
          {
            accion: "Salió del parqueo",
            carnet: "4660",
            fecha_hora: "2024-10-20 12:46:08",
          },
          {
            accion: "Salió del parqueo",
            carnet: "4661",
            fecha_hora: "2024-10-20 19:46:08",
          },
          {
            accion: "Salió del parqueo",
            carnet: "4662",
            fecha_hora: "2024-10-20 19:46:08",
          },
        ];

        // Contar total de entradas y salidas del día actual
        //Primero se filtran las entradas y salidas del día actual y luego se cuentan
        const today = new Date().toISOString().split("T")[0];
        const totalEntries = entriesData.filter((entry) =>
          entry.fecha_hora.includes(today)
        ).length;
        const totalExits = exitsData.filter((exit) =>
          exit.fecha_hora.includes(today)
        ).length;

        // Dividir por 17 (horas de 5 AM a 10 PM)
        const avgEntries = totalEntries / 17;
        const avgExits = totalExits / 17;

        setArrivalRate(avgEntries); // Tasa de llegada
        setExitRate(avgExits); // Tasa de salida
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [serviceRate]);

  useEffect(() => {
    // Cálculos dependientes de arrivalRate y exitRate
    const p_entry = arrivalRate / serviceRate;
    const p_exit = exitRate / serviceRate;

    const p0_entry = (1 - p_entry) / (1 - p_entry ** (serviceRate + 1));
    const p0_exit = (1 - p_exit) / (1 - p_exit ** (serviceRate + 1));

    const L_entry =
      p_entry !== 1
        ? p_entry / (1 - p_entry) -
          ((k + 1) * p_entry ** (k + 1)) / (1 - p_entry ** (k + 1))
        : k / 2;

    const L_exit =
      p_exit !== 1
        ? p_exit / (1 - p_exit) -
          ((k + 1) * p_exit ** (k + 1)) / (1 - p_exit ** (k + 1))
        : k / 2;

    const lambda_entry =
      arrivalRate *
      (1 - (p_entry ** k * (1 - p_entry)) / (1 - p_entry ** (k + 1)));

    const lambda_exit =
      exitRate * (1 - (p_exit ** k * (1 - p_exit)) / (1 - p_exit ** (k + 1)));

    const W_entry = L_entry / lambda_entry;
    const W_exit = L_exit / lambda_exit;

    const Wq_entry = W_entry - 1 / serviceRate;
    const Wq_exit = W_exit - 1 / serviceRate;

    const Ws_entry = W_entry - Wq_entry;
    const Ws_exit = W_exit - Wq_exit;

    const Lq_entry = lambda_entry * Wq_entry;
    const Lq_exit = lambda_exit * Wq_exit;

    // Actualizar todos los estados necesarios
    setP_entry(p_entry);
    setP_exit(p_exit);
    setP0_entry(p0_entry);
    setP0_exit(p0_exit);
    setL_entry(L_entry);
    setL_exit(L_exit);
    setLambda_entry(lambda_entry);
    setLambda_exit(lambda_exit);
    setW_entry(W_entry);
    setW_exit(W_exit);
    setWq_entry(Wq_entry);
    setWq_exit(Wq_exit);
    setWs_entry(Ws_entry);
    setWs_exit(Ws_exit);
    setLq_entry(Lq_entry);
    setLq_exit(Lq_exit);
  }, [arrivalRate, exitRate, serviceRate, k]);

  return (
    <div className="p-8 bg-gray-50 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        Estadísticas MM1K del Parqueo
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sección de entradas */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold text-gray-700">
              <FaCarAlt className="inline-block text-blue-600 mr-2" />
              Entradas
            </h3>
            <FaTachometerAlt className="text-gray-500 text-3xl" />
          </div>
          <p className="text-lg text-gray-600 mb-2">
            <strong>Tasa de Llegada:</strong> {arrivalRate.toFixed(2)}{" "}
            autos/hora
          </p>
          <p className="text-lg text-gray-600 mb-2">
            <strong>Tasa de servicio:</strong> {serviceRate.toFixed(2)}{" "}
            autos/hora
          </p>
          <p className="text-lg text-gray-600 mb-2">
            <strong>Tasa de utilizacion ρ</strong> {(p_entry*100).toFixed(2)}%
          </p>
          <p className="text-lg text-gray-600 mb-2">
            <strong>Probabilidad de que el sistema este vacío p0:</strong>{" "}
            {(p0_entry*100).toFixed(2)}%
          </p>
          <p className="text-lg text-gray-600 mb-2">
            <strong>Numero medio de clientes en el sistema L:</strong>{" "}
            {L_entry.toFixed(2)} autos
          </p>
          <p className="text-lg text-gray-600 mb-2">
            <strong>Tasa efectiva de llegada λ:</strong>{" "}
            {lambda_entry.toFixed(2)} autos/hora
          </p>
          <p className="text-lg text-gray-600 mb-2">
            <strong>Tiempo de estancia en el sistema W:</strong>{" "}
            {W_entry.toFixed(2)} horas - {W_entry.toFixed(2) * 60} minutos
          </p>
          <p className="text-lg text-gray-600 mb-2">
            <strong>Tiempo de espera en la cola Wq:</strong>{" "}
            {Wq_entry.toFixed(2)} horas - {Wq_entry.toFixed(2) * 60} minutos
          </p>
          <p className="text-lg text-gray-600 mb-2">
            <strong>Tiempo en el servicio Ws:</strong> {Ws_entry.toFixed(2)}{" "}
            horas - {Ws_entry.toFixed(2) * 60} minutos
          </p>
          <p className="text-lg text-gray-600 mb-2">
            <strong>Numero medio de clientes en la cola Lq:</strong>{" "}
            {Lq_entry.toFixed(2)} autos
          </p>
        </div>

        {/* Sección de salidas */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold text-gray-700">
              <FaCarAlt className="inline-block text-green-600 mr-2" />
              Salidas
            </h3>
            <FaTachometerAlt className="text-gray-500 text-3xl" />
          </div>
          <p className="text-lg text-gray-600 mb-2">
            <strong>Tasa de Llegada:</strong> {exitRate.toFixed(2)} autos/hora
          </p>
          <p className="text-lg text-gray-600 mb-2">
            <strong>Tasa de servicio:</strong> {serviceRate.toFixed(2)}{" "}
            autos/hora
          </p>
          <p className="text-lg text-gray-600 mb-2">
            <strong>Tasa de utilizacion ρ</strong> {(p_exit*100).toFixed(2)}%
          </p>
          <p className="text-lg text-gray-600 mb-2">
            <strong>Probabilidad de que el sistema este vacío p0:</strong>{" "}
            {(p0_exit*100).toFixed(2)}%
          </p>
          <p className="text-lg text-gray-600 mb-2">
            <strong>Numero medio de clientes en el sistema L:</strong>{" "}
            {L_exit.toFixed(2)} autos
          </p>
          <p className="text-lg text-gray-600 mb-2">
            <strong>Tasa efectiva de llegada λ:</strong>{" "}
            {lambda_exit.toFixed(2)} autos/hora
          </p>
          <p className="text-lg text-gray-600 mb-2">
            <strong>Tiempo de estancia en el sistema W:</strong>{" "}
            {W_exit.toFixed(2)} horas - {W_entry.toFixed(2) * 60} minutos
          </p>
          <p className="text-lg text-gray-600 mb-2">
            <strong>Tiempo de espera en la cola Wq:</strong>{" "}
            {Wq_exit.toFixed(2)} horas - {Wq_entry.toFixed(2) * 60} minutos
          </p>
          <p className="text-lg text-gray-600 mb-2">
            <strong>Tiempo en el servicio Ws:</strong> {Ws_exit.toFixed(2)}{" "}
            horas - {Ws_entry.toFixed(2) * 60} minutos
          </p>
          <p className="text-lg text-gray-600 mb-2">
            <strong>Numero medio de clientes en la cola Lq:</strong>{" "}
            {Lq_exit.toFixed(2)} autos
          </p>
        </div>
      </div>

      <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
        <h4 className="text-xl font-semibold text-gray-700 flex items-center">
          <FaClock className="text-yellow-500 mr-2" />
          Detalles del Sistema MM1K
        </h4>
        <p className="text-lg text-gray-600 mt-4">
          Con base en las tasas de llegada y salida calculadas para las entradas
          y salidas del parqueo, puedes ver los tiempos estimados de espera y
          servicio para ambos casos. Estos cálculos se basan en un modelo MM1K
          con una tasa de servicio constante de 60 autos por hora.
        </p>
      </div>
    </div>
  );
}

export default Estadisticas;
