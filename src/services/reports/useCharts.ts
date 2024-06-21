import { useCallback, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

// RANKING COMIDAS MÁS PEDIDAS
export const useRanking = () => {
  const [dataRanking, setDataRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const token = localStorage.getItem("token");
  // Obtener la fecha actual y la fecha de hace una semana
  const hoy = new Date();
  const unaSemanaAtras = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);

  const formatearFecha = (fecha: Date) => {
    return fecha.toISOString().split("T")[0];
  };

  const [fechaDesde, setFechaDesde] = useState<string>(
    formatearFecha(unaSemanaAtras)
  );
  const [fechaHasta, setFechaHasta] = useState<string>(formatearFecha(hoy));

  const fetchRanking = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/articulo-manufacturado/dataMasPedidos?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error al obtener los datos.");
      }
      const data = await response.json();
      setDataRanking(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [fechaDesde, fechaHasta, token]);

  useEffect(() => {
    fetchRanking();
  }, [fetchRanking]);

  const updateFechas = (nuevaFechaDesde: string, nuevaFechaHasta: string) => {
    setFechaDesde(nuevaFechaDesde);
    setFechaHasta(nuevaFechaHasta);
  };

  return {
    dataRanking,
    loading,
    updateFechas,
    refetch: fetchRanking,
    fechaDesde,
    fechaHasta,
  };
};

// GRÁFICO DE LÍNEAS INGRESOS MENSUALES
export const useChartLine = (
  initialMes: number = new Date().getMonth() + 1
) => {
  const [dataLine, setDataLine] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mes, setMes] = useState(initialMes);
  const token = localStorage.getItem("token");

  const fetchChartLine = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/pedido/dataIngresosMensuales?mes=${mes}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error al obtener los datos.");
      }
      const data = await response.json();
      setDataLine(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [mes, token]);

  useEffect(() => {
    fetchChartLine();
  }, [fetchChartLine]);

  return { dataLine, loading, setMes, refetch: fetchChartLine };
};

// GRÁFICO DE TRES COLUMNAS GANANCIAS
export const useChartColumn = () => {
  const [dataColumn, setDataColumn] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const token = localStorage.getItem("token");

  // Obtener la fecha actual y la fecha de hace una semana
  const hoy = new Date();
  const unaSemanaAtras = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);

  const formatearFecha = (fecha: Date) => {
    return fecha.toISOString().split("T")[0];
  };

  const [fechaDesde, setFechaDesde] = useState<string>(
    formatearFecha(unaSemanaAtras)
  );
  const [fechaHasta, setFechaHasta] = useState<string>(formatearFecha(hoy));

  const fetchChartColumn = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/pedido/dataGanancias?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error al obtener los datos.");
      }
      const data = await response.json();
      setDataColumn(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [fechaDesde, fechaHasta, token]);

  useEffect(() => {
    fetchChartColumn();
  }, [fetchChartColumn]);

  const updateFechas = (nuevaFechaDesde: string, nuevaFechaHasta: string) => {
    setFechaDesde(nuevaFechaDesde);
    setFechaHasta(nuevaFechaHasta);
  };

  return {
    dataColumn,
    loading,
    updateFechas,
    refetch: fetchChartColumn,
    fechaDesde,
    fechaHasta,
  };
};

// GRÁFICO DE BARRAS PEDIDOS POR CLIENTE
export const useChartBar = () => {
  const [dataBar, setDataBar] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const token = localStorage.getItem("token");

  // Obtener la fecha actual y la fecha de hace una semana
  const hoy = new Date();
  const unaSemanaAtras = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);

  const formatearFecha = (fecha: Date) => {
    return fecha.toISOString().split("T")[0];
  };

  const [fechaDesde, setFechaDesde] = useState<string>(
    formatearFecha(unaSemanaAtras)
  );
  const [fechaHasta, setFechaHasta] = useState<string>(formatearFecha(hoy));

  const fetchChartBar = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/pedido/dataPedidosPorCliente?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error al obtener los datos.");
      }
      const data = await response.json();
      setDataBar(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [fechaDesde, fechaHasta, token]);

  useEffect(() => {
    fetchChartBar();
  }, [fetchChartBar]);

  const updateFechas = (nuevaFechaDesde: string, nuevaFechaHasta: string) => {
    setFechaDesde(nuevaFechaDesde);
    setFechaHasta(nuevaFechaHasta);
  };

  return {
    dataBar,
    loading,
    updateFechas,
    refetch: fetchChartBar,
    fechaDesde,
    fechaHasta,
  };
};
