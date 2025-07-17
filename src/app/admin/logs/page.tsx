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

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState<"all" | "info" | "warn" | "error">("all");
  const [eventType, setEventType] = useState<string>("all");
  const [availableEventTypes, setAvailableEventTypes] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [expandedMeta, setExpandedMeta] = useState<Set<string>>(new Set());
  const [modalContent, setModalContent] = useState<{
    key: string;
    value: any;
    logId: string;
  } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchEventTypes();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [level, eventType, search]);

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
      // Get unique event types
      const uniqueEvents = [...new Set(data.map((log) => log.event))];
      setAvailableEventTypes(uniqueEvents);
    }
  }

  async function fetchLogs() {
    setLoading(true);
    let query = supabase
      .from("logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

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
    if (!error) {
      setLogs(data as Log[]);
    }
    setLoading(false);
  }

  const toggleMetaExpansion = (logId: string) => {
    const newExpanded = new Set(expandedMeta);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedMeta(newExpanded);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderMetaData = (log: Log) => {
    if (!log.meta) return <span className="text-gray-400">-</span>;

    const isExpanded = expandedMeta.has(log.id);
    const metaKeys = Object.keys(log.meta);

    if (metaKeys.length === 0) return <span className="text-gray-400">-</span>;

    const truncateValue = (value: any) => {
      const stringValue =
        typeof value === "object" ? JSON.stringify(value) : String(value);

      // Split by newlines and take first line, then truncate if too long
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
            {isExpanded ? "Show less" : `Show ${metaKeys.length - 2} more`}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
      <h1 className="text-2xl font-bold mb-6">Logs Dashboard</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
      </div>

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
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-t hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "text-xs font-semibold px-2 py-1 rounded-full",
                          log.level === "info" && "bg-blue-100 text-blue-800",
                          log.level === "warn" &&
                            "bg-yellow-100 text-yellow-800",
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
                    <td className="px-4 py-3 max-w-xs">
                      {renderMetaData(log)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card Layout */}
          <div className="lg:hidden space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
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
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Event:
                    </span>
                    <p className="text-sm text-gray-900 mt-1">{log.event}</p>
                  </div>

                  {log.user_id && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        User ID:
                      </span>
                      <p className="text-xs text-gray-600 mt-1 font-mono">
                        {log.user_id}
                      </p>
                    </div>
                  )}

                  {log.meta && Object.keys(log.meta).length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Meta:
                      </span>
                      <div className="mt-1">{renderMetaData(log)}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
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
            {/* Modal Header */}
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

            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-4">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap break-words bg-gray-50 p-4 rounded-md font-mono">
                {typeof modalContent.value === "object"
                  ? JSON.stringify(modalContent.value, null, 2)
                  : String(modalContent.value)}
              </pre>
            </div>

            {/* Modal Footer */}
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
