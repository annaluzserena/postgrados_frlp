import * as XLSX from "xlsx";

interface ExportMetadata {
  fechaGeneracion: string;
  filtros: Record<string, string>;
  usuario: string;
}

export function exportarExcel(
  nombreArchivo: string,
  nombreHoja: string,
  datos: Record<string, unknown>[],
  metadata: ExportMetadata,
) {
  const workbook = XLSX.utils.book_new();

  // Hoja principal con los datos
  const worksheet = XLSX.utils.json_to_sheet(datos);

  // Encabezados en negrita
  const headers = Object.keys(datos[0] ?? {});
  headers.forEach((_, index) => {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });

    if (worksheet[cellAddress]) {
      worksheet[cellAddress].s = {
        font: { bold: true },
      };
    }
  });

  // Ajustar automáticamente el ancho de las columnas
  const columnWidths = headers.map((header) => {
    const maxLength = Math.max(
      header.length,
      ...datos.map((fila) => String(fila[header] ?? "").length),
    );

    return {
      wch: Math.min(Math.max(maxLength + 2, 10), 50),
    };
  });

  worksheet["!cols"] = columnWidths;

  // Filtros automáticos
  if (headers.length > 0 && datos.length > 0) {
    worksheet["!autofilter"] = {
      ref: XLSX.utils.encode_range({
        s: { r: 0, c: 0 },
        e: { r: datos.length, c: headers.length - 1 },
      }),
    };
  }

  XLSX.utils.book_append_sheet(workbook, worksheet, nombreHoja);

  // Hoja de metadatos
  const metadataRows = [
    ["Información de exportación", ""],
    ["Fecha de generación", metadata.fechaGeneracion],
    ["Usuario", metadata.usuario],
    [],
    ["Filtros activos", ""],
    ...Object.entries(metadata.filtros).map(([filtro, valor]) => [
      filtro,
      valor,
    ]),
  ];

  const metadataSheet = XLSX.utils.aoa_to_sheet(metadataRows);

  // Encabezados de metadatos en negrita
  ["A1", "A5"].forEach((cell) => {
    if (metadataSheet[cell]) {
      metadataSheet[cell].s = {
        font: { bold: true },
      };
    }
  });

  metadataSheet["!cols"] = [{ wch: 25 }, { wch: 40 }];

  XLSX.utils.book_append_sheet(workbook, metadataSheet, "Metadatos");

  XLSX.writeFile(workbook, nombreArchivo);
}
