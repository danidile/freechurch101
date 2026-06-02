"use client";

import { useState, useEffect, useRef } from "react";
import { MdFamilyRestroom } from "react-icons/md";
import {
  LuUser,
  LuMail,
  LuPhone,
  LuCalendar,
  LuSearch,
  LuPlus,
  LuPencil,
  LuTrash2,
  LuX,
  LuCheck,
} from "react-icons/lu";
import { FiUserPlus } from "react-icons/fi";
import { GrCircleAlert } from "react-icons/gr";
import { FaCheck } from "react-icons/fa";
import {
  getMyFamily,
  createFamily,
  addFamilyMember,
  updateUnlinkedMember,
  removeFamilyMember,
  updateFamilyName,
  searchProfiles,
  type FamilyWithMembers,
  type ResolvedMember,
  type FamilyRole,
  type UnlinkedMemberInput,
} from "./familyActions";

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLES: { value: FamilyRole; label: string }[] = [
  { value: "head", label: "Capofamiglia" },
  { value: "spouse", label: "Coniuge / Partner" },
  { value: "child", label: "Figlio/a" },
  { value: "other", label: "Altro" },
];

const ROLE_STYLE: Record<FamilyRole, string> = {
  head: "bg-violet-50 text-violet-700 border border-violet-100",
  spouse: "bg-sky-50 text-sky-700 border border-sky-100",
  child: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  other: "bg-gray-50 text-gray-500 border border-gray-100",
};

// ─── Small helpers ────────────────────────────────────────────────────────────

const SUPABASE_URL =
  "https://kadorwmjhklzakafowpu.supabase.co/storage/v1/object/public";

function avatarUrl(filename: string | null | undefined): string | null {
  if (!filename) return null;
  return `${SUPABASE_URL}/avatars/${filename}?t=${Date.now()}`;
}

function Avatar({
  name,
  url,
  size = 36,
}: {
  name: string;
  url?: string | null;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const px = `${size}px`;
  if (url)
    return (
      <img
        src={url}
        alt={name}
        style={{
          width: px,
          height: px,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
        }}
      />
    );
  return (
    <div
      style={{ width: px, height: px, borderRadius: "50%", flexShrink: 0 }}
      className="bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-xs"
    >
      {initials || "?"}
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-100 mt-4">
      <GrCircleAlert size={14} />
      <p>{message}</p>
    </div>
  );
}

function SuccessBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-100 mt-4">
      <FaCheck size={12} />
      <p>{message}</p>
    </div>
  );
}

// ─── Member row ───────────────────────────────────────────────────────────────

function MemberRow({
  member,
  isOwner,
  onEdit,
  onRemove,
}: {
  member: ResolvedMember;
  isOwner: boolean;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const fullName = `${member.name} ${member.lastname}`;
  const isHead = member.role === "head";

  return (
    <div className="flex items-center gap-3 px-2 py-3 rounded-lg bg-white hover:bg-gray-100 transition-colors group">
      <Avatar name={fullName} url={avatarUrl(member.avatar_url)} size={34} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-800">{fullName}</span>
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${ROLE_STYLE[member.role]}`}
          >
            {ROLES.find((r) => r.value === member.role)?.label}
          </span>
          {member.has_account && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
              ✓ Account attivo
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
          {member.email && (
            <span className="text-xs text-gray-400">{member.email}</span>
          )}
          {member.phone && (
            <span className="text-xs text-gray-400">{member.phone}</span>
          )}
          {member.birthdate && (
            <span className="text-xs text-gray-400">
              {new Date(member.birthdate).toLocaleDateString("it-IT", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          )}
        </div>
      </div>

      {isOwner && !isHead && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="Modifica"
          >
            <LuPencil size={13} />
          </button>
          <button
            onClick={onRemove}
            className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Rimuovi"
          >
            <LuTrash2 size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Unlinked member form ─────────────────────────────────────────────────────

function UnlinkedMemberForm({
  initial,
  onSave,
  onCancel,
  saving,
  submitLabel,
}: {
  initial?: Partial<UnlinkedMemberInput>;
  onSave: (data: UnlinkedMemberInput) => void;
  onCancel: () => void;
  saving: boolean;
  submitLabel: string;
}) {
  const [form, setForm] = useState<UnlinkedMemberInput>({
    name: "",
    lastname: "",
    email: "",
    phone: "",
    birthdate: "",
    role: "other",
    ...initial,
  });
  const set = (k: keyof UnlinkedMemberInput, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="grid grid-cols-2 gap-3">
        {(
          [
            ["name", "Nome"],
            ["lastname", "Cognome"],
          ] as const
        ).map(([key, label]) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
              {label} *
            </label>
            <input
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
              className="cinput"
              required
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
          Email
          <span className="normal-case font-normal text-gray-300 ml-1">
            (opzionale — verrà collegata se si registra)
          </span>
        </label>
        <input
          type="email"
          value={form.email ?? ""}
          onChange={(e) => set("email", e.target.value)}
          className="cinput"
          placeholder="—"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
            Telefono
          </label>
          <input
            type="tel"
            value={form.phone ?? ""}
            onChange={(e) => set("phone", e.target.value)}
            className="cinput"
            placeholder="—"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
            Data di nascita
          </label>
          <input
            type="date"
            value={form.birthdate ?? ""}
            onChange={(e) => set("birthdate", e.target.value)}
            className="cinput"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
          Ruolo in famiglia
        </label>
        <select
          value={form.role}
          onChange={(e) => set("role", e.target.value as FamilyRole)}
          className="cinput bg-white"
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Annulla
        </button>
        <button
          onClick={() => {
            if (form.name && form.lastname) onSave(form);
          }}
          disabled={saving || !form.name || !form.lastname}
          className="px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {saving ? "Salvataggio…" : submitLabel}
        </button>
      </div>
    </div>
  );
}

// ─── Profile search (linked member) ──────────────────────────────────────────

function ProfileSearch({
  onSelect,
  onCancel,
  saving,
}: {
  onSelect: (profileId: string, role: FamilyRole) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    Array<{
      id: string;
      name: string;
      lastname: string;
      email: string;
      avatar_url: string | null;
    }>
  >([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [role, setRole] = useState<FamilyRole>("other");
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const isEmailSearch = query.includes("@");
    const isNameSearch = !query.includes("@") && query.length >= 6;
    if (!isEmailSearch && !isNameSearch) {
      setResults([]);
      return;
    }
    if (isEmailSearch && query.split("@")[1]?.length < 1) {
      setResults([]);
      return;
    }
    clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      try {
        setResults(await searchProfiles(query));
      } catch (e: any) {
        console.error("searchProfiles error:", e?.message, e);
      }
    }, 300);
  }, [query]);

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div>
        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
          Cerca per nome
        </label>
        <div className="relative">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(null);
            }}
            className="cinput pl-8"
            placeholder="Almeno 6 caratteri o email con @"
            autoFocus
          />
        </div>
      </div>

      {results.length > 0 && (
        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto rounded-lg border border-gray-100">
          {results.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${
                selected === p.id ? "bg-indigo-50" : "hover:bg-gray-50"
              }`}
            >
              <Avatar
                name={`${p.name} ${p.lastname}`}
                url={avatarUrl(p.avatar_url)}
                size={30}
              />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {p.name} {p.lastname}
                </p>
                <p className="text-xs text-gray-400">{p.email}</p>
              </div>
              {selected === p.id && (
                <LuCheck size={14} className="ml-auto text-indigo-600" />
              )}
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
            Ruolo in famiglia
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as FamilyRole)}
            className="cinput bg-white"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Annulla
        </button>
        <button
          onClick={() => selected && onSelect(selected, role)}
          disabled={!selected || saving}
          className="px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {saving ? "Aggiunta…" : "Aggiungi"}
        </button>
      </div>
    </div>
  );
}

// ─── Add member drawer ────────────────────────────────────────────────────────

function AddMemberDrawer({
  familyId,
  onAdded,
  onCancel,
}: {
  familyId: string;
  onAdded: (m: ResolvedMember) => void;
  onCancel: () => void;
}) {
  const [tab, setTab] = useState<"search" | "manual">("search");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLinked(profileId: string, role: FamilyRole) {
    setSaving(true);
    setError(null);
    try {
      onAdded(await addFamilyMember(familyId, { profile_id: profileId, role }));
    } catch (e: any) {
      setError(
        e.message.includes("unique")
          ? "Questa persona è già in una famiglia."
          : e.message,
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleUnlinked(data: UnlinkedMemberInput) {
    setSaving(true);
    setError(null);
    try {
      onAdded(await addFamilyMember(familyId, data));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 mt-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-gray-800">Aggiungi membro</p>
        <button
          onClick={onCancel}
          className="p-1 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <LuX size={14} />
        </button>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-gray-50 rounded-lg mb-4 border border-gray-100">
        {(["search", "manual"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
              tab === t
                ? "bg-white text-gray-800 shadow-sm border border-gray-100"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {t === "search" ? "Ha già un account" : "Non ha un account"}
          </button>
        ))}
      </div>

      {error && <ErrorBanner message={error} />}

      {tab === "search" ? (
        <ProfileSearch
          onSelect={handleLinked}
          onCancel={onCancel}
          saving={saving}
        />
      ) : (
        <UnlinkedMemberForm
          onSave={handleUnlinked}
          onCancel={onCancel}
          saving={saving}
          submitLabel="Aggiungi membro"
        />
      )}
    </div>
  );
}

// ─── Edit member drawer ───────────────────────────────────────────────────────

function EditMemberDrawer({
  member,
  onSave,
  onCancel,
  saving,
}: {
  member: ResolvedMember;
  onSave: (data: UnlinkedMemberInput) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 mt-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-gray-800">
          Modifica {member.name}
        </p>
        <button
          onClick={onCancel}
          className="p-1 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <LuX size={14} />
        </button>
      </div>
      {member.has_account ? (
        <p className="text-sm text-gray-400 py-2">
          Le informazioni di{" "}
          <span className="font-medium text-gray-600">{member.name}</span> sono
          gestite nel suo profilo personale. Puoi cambiare solo il ruolo.
        </p>
      ) : (
        <UnlinkedMemberForm
          initial={{
            name: member.name,
            lastname: member.lastname,
            email: member.email ?? "",
            phone: member.phone ?? "",
            birthdate: member.birthdate ?? "",
            role: member.role,
          }}
          onSave={onSave}
          onCancel={onCancel}
          saving={saving}
          submitLabel="Salva modifiche"
        />
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FamilySection() {
  const [family, setFamily] = useState<FamilyWithMembers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [editMember, setEditMember] = useState<ResolvedMember | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const f = await getMyFamily();
      setFamily(f);
      if (f) setNewName(f.name);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!createName.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const f = await createFamily(createName);
      setFamily(f);
      setNewName(f.name);
      setSuccess(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveName() {
    if (!family || !newName.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await updateFamilyName(family.id, newName);
      setFamily({ ...family, name: newName.trim() });
      setEditingName(false);
      setSuccess(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveEdit(data: UnlinkedMemberInput) {
    if (!editMember) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateUnlinkedMember(editMember.id, data);
      setFamily((f) =>
        f
          ? {
              ...f,
              members: f.members.map((m) =>
                m.id === updated.id ? updated : m,
              ),
            }
          : f,
      );
      setEditMember(null);
      setSuccess(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(memberId: string) {
    if (!confirm("Rimuovere questo membro dalla famiglia?")) return;
    setSaving(true);
    setError(null);
    try {
      await removeFamilyMember(memberId);
      setFamily((f) =>
        f ? { ...f, members: f.members.filter((m) => m.id !== memberId) } : f,
      );
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  // ── Loading ───────────────────────────────────────────────────────────────

  if (loading)
    return (
      <div className="flex items-center justify-center h-32 text-sm text-gray-400">
        Caricamento…
      </div>
    );

  // ── No family ─────────────────────────────────────────────────────────────

  if (!family)
    return (
      <div className="flex flex-col gap-4">
        {error && <ErrorBanner message={error} />}
        {!showCreate ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 border-2 border-dashed border-gray-100 rounded-xl text-center">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
              <MdFamilyRestroom size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Nessuna famiglia registrata
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Crea il profilo della tua famiglia per iniziare.
              </p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="mt-1 flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              <LuPlus size={14} /> Crea famiglia
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50">
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                Nome della famiglia
              </label>
              <input
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="es. Famiglia Rossi"
                className="cinput"
                autoFocus
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Verrai aggiunto automaticamente come capofamiglia.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCreate(false)}
                className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleCreate}
                disabled={saving || !createName.trim()}
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {saving ? "Creazione…" : "Crea famiglia"}
              </button>
            </div>
          </div>
        )}
      </div>
    );

  // ── Family exists ─────────────────────────────────────────────────────────

  const head = family.members.find((m) => m.role === "head");
  const rest = family.members.filter((m) => m.role !== "head");
  const isOwner = true; // replace with: currentUserId === family.created_by

  return (
    <div className="flex flex-col gap-1">
      {/* Family name row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {editingName ? (
            <>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="cinput text-sm font-semibold py-1"
                autoFocus
              />
              <button
                onClick={handleSaveName}
                disabled={saving}
                className="p-1.5 rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <LuCheck size={14} />
              </button>
              <button
                onClick={() => {
                  setEditingName(false);
                  setNewName(family.name);
                }}
                className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <LuX size={14} />
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-lg">
                <span className="text-sm font-semibold text-gray-800">
                  {family.name}
                </span>
                {isOwner && (
                  <button
                    onClick={() => setEditingName(true)}
                    className="p-1 rounded-md text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    <LuPencil size={12} />
                  </button>
                )}
              </div>
              <span className="text-xs text-gray-400">
                {family.members.length}{" "}
                {family.members.length === 1 ? "membro" : "membri"}
              </span>
            </>
          )}
        </div>
      </div>{" "}
      {error && <ErrorBanner message={error} />}
      {success && <SuccessBanner message="Modifiche salvate con successo." />}
      {/* Add drawer */}
      {showAdd && (
        <AddMemberDrawer
          familyId={family.id}
          onAdded={(m) => {
            setFamily((f) => (f ? { ...f, members: [...f.members, m] } : f));
            setShowAdd(false);
          }}
          onCancel={() => setShowAdd(false)}
        />
      )}
      {/* Edit drawer */}
      {editMember && (
        <EditMemberDrawer
          member={editMember}
          onSave={handleSaveEdit}
          onCancel={() => setEditMember(null)}
          saving={saving}
        />
      )}
      {/* Divider */}
      <div className="border-t border-gray-50 my-2" />
      {/* Members */}
      <div className="flex flex-col">
        {head && (
          <MemberRow
            key={head.id}
            member={head}
            isOwner={isOwner}
            onEdit={() => {
              setEditMember(head);
              setShowAdd(false);
            }}
            onRemove={() => handleRemove(head.id)}
          />
        )}
        {rest.map((m) => (
          <MemberRow
            key={m.id}
            member={m}
            isOwner={isOwner}
            onEdit={() => {
              setEditMember(m);
              setShowAdd(false);
            }}
            onRemove={() => handleRemove(m.id)}
          />
        ))}
        {family.members.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">
            Nessun membro aggiunto.
          </p>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          {isOwner && !showAdd && (
            <button
              onClick={() => {
                setShowAdd(true);
                setEditMember(null);
              }}
              className=" bg-white flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <FiUserPlus size={13} /> Aggiungi membro
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
