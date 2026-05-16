"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  Save,
  Eye,
  EyeOff,
  RotateCcw,
  Undo,
  Redo,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";

type HistoryState = {
  subject: string;
  textTemplate: string;
};

type EmailTemplate = {
  team_id: string;
  subject: string;
  text_template: string;
};

function parseTemplate(template: string, data: Record<string, string>) {
  return template.replace(
    /{{(.*?)}}/g,
    (_, key) => data[key.trim()] || `{{${key.trim()}}}`
  );
}

export default function EmailTemplateForm({
  defaultTemplate,
  onSave,
}: {
  defaultTemplate?: string;
  onSave?: (template: EmailTemplate) => void;
}) {
  const [subject, setSubject] = useState(
    "🎵 {{name}}, sei nel team {{team}} per {{date}} - Conferma la tua presenza!"
  );
  const [htmlTemplate, setHtmlTemplate] = useState(defaultTemplate);
  const [textTemplate, setTextTemplate] = useState(
    "Ciao {{name}}, questo è un promemoria che sei di turno con il {{team}} {{date}} 🙌. Se non hai ancora confermato la tua presenza su ChurchLab, ti invitiamo gentilmente a farlo ora: {{link}}. Grazie per il tuo servizio! 💝"
  );
  const [preview, setPreview] = useState("");
  const [previewSubject, setPreviewSubject] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Auto-save indicator
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Undo/Redo functionality
  const [history, setHistory] = useState<HistoryState[]>([
    {
      subject:
        "🎵 {{name}}, sei nel team {{team}} per {{date}} - Conferma la tua presenza!",
      textTemplate:
        "Ciao {{name}}, questo è un promemoria che sei di turno con il {{team}} {{date}} 🙌. Se non hai ancora confermato la tua presenza su ChurchLab, ti invitiamo gentilmente a farlo ora: {{link}}. Grazie per il tuo servizio! 💝",
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isUpdatingFromHistory = useRef(false);

  // Validation
  const validateTemplate = (template: string) => {
    const placeholders = template.match(/{{(.*?)}}/g) || [];
    const invalidPlaceholders = placeholders.filter((p) => {
      const key = p.replace(/[{}]/g, "").trim();
      return !["name", "team", "date", "link"].includes(key);
    });
    return invalidPlaceholders;
  };

  // Auto-preview when content changes
  useEffect(() => {
    if (showPreview) {
      const previewSubj = parseTemplate(subject, sampleData);
      setPreviewSubject(previewSubj);
    }
  }, [, textTemplate, subject, showPreview]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "z":
            if (e.shiftKey) {
              e.preventDefault();
              handleRedo();
            } else {
              e.preventDefault();
              handleUndo();
            }
            break;
          case "y":
            e.preventDefault();
            handleRedo();
            break;
          case "s":
            e.preventDefault();
            handleSave();
            break;
          case "p":
            e.preventDefault();
            handlePreview();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [historyIndex, history.length]);

  // Save current state to history
  const saveToHistory = useCallback(
    (newState: HistoryState) => {
      if (isUpdatingFromHistory.current) return;

      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(newState);

        if (newHistory.length > 50) {
          newHistory.shift();
          return newHistory;
        }

        return newHistory;
      });

      setHistoryIndex((prev) => prev + 1);
      setHasUnsavedChanges(true);
    },
    [historyIndex]
  );

  // Update functions with history tracking and validation
  const updateSubject = useCallback(
    (newSubject: string) => {
      setSubject(newSubject);
      const invalid = validateTemplate(newSubject);
      if (invalid.length > 0) {
        setErrors((prev) => ({
          ...prev,
          subject: `Placeholder non validi: ${invalid.join(", ")}`,
        }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.subject;
          return newErrors;
        });
      }
      saveToHistory({
        subject: newSubject,
        textTemplate,
      });
    },
    [textTemplate, saveToHistory]
  );

  const updateTextTemplate = useCallback(
    (newText: string) => {
      setTextTemplate(newText);
      const invalid = validateTemplate(newText);
      if (invalid.length > 0) {
        setErrors((prev) => ({
          ...prev,
          text: `Placeholder non validi: ${invalid.join(", ")}`,
        }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.text;
          return newErrors;
        });
      }
      saveToHistory({
        subject,
        textTemplate: newText,
      });
    },
    [subject, saveToHistory]
  );

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];

      isUpdatingFromHistory.current = true;
      setSubject(state.subject);
      setTextTemplate(state.textTemplate);
      setHistoryIndex(newIndex);

      setTimeout(() => {
        isUpdatingFromHistory.current = false;
      }, 0);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const state = history[newIndex];

      isUpdatingFromHistory.current = true;
      setSubject(state.subject);
      setTextTemplate(state.textTemplate);
      setHistoryIndex(newIndex);

      setTimeout(() => {
        isUpdatingFromHistory.current = false;
      }, 0);
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Sei sicuro di voler ripristinare il template predefinito? Tutte le modifiche andranno perse."
      )
    ) {
      const defaultState = {
        subject:
          "🎵 {{name}}, sei nel team {{team}} per {{date}} - Conferma la tua presenza!",
        textTemplate:
          "Ciao {{name}}, questo è un promemoria che sei di turno con il {{team}} {{date}} 🙌. Se non hai ancora confermato la tua presenza su ChurchLab, ti invitiamo gentilmente a farlo ora: {{link}}. Grazie per il tuo servizio! 💝",
      };

      isUpdatingFromHistory.current = true;
      setSubject(defaultState.subject);
      setTextTemplate(defaultState.textTemplate);
      setErrors({});

      setHistory((prev) => [...prev, defaultState]);
      setHistoryIndex(history.length);

      setTimeout(() => {
        isUpdatingFromHistory.current = false;
      }, 0);
    }
  };

  const sampleData = {
    name: "Mario Rossi",
    team: "Team Lode",
    date: "Domenica 28 Luglio",
    link: "https://churchlab.it/setlist/123",
  };

  const handlePreview = () => {
    const previewHtml = parseTemplate(htmlTemplate, sampleData);
    const previewSubj = parseTemplate(subject, sampleData);
    setPreview(previewHtml);
    setPreviewSubject(previewSubj);
    setShowPreview(!showPreview);
  };

  const handleSave = () => {
    // Check for errors
    if (Object.keys(errors).length > 0) {
      alert("Correggi gli errori prima di salvare.");
      return;
    }

    const template: EmailTemplate = {
      team_id: "",
      subject,
      text_template: textTemplate,
    };

    if (onSave) {
      onSave(template);
    } else {
      console.log("Template salvato:", template);
    }

    setSaved(true);
    setHasUnsavedChanges(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(""), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const availablePlaceholders = [
    { key: "name", description: "Nome del membro", example: "Mario Rossi" },
    { key: "team", description: "Nome del team", example: "Team Lode" },
    {
      key: "date",
      description: "Data leggibile del turno",
      example: "Domenica 28 Luglio",
    },
    {
      key: "link",
      description: "Link per confermare presenza",
      example: "https://churchlab.it/...",
    },
  ];

  const insertPlaceholder = (placeholder: string) => {
    const textarea = document.getElementById(
      "textTemplate"
    ) as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const current = textTemplate;
      const newValue =
        current.substring(0, start) +
        `{{${placeholder}}}` +
        current.substring(end);

      updateTextTemplate(newValue);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + placeholder.length + 4,
          start + placeholder.length + 4
        );
      }, 0);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className={`"max-w-7xl mx-auto"} p-6 space-y-6`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Editor Template Email
          </h2>
          {hasUnsavedChanges && (
            <span className="text-sm text-amber-600 flex items-center gap-1">
              <AlertCircle size={14} />
              Modifiche non salvate
            </span>
          )}
          {hasErrors && (
            <span className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              Errori di validazione
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Fullscreen toggle */}

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg font-medium transition-colors"
            title="Ripristina template predefinito"
          >
            <RotateCcw size={16} />
            Reset
          </button>

          {/* Undo/Redo buttons */}
          <div className="flex gap-0 border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="flex items-center gap-1 px-3 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Annulla (Ctrl+Z)"
            >
              <Undo size={16} />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="flex items-center gap-1 px-3 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border-l border-gray-300 transition-colors"
              title="Ripeti (Ctrl+Y)"
            >
              <Redo size={16} />
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={hasErrors}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
              saved
                ? "bg-green-100 text-green-700 border border-green-200"
                : hasErrors
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {saved ? <Check size={16} /> : <Save size={16} />}
            {saved ? "Salvato!" : "Salva Template"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-3 space-y-6">
          {/* Subject */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Oggetto Email
              </label>
            </div>
            <input
              type="text"
              value={subject}
              onChange={(e) => updateSubject(e.target.value)}
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.subject ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
              placeholder="Inserisci l'oggetto dell'email..."
            />
            {errors.subject && (
              <p className="text-sm text-red-600 mt-1">{errors.subject}</p>
            )}
          </div>

          {/* Template Tabs */}
          <div>
            
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template Testo (fallback)
            </label>
            <textarea
              id="textTemplate"
              value={textTemplate}
              onChange={(e) => updateTextTemplate(e.target.value)}
              rows={8}
              className={`w-full border rounded-lg px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors ${
                errors.text ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
              placeholder="Inserisci il template di testo..."
            />
            {errors.text && (
              <p className="text-sm text-red-600 mt-1">{errors.text}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handlePreview}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
              {showPreview ? "Nascondi Anteprima" : "Anteprima Email"}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Placeholders */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              Variabili Disponibili
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {availablePlaceholders.length}
              </span>
            </h3>
            <div className="space-y-3">
              {availablePlaceholders.map((placeholder) => (
                <div key={placeholder.key} className="group my-2">
                  <button
                    onClick={() => insertPlaceholder(placeholder.key)}
                    className="w-full text-left bg-white border border-gray-200 rounded-lg px-3 py-3 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-blue-600 font-medium">{`{{${placeholder.key}}}`}</p>
                      <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        Click per inserire
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {placeholder.description}
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="border rounded-lg bg-white shadow-lg animate-in slide-in-from-top-2 duration-300">
          <div className="bg-gray-50 px-6 py-4 border-b rounded-t-lg flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Anteprima Email
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Oggetto:</strong> {previewSubject}
              </p>
            </div>
            <button
              onClick={() => setShowPreview(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="p-6">
            <div dangerouslySetInnerHTML={{ __html: preview }} />
          </div>
        </div>
      )}
    </div>
  );
}
