import React, { useEffect, useState } from "react";
import { FaCarAlt, FaTachometerAlt, FaHourglassHalf, FaClock } from 'react-icons/fa'

function Estadisticas() {
  const [arrivalRate, setArrivalRate] = useState(0); // Tasa de llegada (Entradas)

  const [serviceRate, setServiceRate] = useState(0); // Tasa de servicio constante

  const [promedioEstancia, setPromedioEstancia] = useState(0); // Promedio de tiempo de estancia

  //Probabilidad ningun cliente
  const [p0_entry, setP0_entry] = useState(0);

  //Numero medio de clientes en el sistema
  const [L_entry, setL_entry] = useState(0);

  //Tasa efectiva de llegada
  const [lambda_entry, setLambda_entry] = useState(0);

  //Tiempo de estancia en el sistema
  const [W_entry, setW_entry] = useState(0);

  //Tiempo de espera en la cola
  const [Wq_entry, setWq_entry] = useState(0);

  //Tiempo en el servicio
  const [Ws_entry, setWs_entry] = useState(0);

  //Numero medio de clientes en la cola
  const [Lq_entry, setLq_entry] = useState(0);

  //Tasa de utilizacion del sistema
  const [p_entry, setP_entry] = useState(0);

  //K constante
  const k = 5;

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

        const today = new Date()
          .toLocaleDateString("es-GT", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .split("/")
          .reverse()
          .join("-");

        const totalEntries = entriesData.filter((entry) =>
          entry.fecha_hora.includes(today)
        ).length;

        // Dividir por 17 (horas de 5 AM a 10 PM)
        const avgEntries = totalEntries / 17;

        setArrivalRate(avgEntries); // Tasa de llegada

        //Calculamos tasa de servicio
        const promedioPermanencia = calcularPromedioPermanencia(
          entriesData,
          exitsData
        );
        console.log(promedioPermanencia);
        setPromedioEstancia(promedioPermanencia);
        const tasaDeServicio = calcularTasaDeServicio(promedioPermanencia);
        console.log(tasaDeServicio);
        setServiceRate(tasaDeServicio);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [serviceRate]);

  useEffect(() => {
    // Cálculos dependientes de arrivalRate y exitRate
    const p_entry = arrivalRate / serviceRate;

    const p0_entry = (1 - p_entry) / (1 - p_entry ** (serviceRate + 1));

    const L_entry =
      p_entry !== 1
        ? p_entry / (1 - p_entry) -
          ((k + 1) * p_entry ** (k + 1)) / (1 - p_entry ** (k + 1))
        : k / 2;

    const lambda_entry =
      arrivalRate *
      (1 - (p_entry ** k * (1 - p_entry)) / (1 - p_entry ** (k + 1)));

    const W_entry = L_entry / lambda_entry;

    const Wq_entry = W_entry - 1 / serviceRate;

    const Ws_entry = W_entry - Wq_entry;

    const Lq_entry = lambda_entry * Wq_entry;

    // Actualizar todos los estados necesarios
    setP_entry(p_entry);

    setP0_entry(p0_entry);

    setL_entry(L_entry);

    setLambda_entry(lambda_entry);

    setW_entry(W_entry);

    setWq_entry(Wq_entry);

    setWs_entry(Ws_entry);

    setLq_entry(Lq_entry);
  }, [arrivalRate, serviceRate, k]);

  function calcularPromedioPermanencia(entriesData, exitsData) {
    let totalTiempo = 0;
    let conteo = 0;

    entriesData.forEach((entry) => {
      // Buscar la salida correspondiente al carnet
      const salida = exitsData.find((exit) => exit.carnet === entry.carnet);

      if (salida) {
        const entradaHora = new Date(entry.fecha_hora);
        const salidaHora = new Date(salida.fecha_hora);

        // Calcular la diferencia en minutos
        const tiempoPermanencia = (salidaHora - entradaHora) / (1000 * 60); // Convertimos de milisegundos a minutos

        console.log(
          "auto",
          entry.carnet,
          "permaneció",
          tiempoPermanencia,
          "minutos"
        );
        totalTiempo += tiempoPermanencia;
        conteo++;
      }
    });

    // Promedio del tiempo de permanencia en minutos
    const promedioPermanencia = totalTiempo / conteo;
    return promedioPermanencia;
  }

  function calcularTasaDeServicio(promedioPermanencia) {
    const promedioEnHoras = promedioPermanencia / 60; // Convertimos de minutos a horas
    const capacidadParqueo = 5;

    // Tasa de servicio es el inverso del tiempo promedio, multiplicado por la capacidad
    const tasaDeServicio = capacidadParqueo / promedioEnHoras;
    return tasaDeServicio;
  }

  const calcularTiempoEstimadoSalida = () => {
    if (serviceRate === 0) return 0;
    return 1 / serviceRate; // Tiempo estimado en horas
  };

  return (
    <div className="p-10 bg-gray-100 rounded-lg shadow-2xl max-w-6xl mx-auto">
      <h2 className="text-5xl font-extrabold text-gray-800 mb-8 text-center">
        Estadísticas MM1K del Parqueo
      </h2>
      <div className="grid grid-cols-1 gap-8">
        {/* Sección de entradas */}
        <div className="bg-white p-8 rounded-xl shadow-xl transform transition duration-500 hover:scale-105">
          <h3 className="text-3xl font-bold text-gray-700 mb-6 flex items-center">
            <FaCarAlt className="text-blue-600 mr-3" />
            Parqueo
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <p className="text-lg text-gray-600 mb-3">
              <strong>Tasa de Llegada:</strong> {arrivalRate.toFixed(2)} autos/hora
            </p>
            <p className="text-lg text-gray-600 mb-3">
              <strong>Tasa de Servicio:</strong> {serviceRate.toFixed(2)} autos/hora
            </p>
            <p className="text-lg text-gray-600 mb-3">
              <strong>Probabilidad de que no haya autos:</strong> {(p0_entry * 100).toFixed(2)}%
            </p>
            <p className="text-lg text-gray-600 mb-3">
              <strong>Número medio de clientes en el sistema:</strong> {L_entry.toFixed(2)} autos
            </p>
            <p className="text-lg text-gray-600 mb-3">
              <strong>Tasa efectiva de llegada:</strong> {lambda_entry.toFixed(2)} autos/hora
            </p>
            <p className="text-lg text-gray-600 mb-3">
              <strong>Tiempo de estancia en el sistema:</strong> {W_entry.toFixed(2)} horas
            </p>
            <p className="text-lg text-gray-600 mb-3">
              <strong>Tiempo de espera en la cola:</strong> {Wq_entry.toFixed(2)} horas
            </p>
            <p className="text-lg text-gray-600 mb-3">
              <strong>Tiempo en el servicio:</strong> {Ws_entry.toFixed(2)} horas
            </p>
            <p className="text-lg text-gray-600 mb-3">
              <strong>Número medio de clientes en la cola:</strong> {Lq_entry.toFixed(2)} autos
            </p>
            <p className="text-lg text-gray-600 mb-3">
              <strong>Tasa de utilización del sistema:</strong> {(p_entry * 100).toFixed(2)}%
            </p>
          </div>
        </div>
        {/* Sección del promedio de estancia */}
        <div className="bg-white p-8 rounded-xl shadow-xl transform transition duration-500 hover:scale-105">
          <h3 className="text-3xl font-bold text-gray-700 mb-6 flex items-center">
            <FaHourglassHalf className="text-purple-600 mr-3" />
            Promedio de Estancia
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <p className="text-lg text-gray-600 mb-3">
              <strong>Tiempo promedio de estancia:</strong> {promedioEstancia.toFixed(2)} minutos
            </p>
            <p className="text-lg text-gray-600 mb-3">
              <strong>Tiempo estimado para la salida del próximo auto:</strong> {calcularTiempoEstimadoSalida().toFixed(2)} horas
            </p>
          </div>
        </div>
        {/* Sección de detalles del sistema */}
        <div className="bg-white p-8 rounded-xl shadow-xl transform transition duration-500 hover:scale-105">
          <h3 className="text-3xl font-bold text-gray-700 mb-6 flex items-center">
            <FaClock className="text-yellow-500 mr-3" />
            Detalles del Sistema MM1K
          </h3>
          <p className="text-lg text-gray-600">
            Con base en las tasas de llegada y salida calculadas, puedes ver los tiempos estimados de espera, servicio y estancia promedio.
          </p>
        </div>
      </div>
    </div>
  );
};


export default Estadisticas;
