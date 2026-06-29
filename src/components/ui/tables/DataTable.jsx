import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  IoIosArrowDown,
  IoMdMore,
  IoIosCheckmarkCircleOutline,
} from "react-icons/io";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import { Filter } from "lucide-react";
import { TbFilterPlus, TbFilterCancel } from "react-icons/tb";
import { RiListCheck2, RiGitClosePullRequestLine } from "react-icons/ri";
import { BsUiChecks } from "react-icons/bs";
import { FiEdit2 } from "react-icons/fi";
// Import both task and user modals
import EditTask from "../models/tasks/EditTask";
import EditUser from "../models/employees/EditUser";

const DataTable = ({
  columns = [],
  data = [],
  activeColumn,
  setActiveColumn,
  onSort,
  sortConfig,
  onFilterClick,
  onClearFilter,
  filteredColumns = [],
  dynamicFilters = [],
  searchTerm = "",
  enableSelection = false,
  selectedRows = [],
  setSelectedRows = () => {},
  onRefresh,
  // Task specific props
  onTaskUpdate,
  // User specific props
  onUserUpdate,
  // Generic props
  onEdit,
  entityType = "task", // "task" or "user"
}) => {
  const [dropdownPos, setDropdownPos] = useState(null);
  const [activeRowAction, setActiveRowAction] = useState(null);
  const [rowActionPos, setRowActionPos] = useState({ top: 0, left: 0 });
  const [selectedItem, setSelectedItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const actionRef = useRef(null);

  // ======================
  // FILTER LOGIC - UPDATED TO HANDLE ARRAYS
  // ======================
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const matchesFilters = dynamicFilters.every((f) => {
        const key = f.field.accessor;
        const value = row[key];

        if (!f.value || f.value.trim() === "") return true;
        if (value === null || value === undefined) return false;

        if (f.field.type === "date") {
          const dateValue = value ? new Date(value) : null;
          if (!dateValue) return false;
          return dateValue.toISOString().slice(0, 10) === f.value;
        }

        if (f.field.type === "select") {
          return String(value).toLowerCase() === String(f.value).toLowerCase();
        }

        if (f.field.type === "number") {
          return Number(value) === Number(f.value);
        }

        if (Array.isArray(value)) {
          return value.some((item) => {
            if (typeof item === "object" && item !== null) {
              return Object.values(item).some((val) =>
                String(val)
                  .toLowerCase()
                  .includes(String(f.value).toLowerCase()),
              );
            }
            return String(item)
              .toLowerCase()
              .includes(String(f.value).toLowerCase());
          });
        }

        return String(value)
          .toLowerCase()
          .includes(String(f.value).toLowerCase());
      });

      const matchesSearch =
        !searchTerm ||
        Object.values(row).some((val) => {
          if (Array.isArray(val)) {
            return val.some((item) => {
              if (typeof item === "object" && item !== null) {
                return Object.values(item).some((subVal) =>
                  String(subVal)
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()),
                );
              }
              return String(item)
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            });
          }
          return String(val).toLowerCase().includes(searchTerm.toLowerCase());
        });

      return matchesFilters && matchesSearch;
    });
  }, [data, dynamicFilters, searchTerm]);

  // ======================
  // SORT
  // ======================
  const sortedData = useMemo(() => {
    const arr = [...filteredData];

    if (!sortConfig) return arr;

    const { accessor, direction } = sortConfig;

    return arr.sort((a, b) => {
      const valA = a[accessor];
      const valB = b[accessor];

      if (
        accessor === "startDate" ||
        accessor === "deadline" ||
        accessor === "registeredOn" ||
        accessor === "lastLogin"
      ) {
        const dateA = valA ? new Date(valA).getTime() : 0;
        const dateB = valB ? new Date(valB).getTime() : 0;
        return direction === "asc" ? dateA - dateB : dateB - dateA;
      }

      if (accessor === "progress" || accessor === "assignedTasks") {
        const numA = parseInt(valA) || 0;
        const numB = parseInt(valB) || 0;
        return direction === "asc" ? numA - numB : numB - numA;
      }

      if (Array.isArray(valA) && Array.isArray(valB)) {
        const strA = valA
          .map((item) =>
            typeof item === "object"
              ? item.fullname || item.name || JSON.stringify(item)
              : String(item),
          )
          .join(", ");
        const strB = valB
          .map((item) =>
            typeof item === "object"
              ? item.fullname || item.name || JSON.stringify(item)
              : String(item),
          )
          .join(", ");
        return direction === "asc"
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      if (strA < strB) return direction === "asc" ? -1 : 1;
      if (strA > strB) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // ======================
  // SELECTION LOGIC
  // ======================
  const toggleSelection = (rowId) => {
    if (!enableSelection) return;

    setSelectedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId],
    );
  };

  const isSelected = (rowId) => selectedRows.includes(rowId);

  const toggleSelectAll = () => {
    if (selectedRows.length === sortedData.length) {
      setSelectedRows([]);
    } else {
      const allIds = sortedData.map((row) => row.documentNumber);
      setSelectedRows(allIds);
    }
  };

  // ======================
  // ITEM ACTION HANDLERS
  // ======================
  const handleViewEdit = (row) => {
    setSelectedItem(row);
    setShowEditModal(true);
    setActiveRowAction(null);
  };

  // Generic update handler
  const handleEditComplete = async (updatedItem) => {
    setShowEditModal(false);
    setSelectedItem(null);

    // Call the appropriate update handler
    if (entityType === "task" && onTaskUpdate) {
      await onTaskUpdate(updatedItem);
    } else if (entityType === "user" && onUserUpdate) {
      await onUserUpdate(updatedItem);
    } else if (onEdit) {
      await onEdit(updatedItem);
    }

    if (onRefresh) {
      await onRefresh();
    }
  };

  // ======================
  // ROW ACTION MENU WITH IMPROVED POSITIONING
  // ======================
  const openActionMenu = (e, row) => {
    e.stopPropagation();

    const buttonRect = e.currentTarget.getBoundingClientRect();
    const menuWidth = 180;
    const menuHeight = 60; // Reduced height since we removed delete option
    const spacing = 8;
    const viewportPadding = 10;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = buttonRect.bottom + spacing;
    let left = buttonRect.right - menuWidth;

    if (left + menuWidth > viewportWidth - viewportPadding) {
      left = viewportWidth - menuWidth - viewportPadding;
    }

    if (left < viewportPadding) {
      left = viewportPadding;
    }

    if (left > buttonRect.right) {
      left = buttonRect.left;
    }

    if (top + menuHeight > viewportHeight - viewportPadding) {
      top = buttonRect.top - menuHeight - spacing;
      if (top < viewportPadding) {
        top = viewportPadding;
      }
    }

    if (top + menuHeight > viewportHeight - viewportPadding) {
      top = viewportHeight - menuHeight - viewportPadding;
    }

    top = Math.max(
      viewportPadding,
      Math.min(top, viewportHeight - menuHeight - viewportPadding),
    );
    left = Math.max(
      viewportPadding,
      Math.min(left, viewportWidth - menuWidth - viewportPadding),
    );

    setActiveRowAction(row.documentNumber);
    setRowActionPos({ top, left });
  };

  // ======================
  // CLOSE OUTSIDE
  // ======================
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isDropdown = event.target.closest(".dt-dropdown");
      const isTrigger = event.target.closest(".dt-trigger");

      const isActionMenu = event.target.closest(".dt-action-menu");
      const isActionTrigger = event.target.closest(".dt-action-trigger");

      if (!isDropdown && !isTrigger) {
        setActiveColumn(null);
        setDropdownPos(null);
      }

      if (!isActionMenu && !isActionTrigger) {
        setActiveRowAction(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setActiveColumn]);

  // ======================
  // COLUMN DROPDOWN
  // ======================
  const openDropdown = (e, col) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const dropdownWidth = 192;
    const dropdownHeight = 160;
    const padding = 10;

    let left = rect.left;
    let top = rect.bottom;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    if (left + dropdownWidth > screenWidth) {
      left = screenWidth - dropdownWidth - padding;
    }

    if (left < padding) left = padding;

    if (rect.bottom + dropdownHeight > screenHeight) {
      top = rect.top - dropdownHeight;
    }

    if (top < padding) top = padding;

    setActiveColumn(col.accessor);
    setDropdownPos({
      top: top + window.scrollY,
      left: left + window.scrollX,
    });
  };

  const noData = sortedData.length === 0;

  const isAllSelected =
    selectedRows.length === sortedData.length && sortedData.length > 0;

  // Get the appropriate labels based on entity type
  const getEntityLabels = () => {
    if (entityType === "user") {
      return {
        edit: "View In Edit Mode",
        editModal: "Edit User",
      };
    }
    return {
      edit: "View In Edit Mode",
      editModal: "Edit Task",
    };
  };

  const labels = getEntityLabels();

  return (
    <>
      <div className="w-full max-h-52 overflow-x-auto overflow-y-auto scrollbar-hide relative rounded-lg shadow-xl">
        <table className="w-full min-w-max border border-gray-300 rounded-lg">
          {/* ================= HEADER ================= */}
          <thead className="bg-gray-100 sticky top-0 z-10 border p-2">
            <tr>
              {columns.map((col, index) => {
                const isFiltered = filteredColumns.includes(col.accessor);
                const isDescription = col.accessor === "descriptions";

                return (
                  <th
                    key={index}
                    className={`relative px-4 py-2 text-left text-xs font-light text-zblue/50 border-b whitespace-nowrap
                      border-r border-gray-200
                      ${index === 0 ? "sticky left-0 z-30 bg-gray-100" : ""}
                      ${index === columns.length - 1 ? "border-r-0" : ""}
                    `}
                  >
                    <div className="flex items-center justify-between gap-2 dt-trigger">
                      {index === 0 && enableSelection ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={toggleSelectAll}
                            className="focus:outline-none hover:opacity-70 transition-opacity"
                          >
                            <span
                              className={`inline-block w-3 h-3 rounded-full border transition-all ${
                                isAllSelected
                                  ? "bg-zblue border-gray-400"
                                  : selectedRows.length > 0 && !isAllSelected
                                    ? "bg-zblue/60 border-gray-400"
                                    : "bg-white border-gray-400 hover:border-green-500"
                              }`}
                            />
                          </button>
                          <span>{col.header}</span>
                        </div>
                      ) : (
                        <span>{col.header}</span>
                      )}

                      {!isDescription && (
                        <>
                          {isFiltered ? (
                            <Filter
                              className="cursor-pointer text-green-600 hover:text-green-700 transition-colors"
                              size={9}
                              onClick={(e) => openDropdown(e, col)}
                            />
                          ) : (
                            <IoIosArrowDown
                              className="cursor-pointer text-gray-500 hover:text-zgreen transition-colors"
                              size={14}
                              onClick={(e) => openDropdown(e, col)}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* ================= BODY ================= */}
          <tbody>
            {!noData ? (
              sortedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`hover:bg-gray-50 transition-colors ${
                    enableSelection && isSelected(row.documentNumber)
                      ? "bg-zblue/15"
                      : ""
                  }`}
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-4 py-2 text-xs text-gray-600 border-b whitespace-nowrap
                        border-r border-gray-200
                        ${colIndex === 0 ? "sticky left-0 bg-white z-10" : ""}
                        ${colIndex === columns.length - 1 ? "border-r-1" : ""}
                      `}
                    >
                      {colIndex === 0 && enableSelection ? (
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                toggleSelection(row.documentNumber)
                              }
                              className="focus:outline-none hover:opacity-70 transition-opacity"
                            >
                              {isSelected(row.documentNumber) ? (
                                <IoIosCheckmarkCircleOutline
                                  size={16}
                                  className="text-zblue"
                                />
                              ) : (
                                <div className="w-3 h-3 rounded-full border border-gray-400 bg-white hover:border-zblue transition-all" />
                              )}
                            </button>

                            <span>
                              {col.render
                                ? col.render(row[col.accessor], row)
                                : row[col.accessor]}
                            </span>
                          </div>

                          <button
                            className="dt-action-trigger p-1 hover:bg-gray-100 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-gray-300"
                            onClick={(e) => openActionMenu(e, row)}
                          >
                            <IoMdMore
                              size={16}
                              className="text-gray-500 hover:text-gray-700"
                            />
                          </button>
                        </div>
                      ) : col.render ? (
                        col.render(row[col.accessor], row)
                      ) : (
                        row[col.accessor]
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500"
                >
                  {searchTerm
                    ? "(There is nothing to show in this search view)"
                    : "(There is nothing to show in this filter view)"}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ================= COLUMN DROPDOWN ================= */}
        {dropdownPos && activeColumn && (
          <div
            className="dt-dropdown fixed w-48 bg-white border shadow-lg rounded-md z-[9999] overflow-hidden"
            style={{
              top: dropdownPos.top,
              left: dropdownPos.left,
            }}
          >
            <div
              className="px-3 py-2 flex gap-2 items-center hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => {
                onSort(activeColumn, "asc");
                setActiveColumn(null);
                setDropdownPos(null);
              }}
            >
              <AiOutlineSortAscending size={16} />
              <span className="text-sm">Ascending</span>
            </div>

            <div
              className="px-3 py-2 flex gap-2 items-center hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => {
                onSort(activeColumn, "desc");
                setActiveColumn(null);
                setDropdownPos(null);
              }}
            >
              <AiOutlineSortDescending size={16} />
              <span className="text-sm">Descending</span>
            </div>

            <div className="border-t border-gray-100 my-1" />

            <div
              className="px-3 py-2 flex gap-2 items-center hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => {
                const col = columns.find((c) => c.accessor === activeColumn);
                onFilterClick(col);
                setActiveColumn(null);
                setDropdownPos(null);
              }}
            >
              <TbFilterPlus size={16} />
              <span className="text-sm">Filter</span>
            </div>

            <div
              className={`px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 transition-colors ${
                !filteredColumns.includes(activeColumn)
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
              onClick={() => {
                const col = columns.find((c) => c.accessor === activeColumn);
                if (col) onClearFilter(col);
                setActiveColumn(null);
                setDropdownPos(null);
              }}
            >
              <TbFilterCancel size={16} className="" />
              <span className="text-sm">Clear Filter</span>
            </div>
          </div>
        )}

        {/* ================= ROW ACTION MENU ================= */}
        {activeRowAction && (
          <div
            ref={actionRef}
            className="dt-action-menu fixed ml-12 w-36 bg-white border shadow-lg rounded-md z-[9999] overflow-hidden"
            style={{
              top: `${rowActionPos.top}px`,
              left: `${rowActionPos.left}px`,
            }}
          >
            {/* View In Edit Mode */}
            <div
              className="p-1 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors text-sm"
              onClick={() => {
                const row = sortedData.find(
                  (r) => r.documentNumber === activeRowAction,
                );
                if (row) handleViewEdit(row);
              }}
            >
              <div className="flex items-center gap-2 text-zblue/80">
                <FiEdit2 size={16} className="" />
                <span className="text-xs">{labels.edit}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {showEditModal &&
        selectedItem &&
        (entityType === "task" ? (
          <EditTask
            task={selectedItem}
            onClose={() => {
              setShowEditModal(false);
              setSelectedItem(null);
            }}
            onUpdate={handleEditComplete}
          />
        ) : entityType === "user" ? (
          <EditUser
            user={selectedItem}
            onClose={() => {
              setShowEditModal(false);
              setSelectedItem(null);
            }}
            onUpdate={handleEditComplete}
          />
        ) : null)}
    </>
  );
};

export default DataTable;
