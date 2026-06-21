// utils/errorUtils.js
export const transformErrors = (backendErrors, tableData) => {
  const grouped = {};

  backendErrors.forEach((err) => {
    const rowIndex = err.row - 1;
    const rowData = tableData[rowIndex] || {};

    if (!grouped[err.row]) {
      grouped[err.row] = {
        rowNumber: err.row,
        firstName: rowData.firstName || "",
        lastName: rowData.lastName || "",
        email: rowData.email || "",
        nationalId: rowData.nationalId || "",
        errors: [],
      };
    }

    grouped[err.row].errors.push(err.message);
  });

  return Object.values(grouped);
};