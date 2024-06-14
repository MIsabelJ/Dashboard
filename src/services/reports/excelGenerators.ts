const API_URL = import.meta.env.VITE_API_URL;

export type ErrorState = {
  fechaDesde?: boolean;
  fechaHasta?: boolean;
  dia?: boolean;
  mes?: boolean;
};

export const generarExcelMasVendidos = (fechaDesde, fechaHasta, setError) => {
  const errores = {
    fechaDesde: !fechaDesde,
    fechaHasta: !fechaHasta,
  };

  setError(errores);

  if (errores.fechaDesde || errores.fechaHasta) {
    return;
  }

  const url = `${API_URL}/articulo-manufacturado/downloadExcelMasVendidos?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
  window.location.href = url;
};

export const generarExcelIngresosDiarios = (dia, setError) => {
  const errores = {
    dia: !dia,
  };

  setError(errores);

  if (errores.dia) {
    return;
  }

  const fechaFormateada = new Date(dia).toISOString().split('T')[0];
  const url = `${API_URL}/pedido/downloadExcelIngresosDiarios?dia=${fechaFormateada}`; // DÍA ES UNA FECHA, NO UN NÚMERO
  window.location.href = url;
};

export const generarExcelIngresosMensuales = (mes, setError) => {
  const errores = {
    mes: !mes,
  };

  setError(errores);

  if (errores.mes) {
    return;
  }

  const url = `${API_URL}/pedido/downloadExcelIngresosMensuales?mes=${mes}`;
  window.location.href = url;
};

export const generarExcelGanancias = (fechaDesde, fechaHasta, setError) => {
  const errores = {
    fechaDesde: !fechaDesde,
    fechaHasta: !fechaHasta,
  };

  setError(errores);

  if (errores.fechaDesde || errores.fechaHasta) {
    return;
  }

  const url = `${API_URL}/pedido/downloadExcelGanancias?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
  window.location.href = url;
};

export const generarExcelPedidosPorCliente = (
  fechaDesde,
  fechaHasta,
  setError
) => {
  const errores = {
    fechaDesde: !fechaDesde,
    fechaHasta: !fechaHasta,
  };

  setError(errores);

  if (errores.fechaDesde || errores.fechaHasta) {
    return;
  }

  const url = `${API_URL}/pedido/downloadExcelPedidosPorCliente?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
  window.location.href = url;
};
