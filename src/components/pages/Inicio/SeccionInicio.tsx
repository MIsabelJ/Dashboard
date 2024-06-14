import { useState } from "react";
import {
  useRanking,
  useChartLine,
  useChartColumn,
  useChartBar,
} from "../../../services/reports/useCharts";
import { Chart } from "react-google-charts";
import {
  ErrorState,
  generarExcelMasVendidos,
  generarExcelIngresosDiarios,
  generarExcelIngresosMensuales,
  generarExcelGanancias,
  generarExcelPedidosPorCliente,
} from "../../../services/reports/excelGenerators";
// ---------- ESTILOS ----------
import "./SeccionInicio.css";
import { Loader } from "../../ui/Loader/Loader";
import { IconButton, Tooltip } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export const SeccionInicio = () => {
  // -------------------- STATES --------------------
  const [error, setError] = useState<ErrorState>({});
  // Ranking de Comidas
  const {
    dataRanking,
    loading: loadingRanking,
    updateFechas: updateFechasRanking,
    fechaDesde: fechaDesdeRanking,
    fechaHasta: fechaHastaRanking,
  } = useRanking();
  const [fechaDesdeRankingLocal, setFechaDesdeRankingLocal] =
    useState(fechaDesdeRanking);
  const [fechaHastaRankingLocal, setFechaHastaRankingLocal] =
    useState(fechaHastaRanking);

  // Gráfico de Ingresos
  const [dia, setDia] = useState(new Date().toISOString().slice(0, 10));
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const { dataLine, loading: loadingChart } = useChartLine(mes);

  // Gráfico de Ganancias
  const {
    dataColumn,
    loading: loadingColumnChart,
    updateFechas: updateFechasGanancias,
    fechaDesde: fechaDesdeGanancias,
    fechaHasta: fechaHastaGanancias,
  } = useChartColumn();
  const [fechaDesdeGananciasLocal, setFechaDesdeGananciasLocal] =
    useState(fechaDesdeGanancias);
  const [fechaHastaGananciasLocal, setFechaHastaGananciasLocal] =
    useState(fechaHastaGanancias);

  // Gráfico de Barras Horizontales de Pedidos por Cliente
  const {
    dataBar,
    loading: loadingBarChart,
    updateFechas: updateFechasPedidos,
    fechaDesde: fechaDesdePedidos,
    fechaHasta: fechaHastaPedidos,
  } = useChartBar();
  const [fechaDesdePedidosLocal, setFechaDesdePedidosLocal] =
    useState(fechaDesdePedidos);
  const [fechaHastaPedidosLocal, setFechaHastaPedidosLocal] =
    useState(fechaHastaPedidos);

  // -------------------- HANDLERS --------------------
  const handleSubmitRanking = (e) => {
    e.preventDefault();
    updateFechasRanking(fechaDesdeRankingLocal, fechaHastaRankingLocal);
  };

  const handleSubmitGanancias = (e) => {
    e.preventDefault();
    updateFechasGanancias(fechaDesdeGananciasLocal, fechaHastaGananciasLocal);
  };

  const handleSubmitPedidos = (e) => {
    e.preventDefault();
    updateFechasPedidos(fechaDesdePedidosLocal, fechaHastaPedidosLocal);
  };

  const handleDiaChange = (e) => {
    setDia(e.target.value);
  };

  const handleMesChange = (e) => {
    setMes(parseInt(e.target.value));
  };

  // GENERACIÓN DE EXCEL
  const handleGenerarExcelMasVendidos = () => {
    generarExcelMasVendidos(
      fechaDesdeRankingLocal,
      fechaHastaRankingLocal,
      setError
    );
  };

  const handleGenerarExcelIngresosDiarios = () => {
    generarExcelIngresosDiarios(dia, setError);
  };

  const handleGenerarExcelIngresosMensuales = () => {
    generarExcelIngresosMensuales(mes, setError);
  };

  const handleGenerarExcelGanancias = () => {
    generarExcelGanancias(fechaDesdeGanancias, fechaHastaGanancias, setError);
  };

  const handleGenerarExcelPedidosPorCliente = () => {
    generarExcelPedidosPorCliente(
      fechaDesdePedidos,
      fechaHastaPedidos,
      setError
    );
  };

  // -------------------- GRÁFICOS --------------------
  const optionsLineChart = {
    title: "Ingresos Mensuales",
    curveType: "function",
    legend: { position: "bottom" },
    hAxis: { title: "Fecha" },
    vAxis: { title: "Recaudación ($)" },
  };

  const optionsColumnChart = {
    chart: {
      title: "Ganancias de la Empresa",
      subtitle: "Ingresos, Costos y Ganancias",
    },
    hAxis: { title: "Fecha" },
    vAxis: { title: "Monto ($)" },
  };

  const optionsBarChart = {
    title: "Pedidos por Cliente",
    chartArea: { width: "50%" },
    hAxis: {
      title: "Cantidad de Pedidos",
      minValue: 0,
    },
    vAxis: {
      title: "Cliente",
    },
  };

  // Eliminamos el primer elemento que contiene los encabezados
  const rankingData = dataRanking.slice(1);

  if (loadingRanking || loadingChart || loadingColumnChart) {
    return <Loader />;
  }

  // -------------------- RENDER --------------------
  return (
    <div className="charts">
      <h1>Estadísticas</h1>
      <div id="chart-container">
        {/* Sección de Ranking de Comidas */}
        <section className="box">
          <h2>Ranking de Comidas Más Pedidas</h2>
          <form onSubmit={handleSubmitRanking}>
            <div className="date-range">
              <label>
                Desde:
                <input
                  type="date"
                  value={fechaDesdeRankingLocal}
                  onChange={(e) => setFechaDesdeRankingLocal(e.target.value)}
                />
              </label>
              <label>
                Hasta:
                <input
                  type="date"
                  value={fechaHastaRankingLocal}
                  onChange={(e) => setFechaHastaRankingLocal(e.target.value)}
                />
              </label>
              {/* <button type="submit" className="update-button">
                Actualizar
              </button> */}
              <Tooltip title="Actualizar fecha" arrow placement="top">
                <IconButton type="submit">
                  <SendIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Descargar reporte" arrow placement="top">
                <IconButton onClick={handleGenerarExcelMasVendidos}>
                  <img
                    src="excel.png"
                    width={"32px"}
                    height={"32px"}
                    alt="Excel"
                  />
                </IconButton>
              </Tooltip>
            </div>
          </form>
          {(error.fechaDesde || error.fechaHasta) && (
            <p className="error">Por favor, seleccione ambas fechas.</p>
          )}

          {loadingRanking ? (
            <p>Cargando ranking...</p>
          ) : rankingData.length > 0 ? (
            <ul className="ul-ranking">
              {rankingData.map((item, index) => (
                <li key={index} className="li-ranking">
                  {item[1]}: {item[0]} pedidos
                </li>
              ))}
            </ul>
          ) : (
            <p>
              No hay datos disponibles para el rango de fechas seleccionado.
            </p>
          )}
        </section>

        {/* Sección de Gráfico de Ganancias */}
        <section className="box">
          <h2>Ganancias</h2>
          <form onSubmit={handleSubmitGanancias}>
            <div className="date-range">
              <label>
                Desde:
                <input
                  type="date"
                  value={fechaDesdeGananciasLocal}
                  onChange={(e) => setFechaDesdeGananciasLocal(e.target.value)}
                />
              </label>
              <label>
                Hasta:
                <input
                  type="date"
                  value={fechaHastaGananciasLocal}
                  onChange={(e) => setFechaHastaGananciasLocal(e.target.value)}
                />
              </label>
              <Tooltip title="Actualizar fecha" arrow placement="top">
                <IconButton type="submit">
                  <SendIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Descargar reporte" arrow placement="top">
                <IconButton onClick={handleGenerarExcelGanancias}>
                  <img
                    src="excel.png"
                    width={"32px"}
                    height={"32px"}
                    alt="Excel"
                  />
                </IconButton>
              </Tooltip>
              {(error.fechaDesde || error.fechaHasta) && (
                <p className="error">Por favor, seleccione ambas fechas.</p>
              )}
            </div>
          </form>

          {loadingColumnChart ? (
            <p>Cargando gráfico de ganancias...</p>
          ) : dataColumn.length > 1 ? (
            <Chart
              chartType="Bar"
              width="100%"
              height="400px"
              data={dataColumn}
              options={optionsColumnChart}
            />
          ) : (
            <p>
              No hay datos de ganancias disponibles para el rango de fechas
              seleccionado.
            </p>
          )}
        </section>
      </div>
      <div id="chart-container">
        {/* Sección de Gráfico de Ingresos Mensuales */}
        <section className="box">
          <h2>Ingresos Mensuales</h2>
          <div className="single-line-controls">
            <select value={mes} onChange={handleMesChange}>
              {[...Array(12)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
            <Tooltip title="Descargar ingresos mensuales" arrow placement="top">
              <IconButton onClick={handleGenerarExcelIngresosMensuales}>
                <img
                  src="excel.png"
                  width={"32px"}
                  height={"32px"}
                  alt="Excel"
                />
              </IconButton>
            </Tooltip>
            <input
              type="date"
              value={dia}
              onChange={(e) => setDia(e.target.value)}
            />
            <Tooltip title="Descargar ingresos diarios" arrow placement="top">
              <IconButton onClick={handleGenerarExcelIngresosDiarios}>
                <img
                  src="excel.png"
                  width={"32px"}
                  height={"32px"}
                  alt="Excel"
                />
              </IconButton>
            </Tooltip>
          </div>
          {error.mes && <p className="error">Por favor, seleccione un mes.</p>}
          {error.dia && <p className="error">Por favor, seleccione un día.</p>}

          {loadingChart ? (
            <p>Cargando gráfico...</p>
          ) : dataLine.length > 1 ? (
            <Chart
              chartType="LineChart"
              width="100%"
              height="400px"
              data={dataLine}
              options={optionsLineChart}
            />
          ) : (
            <p>No hay datos disponibles para el mes seleccionado.</p>
          )}
        </section>

        {/* Sección de Gráfico de Pedidos por Cliente */}
        <section className="box">
          <h2>Pedidos por Cliente</h2>
          <form onSubmit={handleSubmitPedidos}>
            <div className="date-range">
              <label>
                Desde:
                <input
                  type="date"
                  value={fechaDesdePedidosLocal}
                  onChange={(e) => setFechaDesdePedidosLocal(e.target.value)}
                />
              </label>
              <label>
                Hasta:
                <input
                  type="date"
                  value={fechaHastaPedidosLocal}
                  onChange={(e) => setFechaHastaPedidosLocal(e.target.value)}
                />
              </label>
              <Tooltip title="Actualizar fecha" arrow placement="top">
                <IconButton type="submit">
                  <SendIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Descargar reporte" arrow placement="top">
                <IconButton onClick={handleGenerarExcelPedidosPorCliente}>
                  <img
                    src="excel.png"
                    width={"32px"}
                    height={"32px"}
                    alt="Excel"
                  />
                </IconButton>
              </Tooltip>
              {(error.fechaDesde || error.fechaHasta) && (
                <p className="error">Por favor, seleccione ambas fechas.</p>
              )}
            </div>
          </form>

          {loadingBarChart ? (
            <p>Cargando gráfico de pedidos por cliente...</p>
          ) : dataBar.length > 1 ? (
            <Chart
              chartType="BarChart"
              width="100%"
              height="400px"
              data={dataBar}
              options={optionsBarChart}
            />
          ) : (
            <p>
              No hay datos de pedidos por cliente disponibles para el rango de
              fechas seleccionado.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};
