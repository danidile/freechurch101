"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  Play,
  Image,
  Music,
  FileText,
  Video,
  File,
  Folder,
  Grid,
  List,
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { getAllChurchFiles } from "@/hooks/GET/getAllChurchFiles";
import ChurchLabLoader from "@/app/components/churchLabSpinner";

export default function MediaPage() {
  // Replace this with your actual user data and file fetching logic
  const [files, setFiles] = useState<any[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const { userData } = useUserStore();

  useEffect(() => {
    if (!userData?.church_id) return;
    getAllChurchFiles(userData.church_id).then(setFiles);
  }, [userData?.church_id]);

  // File type detection
  const getFileType = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || ""))
      return "image";
    if (["mp3", "wav", "ogg", "m4a"].includes(ext || "")) return "audio";
    if (["mp4", "avi", "mov", "webm"].includes(ext || "")) return "video";
    if (["pdf", "doc", "docx", "txt"].includes(ext || "")) return "document";
    return "other";
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-5 h-5" />;
      case "audio":
        return <Music className="w-5 h-5" />;
      case "video":
        return <Video className="w-5 h-5" />;
      case "document":
        return <FileText className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case "image":
        return "text-green-600 bg-green-50";
      case "audio":
        return "text-blue-600 bg-blue-50";
      case "video":
        return "text-purple-600 bg-purple-50";
      case "document":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // Filter and search files
  const filteredFiles = useMemo(() => {
    return files?.filter((file) => {
      const matchesSearch =
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.fullPath.toLowerCase().includes(searchTerm.toLowerCase());
      const fileType = getFileType(file.name);
      const matchesType = selectedType === "all" || fileType === selectedType;

      return matchesSearch && matchesType;
    });
  }, [files, searchTerm, selectedType]);

  // Group files by folder
  const groupedFiles = useMemo(() => {
    const groups: { [key: string]: any[] } = {};
    filteredFiles?.forEach((file) => {
      const pathParts = file.fullPath.split("/");
      const folder = pathParts.slice(0, -1).join("/") || "Root";
      if (!groups[folder]) groups[folder] = [];
      groups[folder].push(file);
    });
    return groups;
  }, [filteredFiles]);

  const fileTypes = [
    { value: "all", label: "Tutti", count: files?.length },
    {
      value: "image",
      label: "Immagini",
      count: files?.filter((f) => getFileType(f.name) === "image").length,
    },
    {
      value: "audio",
      label: "Audio",
      count: files?.filter((f) => getFileType(f.name) === "audio").length,
    },
    // {
    //   value: "video",
    //   label: "Video",
    //   count: files.filter((f) => getFileType(f.name) === "video").length,
    // },
    // {
    //   value: "document",
    //   label: "Documenti",
    //   count: files.filter((f) => getFileType(f.name) === "document").length,
    // },
  ];

  const GridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {filteredFiles?.map((file) => {
        const fileType = getFileType(file.name);
        const colorClasses = getFileColor(fileType);

        return (
          <div
            key={file.fullPath}
            className="group bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <div className="p-4">
              <div
                className={`w-12 h-12 rounded-lg ${colorClasses} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}
              >
                {getFileIcon(fileType)}
              </div>

              <h3
                className="font-medium text-sm text-gray-900 mb-1 truncate"
                title={file.name}
              >
                {file.name}
              </h3>

              <p
                className="text-xs text-gray-500 truncate"
                title={file.fullPath}
              >
                {file.fullPath.split("/").slice(-2, -1)[0] || "Root"}
              </p>
            </div>

            <div className="px-4 pb-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-1">
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs py-1 px-2 rounded transition-colors">
                  <Play className="w-3 h-3 mx-auto" />
                </button>
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs py-1 px-2 rounded transition-colors">
                  <Download className="w-3 h-3 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const ListView = () => (
    <div className="space-y-6">
      {Object.entries(groupedFiles).map(([folder, folderFiles]) => (
        <div
          key={folder}
          className="bg-white rounded-lg border border-gray-200"
        >
          <div className="flex items-center gap-2 p-4 border-b border-gray-100 bg-gray-50 rounded-t-lg">
            <Folder className="w-4 h-4 text-gray-500" />
            <h3 className="font-medium text-gray-900">
              {folder.split("/").pop()}
            </h3>
            <span className="text-xs text-gray-500">
              ({folderFiles.length} file)
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {folderFiles.map((file) => {
              const fileType = getFileType(file.name);
              const colorClasses = getFileColor(fileType);

              return (
                <div
                  key={file.fullPath}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`w-8 h-8 rounded ${colorClasses} flex items-center justify-center flex-shrink-0`}
                    >
                      {getFileIcon(fileType)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm text-gray-900 truncate">
                        {file.name}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        {file.fullPath}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                      <Play className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Media della chiesa
      </h1>

      {files === null && (
        <div className="text-center py-16">
          <ChurchLabLoader />
        </div>
      )}
      {files?.length === 0 && (
        <div className="text-center py-16">
          <File className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nessun file trovato.</p>
        </div>
      )}
      {files?.length > 0 && (
        <>
          {/* Controls */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cerca file..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-3">
                {/* File Type Filter */}
                <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                  {fileTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setSelectedType(type.value)}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        selectedType === type.value
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {type.label} ({type.count})
                    </button>
                  ))}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded transition-colors ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded transition-colors ${
                      viewMode === "list"
                        ? "bg-white shadow-sm"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          {searchTerm && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Trovati {filteredFiles?.length} file per "{searchTerm}"
              </p>
            </div>
          )}

          {/* Content */}
          {filteredFiles?.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
              <File className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nessun file trovato
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Prova a modificare i termini di ricerca o i filtri"
                  : "Carica alcuni file per iniziare"}
              </p>
            </div>
          ) : (
            <>{viewMode === "grid" ? <GridView /> : <ListView />}</>
          )}
        </>
      )}
    </div>
  );
}
