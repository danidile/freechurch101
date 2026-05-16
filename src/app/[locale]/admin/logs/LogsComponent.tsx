// app/(admin)/logs/page.tsx
"use client";

import { createClient } from "@/utils/supabase/client";
import { cn } from "@heroui/theme";
import { useEffect, useState } from "react";

type Log = {
  id: string;
  created_at: string;
  event: string;
  user_id: string | null;
  meta: Record<string, any> | null;
  level: "info" | "warn" | "error";
};

type MetaFilter = {
  key: string;
  value: string;
  operator: "equals" | "contains" | "exists" | "not_exists";
};

type GroupedLogs = {
  [date: string]: Log[];
};

export default function LogsComponent() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState<"all" | "info" | "warn" | "error">("all");
  const [eventType, setEventType] = useState<string>("all");
  const [availableEventTypes, setAvailableEventTypes] = useState<string[]>([]);
  const [availableMetaKeys, setAvailableMetaKeys] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [expandedMeta, setExpandedMeta] = useState<Set<string>>(new Set());
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [modalContent, setModalContent] = useState<{
    key: string;
    value: any;
    logId: string;
  } | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [metaFilters, setMetaFilters] = useState<MetaFilter[]>([]);

  const supabase = createClient();

  useEffect(() => {
    fetchEventTypes();
    fetchMetaKeys();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [level, eventType, search, metaFilters]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalContent) {
        setModalContent(null);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [modalContent]);

  async function fetchEventTypes() {
    const { data, error } = await supabase
      .from("logs")
      .select("event")
      .order("event");

    if (!error && data) {
      const uniqueEvents = [...new Set(data.map((log) => log.event))];
      setAvailableEventTypes(uniqueEvents);
    }
  }

  async function fetchMetaKeys() {
    const { data, error } = await supabase
      .from("logs")
      .select("meta")
      .not("meta", "is", null);

    if (!error && data) {
      const allKeys = new Set<string>();
      data.forEach((log) => {
        if (log.meta && typeof log.meta === "object") {
          Object.keys(log.meta).forEach((key) => allKeys.add(key));
        }
      });
      setAvailableMetaKeys(Array.from(allKeys).sort());
    }
  }

  async function fetchLogs() {
    setLoading(true);
    let query = supabase
      .from("logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200); // Increased limit for better day grouping

    if (level !== "all") {
      query = query.eq("level", level);
    }

    if (eventType !== "all") {
      query = query.eq("event", eventType);
    }

    if (search.trim() !== "") {
      query = query.ilike("event", `%${search}%`);
    }

    const { data, error } = await query;
    if (!error && data) {
      let filteredLogs = data as Log[];

      // Apply meta filters
      if (metaFilters.length > 0) {
        filteredLogs = filteredLogs.filter((log) => {
          return metaFilters.every((filter) => {
            if (!log.meta) return filter.operator === "not_exists";

            switch (filter.operator) {
              case "exists":
                return log.meta.hasOwnProperty(filter.key);
              case "not_exists":
                return !log.meta.hasOwnProperty(filter.key);
              case "equals":
                return log.meta[filter.key] === filter.value;
              case "contains":
                const value = log.meta[filter.key];
                if (typeof value === "string") {
                  return value
                    .toLowerCase()
                    .includes(filter.value.toLowerCase());
                }
                if (typeof value === "object") {
                  return JSON.stringify(value)
                    .toLowerCase()
                    .includes(filter.value.toLowerCase());
                }
                return String(value)
                  .toLowerCase()
                  .includes(filter.value.toLowerCase());
              default:
                return true;
            }
          });
        });
      }

      setLogs(filteredLogs);
    }
    setLoading(false);
  }

  const groupLogsByDay = (logs: Log[]): GroupedLogs => {
    const grouped: GroupedLogs = {};

    logs.forEach((log) => {
      const date = new Date(log.created_at).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(log);
    });

    return grouped;
  };

  const toggleMetaExpansion = (logId: string) => {
    const newExpanded = new Set(expandedMeta);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedMeta(newExpanded);
  };

  const toggleDayExpansion = (date: string) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDays(newExpanded);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const addMetaFilter = () => {
    setMetaFilters([
      ...metaFilters,
      { key: "", value: "", operator: "equals" },
    ]);
  };

  const removeMetaFilter = (index: number) => {
    setMetaFilters(metaFilters.filter((_, i) => i !== index));
  };

  const updateMetaFilter = (
    index: number,
    field: keyof MetaFilter,
    value: string
  ) => {
    const newFilters = [...metaFilters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setMetaFilters(newFilters);
  };

  const renderMetaData = (log: Log) => {
    if (!log.meta) return <span className="text-gray-400">-</span>;

    const isExpanded = expandedMeta.has(log.id);
    const metaKeys = Object.keys(log.meta);

    if (metaKeys.length === 0) return <span className="text-gray-400">-</span>;

    const truncateValue = (value: any) => {
      const stringValue =
        typeof value === "object" ? JSON.stringify(value) : String(value);
      const firstLine = stringValue.split("\n")[0];
      return firstLine.length > 50
        ? firstLine.substring(0, 50) + "..."
        : firstLine;
    };

    const openModal = (key: string, value: any) => {
      setModalContent({ key, value, logId: log.id });
    };

    return (
      <div className="space-y-1">
        {metaKeys.slice(0, isExpanded ? metaKeys.length : 3).map((key) => (
          <div
            key={key}
            className="flex flex-col sm:flex-row sm:items-start gap-1"
          >
            <span className="text-xs font-medium text-gray-600 min-w-0 flex-shrink-0">
              {key}:
            </span>
            <span
              className="text-xs text-gray-800 break-all cursor-pointer hover:text-blue-600 hover:underline transition-colors duration-200"
              onClick={() => openModal(key, log.meta![key])}
              title="Click to view full content"
            >
              {truncateValue(log.meta![key])}
            </span>
          </div>
        ))}
        {metaKeys.length > 3 && (
          <button
            onClick={() => toggleMetaExpansion(log.id)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
          >
            {isExpanded ? "Show less" : `Show ${metaKeys.length - 3} more`}
          </button>
        )}
      </div>
    );
  };

  const renderLogRow = (log: Log) => (
    <tr
      key={log.id}
      className=" hover:bg-gray-50 transition-colors duration-150"
    >
      <td className="px-4 py-3 text-xs text-gray-600">
        {new Date(log.created_at).toLocaleTimeString()}
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "text-xs font-semibold px-2 py-1 rounded-full",
            log.level === "info" && "bg-blue-100 text-blue-800",
            log.level === "warn" && "bg-yellow-100 text-yellow-800",
            log.level === "error" && "bg-red-100 text-red-800"
          )}
        >
          {log.level}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-900">{log.event}</td>
      <td className="px-4 py-3 text-xs text-gray-600 font-mono">
        {log.user_id || "-"}
      </td>
      <td className="px-4 py-3 max-w-xs">{renderMetaData(log)}</td>
    </tr>
  );

  const renderLogCard = (log: Log) => (
    <div key={log.id} className="bg-[#fafafd] rounded-lg   p-4 my-1">
      <div className="flex items-center justify-between mb-3">
        <span
          className={cn(
            "text-xs font-semibold px-2 py-1 rounded-full",
            log.level === "info" && "bg-blue-100 text-blue-800",
            log.level === "warn" && "bg-yellow-100 text-yellow-800",
            log.level === "error" && "bg-red-100 text-red-800"
          )}
        >
          {log.level}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(log.created_at).toLocaleTimeString()}
        </span>
      </div>

      <div className="space-y-2">
        <div>
          <span className="text-sm font-medium text-gray-700">Event:</span>
          <p className="text-sm text-gray-900 mt-1">{log.event}</p>
        </div>

        {log.user_id && (
          <div>
            <span className="text-sm font-medium text-gray-700">User ID:</span>
            <p className="text-xs text-gray-600 mt-1 font-mono">
              {log.user_id}
            </p>
          </div>
        )}

        {log.meta && Object.keys(log.meta).length > 0 && (
          <div>
            <span className="text-sm font-medium text-gray-700">Meta:</span>
            <div className="mt-1">{renderMetaData(log)}</div>
          </div>
        )}
      </div>
    </div>
  );

  const groupedLogs = groupLogsByDay(logs);
  const sortedDates = Object.keys(groupedLogs).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
      <h1 className="text-2xl font-bold mb-6">Logs Dashboard</h1>

      {/* Basic Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as any)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Levels</option>
          <option value="info">Info</option>
          <option value="warn">Warn</option>
          <option value="error">Error</option>
        </select>

        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]"
        >
          <option value="all">All Event Types</option>
          {availableEventTypes.map((event) => (
            <option key={event} value={event}>
              {event}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search event..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 flex-1 min-w-[200px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 text-sm font-medium"
        >
          {showAdvancedFilters ? "Hide" : "Show"} Advanced Filters
        </button>
      </div>

      {/* Advanced Meta Filters */}
      {showAdvancedFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Meta Filters
            </h3>
            <button
              onClick={addMetaFilter}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
            >
              Add Filter
            </button>
          </div>

          {metaFilters.length === 0 ? (
            <p className="text-gray-500 text-sm">No meta filters applied</p>
          ) : (
            <div className="space-y-3">
              {metaFilters.map((filter, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-2 p-3 bg-white rounded border border-gray-200"
                >
                  <select
                    value={filter.key}
                    onChange={(e) =>
                      updateMetaFilter(index, "key", e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1 text-sm min-w-[120px]"
                  >
                    <option value="">Select key...</option>
                    {availableMetaKeys.map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filter.operator}
                    onChange={(e) =>
                      updateMetaFilter(index, "operator", e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1 text-sm min-w-[100px]"
                  >
                    <option value="equals">Equals</option>
                    <option value="contains">Contains</option>
                    <option value="exists">Exists</option>
                    <option value="not_exists">Not Exists</option>
                  </select>

                  {filter.operator !== "exists" &&
                    filter.operator !== "not_exists" && (
                      <input
                        type="text"
                        placeholder="Value..."
                        value={filter.value}
                        onChange={(e) =>
                          updateMetaFilter(index, "value", e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-sm flex-1 min-w-[100px]"
                      />
                    )}

                  <button
                    onClick={() => removeMetaFilter(index)}
                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-2">Loading...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No logs found.</p>
        </div>
      ) : (
        <>
          {/* Day-grouped logs */}
          {sortedDates.map((date) => {
            const dayLogs = groupedLogs[date];
            const isExpanded = expandedDays.has(date);

            return (
              <div key={date} className="mb-6">
                <div
                  className="flex items-center justify-between p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => toggleDayExpansion(date)}
                >
                  <h2 className="text-lg font-semibold text-gray-800">
                    {date}
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      ({dayLogs.length} logs)
                    </span>
                  </h2>
                  <span className="text-gray-600">
                    {isExpanded ? "▼" : "▶"}
                  </span>
                </div>

                {isExpanded && (
                  <div className="mt-4">
                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                        <thead>
                          <tr className="bg-gray-100 text-left">
                            <th className="px-4 py-3 font-semibold text-gray-700">
                              Time
                            </th>
                            <th className="px-4 py-3 font-semibold text-gray-700">
                              Level
                            </th>
                            <th className="px-4 py-3 font-semibold text-gray-700">
                              Event
                            </th>
                            <th className="px-4 py-3 font-semibold text-gray-700">
                              User ID
                            </th>
                            <th className="px-4 py-3 font-semibold text-gray-700">
                              Meta
                            </th>
                          </tr>
                        </thead>
                        <tbody>{dayLogs.map(renderLogRow)}</tbody>
                      </table>
                    </div>

                    {/* Mobile/Tablet Card Layout */}
                    <div className="lg:hidden space-y-4">
                      {dayLogs.map(renderLogCard)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {/* Enhanced Modal */}
      {modalContent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setModalContent(null)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Meta: <span className="text-blue-600">{modalContent.key}</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const content =
                      typeof modalContent.value === "object"
                        ? JSON.stringify(modalContent.value, null, 2)
                        : String(modalContent.value);
                    copyToClipboard(content);
                  }}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors duration-200"
                  title="Copy to clipboard"
                >
                  Copy
                </button>
                <button
                  onClick={() => setModalContent(null)}
                  className="text-gray-500 hover:text-gray-700 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
                  title="Close modal"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap break-words bg-gray-50 p-4 rounded-md font-mono">
                {typeof modalContent.value === "object"
                  ? JSON.stringify(modalContent.value, null, 2)
                  : String(modalContent.value)}
              </pre>
            </div>

            <div className="flex justify-end p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setModalContent(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
