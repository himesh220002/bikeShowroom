import * as XLSX from "xlsx";

/**
 * Exports a JSON array to an Excel file (.xlsx)
 * @param data Array of objects to export
 * @param filename Name of the file (without extension)
 * @param sheetName Name of the worksheet
 */
export function exportToExcel(data: any[], filename: string, sheetName: string = "Data") {
    if (!data || data.length === 0) {
        console.warn("No data provided for export");
        return;
    }

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Write file
    XLSX.writeFile(workbook, `${filename}.xlsx`);
}
