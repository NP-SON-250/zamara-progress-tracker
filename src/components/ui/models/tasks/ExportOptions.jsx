// ExportOptions.jsx
import React, { useState, useRef, useEffect } from "react";
import { IoMdClose, IoMdDownload, IoMdEye } from "react-icons/io";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Button from "../../bottons/Button";

const ExportOptions = ({
  isOpen,
  onClose,
  data = [],
  columns = [],
  departmentName,
  fullname,
  onExport,
  performance = 0,
}) => {
  const [selectedOption, setSelectedOption] = useState("pdf");
  const [isExporting, setIsExporting] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);
  // Reset preview when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setShowPreview(false);
      setPreviewData(null);
    }
  }, [isOpen]);
  //====Prepare data for export with all fields====
  const prepareExportData = () => {
    if (!data || data.length === 0) return [];

    return data.map((row) => {
      const exportRow = {};

      // Task Number
      exportRow["TASK NUMBER"] = row.taskNumber || "-";

      // Task Name
      exportRow["TASK NAME"] = row.name || "-";

      // Description
      exportRow["DESCRIPTION"] = row.description || "-";

      // Status
      exportRow["STATUS"] = row.status || "-";

      // Priority
      exportRow["PRIORITY"] = row.priority || "-";

      // Completeness Level
      exportRow["COMPLETENESS LEVEL"] = row.completenessLevel || "-";

      // Progress
      exportRow["PROGRESS"] = `${row.progress || 0}%`;

      // Assigned To
      if (Array.isArray(row.asignedTo)) {
        exportRow["ASSIGNED TO"] = row.asignedTo
          .map((user) => user.fullname || user)
          .join(", ");
      } else {
        exportRow["ASSIGNED TO"] = row.asignedTo || "-";
      }

      // Start Date
      exportRow["START DATE"] = row.startDate
        ? new Date(row.startDate).toLocaleDateString()
        : "-";

      // Deadline (endDate)
      exportRow["DEADLINE"] =
        row.endDate || row.deadline
          ? new Date(row.endDate || row.deadline).toLocaleDateString()
          : "-";

      // Completed On
      exportRow["COMPLETED ON"] = row.completedOn
        ? new Date(row.completedOn).toLocaleDateString()
        : "-";

      // Manager Comments
      if (Array.isArray(row.managerComment) && row.managerComment.length > 0) {
        exportRow["MANAGER COMMENTS"] = row.managerComment.join(", ");
      } else {
        exportRow["MANAGER COMMENTS"] = "-";
      }

      // Reasons for Extending
      exportRow["REASONS FOR EXTENDING"] =
        row.reasonsForExtending && row.reasonsForExtending !== "null"
          ? row.reasonsForExtending
          : "-";

      // Overdue
      exportRow["OVERDUE"] = row.overdued ? "Yes" : "No";

      // Extended Deadline
      exportRow["EXTENDED DEADLINE"] = row.extendedDeadline ? "Yes" : "No";

      return exportRow;
    });
  };
  //====Export as PDF====
  const exportAsPDF = () => {
    setIsExporting(true);
    try {
      const exportData = prepareExportData();

      if (exportData.length === 0) {
        alert("No data available to export");
        setIsExporting(false);
        return;
      }

      const doc = new jsPDF("l", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Add header
      doc.setFontSize(16);
      doc.setTextColor(41, 43, 77);
      doc.text(
        `${departmentName} Department - Task Report`,
        pageWidth / 2,
        15,
        { align: "center" },
      );

      // Add date and performance
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      const currentDate = new Date().toLocaleString();
      doc.text(`Generated: ${currentDate}`, pageWidth / 2, 22, {
        align: "center",
      });

      doc.text(`Department Performance: ${performance}%`, pageWidth / 2, 28, {
        align: "center",
      });

      // Prepare table columns
      const tableHeaders = Object.keys(exportData[0]);
      const tableData = exportData.map((row) => Object.values(row));

      // Add table with footer callback
      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
        startY: 34,
        styles: {
          fontSize: 6,
          cellPadding: 1.5,
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [41, 43, 77],
          textColor: [255, 255, 255],
          fontSize: 7,
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          halign: "left",
        },
        alternateRowStyles: {
          fillColor: [240, 240, 245],
        },
        // Add footer on each page
        didDrawPage: function (data) {
          // Footer text at the bottom of each page
          const footerText = `Report generated by: ${fullname}`;
          const pageNumberText = `Page ${data.pageNumber} of ${doc.internal.getNumberOfPages()}`;

          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);

          // Left side - Generated by
          doc.text(footerText, 14, pageHeight - 8);

          // Right side - Page number
          doc.text(pageNumberText, pageWidth - 14, pageHeight - 8, {
            align: "right",
          });
        },
      });

      doc.save(`${departmentName}-TasksReport.pdf`);

      if (onExport) {
        onExport("pdf", exportData);
      }
      setIsExporting(false);
      onClose();
    } catch (error) {
      console.error("PDF EXPORT ERROR FULL:", error);
      alert(error?.message || "Failed to export PDF");
      setIsExporting(false);
    }
  };
  //====Export as Excel with enhanced design====
  const exportAsExcel = async () => {
    setIsExporting(true);

    try {
      const exportData = prepareExportData();

      if (!exportData.length) {
        alert("No data available to export");
        setIsExporting(false);
        return;
      }

      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Task Management System";
      workbook.created = new Date();

      const worksheet = workbook.addWorksheet(`${departmentName} Tasks`, {
        properties: {
          defaultRowHeight: 16,
        },
        views: [
          {
            state: "frozen",
            ySplit: 5,
          },
        ],
      });

      const headers = Object.keys(exportData[0]);

      //
      // TITLE
      //
      worksheet.mergeCells(1, 1, 1, headers.length);
      const titleCell = worksheet.getCell("A1");
      titleCell.value = `${departmentName} Department - Task Report`;
      titleCell.font = {
        size: 10,
        bold: true,
        color: { argb: "FFFFFFFF" },
        name: "Museo Sans Cyrl",
      };
      titleCell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      titleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "292B4D" },
      };
      titleCell.border = {
        top: { style: "medium" },
        left: { style: "medium" },
        right: { style: "medium" },
        bottom: { style: "medium" },
      };
      worksheet.getRow(1).height = 35;

      //
      // GENERATED DATE & PERFORMANCE
      //
      worksheet.mergeCells(2, 1, 2, headers.length);
      const infoCell = worksheet.getCell("A2");
      infoCell.value = `Generated: ${new Date().toLocaleString()}  |  Department Performance: ${performance}%  |  Total Tasks: ${exportData.length}`;
      infoCell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      infoCell.font = {
        size: 10,
        bold: true,
        color: { argb: "292B4D" },
        name: "Museo Sans Cyrl",
      };
      infoCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "F0F0F5" },
      };
      infoCell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
        bottom: { style: "thin" },
      };
      worksheet.getRow(2).height = 25;

      //
      // EMPTY ROW for spacing
      //
      worksheet.addRow([]);
      worksheet.getRow(3).height = 5;

      //
      // HEADER ROW with clean styling
      //
      const headerRow = worksheet.addRow(headers);
      headerRow.height = 22;

      headerRow.eachCell((cell) => {
        cell.font = {
          bold: true,
          color: { argb: "FFFFFFFF" },
          size: 10,
          name: "Museo Sans Cyrl",
        };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "292B4D" },
        };
        cell.border = {
          top: { style: "medium" },
          left: { style: "thin" },
          right: { style: "thin" },
          bottom: { style: "medium" },
        };
      });

      //
      // DATA ROWS with alternating colors only
      //
      exportData.forEach((item, index) => {
        const values = headers.map((header) => item[header]);
        const row = worksheet.addRow(values);
        row.height = 18;

        row.eachCell((cell) => {
          const isEven = index % 2 === 0;

          cell.alignment = {
            vertical: "middle",
            horizontal: "left",
            wrapText: true,
          };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
            bottom: { style: "thin" },
          };
          cell.font = {
            size: 9,
            name: "Museo Sans Cyrl",
            color: { argb: "333333" },
          };

          // Alternating row colors only
          if (isEven) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFFFF" },
            };
          } else {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "F8F9FC" },
            };
          }
        });
      });

      //
      // AUTO WIDTH
      //
      worksheet.columns.forEach((column, index) => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const value = cell.value ? cell.value.toString() : "";
          maxLength = Math.max(maxLength, value.length);
        });

        // Set different widths for different columns
        const headersList = Object.keys(exportData[0]);
        const headerName = headersList[index] || "";

        if (
          headerName.includes("COMMENTS") ||
          headerName.includes("DESCRIPTION") ||
          headerName.includes("REASONS")
        ) {
          column.width = Math.min(maxLength + 8, 45);
        } else if (headerName.includes("TASK NAME")) {
          column.width = Math.min(maxLength + 8, 35);
        } else if (
          headerName.includes("TASK NUMBER") ||
          headerName.includes("PROGRESS")
        ) {
          column.width = Math.min(maxLength + 5, 18);
        } else {
          column.width = Math.min(maxLength + 5, 28);
        }
      });

      //
      // FOOTER
      //
      worksheet.addRow([]);
      const spacerRow = worksheet.lastRow;
      spacerRow.height = 5;

      worksheet.addRow([`Report generated by: ${fullname}`]);
      const footerRow = worksheet.lastRow;
      worksheet.mergeCells(
        footerRow.number,
        1,
        footerRow.number,
        headers.length,
      );

      const footerCell = footerRow.getCell(1);
      footerCell.value = `Report generated by: ${fullname}`;
      footerCell.font = {
        italic: true,
        color: { argb: "666666" },
        size: 10,
        name: "Museo Sans Cyrl",
      };
      footerCell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      footerCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "F5F5F5" },
      };
      footerCell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
        bottom: { style: "thin" },
      };
      footerRow.height = 22;

      // Add generation timestamp at bottom
      worksheet.addRow([]);
      const timestampRow = worksheet.lastRow;
      worksheet.mergeCells(
        timestampRow.number,
        1,
        timestampRow.number,
        headers.length,
      );
      const timestampCell = timestampRow.getCell(1);
      timestampCell.value = `Exported on: ${new Date().toLocaleString()}`;
      timestampCell.font = {
        size: 8,
        color: { argb: "AAAAAA" },
        name: "Museo Sans Cyrl",
      };
      timestampCell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      timestampRow.height = 18;

      //
      // EXPORT
      //
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `${departmentName}-TasksReport.xlsx`);

      if (onExport) {
        onExport("excel", exportData);
      }

      setIsExporting(false);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to export Excel");
      setIsExporting(false);
    }
  };
  // Handle preview
  const handlePreview = () => {
    const exportData = prepareExportData();
    if (exportData.length === 0) {
      alert("No data available to preview");
      return;
    }
    setPreviewData(exportData);
    setShowPreview(true);
  };
  // Handle proceed with selected option
  const handleProceed = () => {
    switch (selectedOption) {
      case "pdf":
        exportAsPDF();
        break;
      case "excel":
        exportAsExcel();
        break;
      case "preview":
        handlePreview();
        break;
      default:
        break;
    }
  };
  // Preview Modal Component
  const PreviewModal = () => {
    if (!showPreview || !previewData) return null;

    const headers = Object.keys(previewData[0] || {});

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col font-museo">
          {/* Preview Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-lg font-bold text-zblue font-museo">
                Preview Report
              </h2>
              <p className="text-sm text-gray-500 font-museo">
                {previewData.length} records found | Department Performance:{" "}
                {performance}%
              </p>
            </div>
            <button
              onClick={() => setShowPreview(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoMdClose size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Preview Table with both horizontal and vertical scrolling */}
          <div className="flex-1 overflow-auto p-4">
            <div className="border border-gray-300 rounded-md overflow-auto">
              <div
                className="overflow-x-auto overflow-y-auto scrollbar-hide"
                style={{ maxHeight: "100%", maxWidth: "100%" }}
              >
                <table className="w-full min-w-max border-collapse overflow-x-hidden">
                  <thead className="sticky top-0 z-10">
                    <tr>
                      {headers.map((header, index) => (
                        <th
                          key={index}
                          className="px-3 py-2.5 text-left text-xs font-medium whitespace-nowrap bg-zblue text-white font-museo border border-gray-300 sticky top-0"
                          style={{
                            minWidth: header.length > 15 ? "150px" : "100px",
                            position: "sticky",
                            top: 0,
                            zIndex: 10,
                          }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="font-museo">
                    {previewData.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className={`${
                          rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-gray-100 transition-colors`}
                      >
                        {headers.map((header, colIndex) => (
                          <td
                            key={colIndex}
                            className={`px-3 py-2 text-xs text-gray-700 border border-gray-300 whitespace-nowrap font-museo ${
                              rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }`}
                            style={{
                              minWidth: header.length > 15 ? "150px" : "100px",
                            }}
                          >
                            {row[header] || "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Preview Footer */}
          <div className="flex justify-end gap-3 p-4 border-t border-gray-200 sticky bottom-0 bg-white">
            <Button
              type="button"
              color="white"
              onClick={() => setShowPreview(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        ref={dropdownRef}
        className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden font-museo"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-bold text-zblue font-museo">
            Export Options
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <IoMdClose size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Options */}
        <div className="p-4 space-y-3">
          <div
            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all font-museo ${
              selectedOption === "pdf"
                ? "border-zblue bg-zblue/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedOption("pdf")}
          >
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <FaFilePdf className="text-red-500 text-xl" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 font-museo">
                Export as PDF Report
              </p>
              <p className="text-xs text-gray-500 font-museo">
                Download styled PDF with all data
              </p>
            </div>
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selectedOption === "pdf"
                  ? "border-zblue bg-zblue"
                  : "border-gray-300"
              }`}
            >
              {selectedOption === "pdf" && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>
          </div>

          <div
            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all font-museo ${
              selectedOption === "excel"
                ? "border-zblue bg-zblue/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedOption("excel")}
          >
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
              <FaFileExcel className="text-green-600 text-xl" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 font-museo">
                Export in MS Excel
              </p>
              <p className="text-xs text-gray-500 font-museo">
                Download Excel with formatted layout
              </p>
            </div>
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selectedOption === "excel"
                  ? "border-zblue bg-zblue"
                  : "border-gray-300"
              }`}
            >
              {selectedOption === "excel" && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>
          </div>

          <div
            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all font-museo ${
              selectedOption === "preview"
                ? "border-zblue bg-zblue/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedOption("preview")}
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <IoMdEye className="text-blue-500 text-xl" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 font-museo">
                Online Preview Only
              </p>
              <p className="text-xs text-gray-500 font-museo">
                Preview all data in browser
              </p>
            </div>
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selectedOption === "preview"
                  ? "border-zblue bg-zblue"
                  : "border-gray-300"
              }`}
            >
              {selectedOption === "preview" && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 p-4 border-t border-gray-200 bg-gray-50">
          <Button
            type="button"
            color="white"
            className="flex-1 font-museo"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            color="zblue"
            className="flex-1 font-museo"
            onClick={handleProceed}
            disabled={isExporting}
          >
            {isExporting ? (
              <span className="flex items-center gap-2 font-museo">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2 font-museo">
                <IoMdDownload />
                Proceed
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal />
    </>
  );
};

export default ExportOptions;
