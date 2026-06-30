"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { Input, Button, addToast } from "@heroui/react";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "@/i18n/navigation";
import { getProfileById } from "@/hooks/GET/getProfileById";
import ImageUploader from "../updateImage/ImageUploader";
import { updateFullAccountAction } from "./updateFullAccountAction";
import { geocodeAddress } from "./geocodeAction";
import { GeocodeResult } from "./geocodeTypes";
import ChurchLabLoader from "@/app/[locale]/components/churchLabSpinner";
import {
  LuUser,
  LuMail,
  LuMapPin,
  LuShield,
  LuImage,
  LuSearch,
  LuTriangleAlert,
} from "react-icons/lu";
import { IconType } from "react-icons";

type ProfileRow = {
  name?: string;
  lastname?: string;
  phone?: string;
  email?: string;
  birthday?: string;
  baptism_date?: string;
  address?: string;
  city?: string;
  province?: string;
  cap?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
};

export default function UpdateAccountForm() {
  const { userData, loading, fetchUser } = useUserStore();
  const router = useRouter();

  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  // Profile fields
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [baptismDate, setBaptismDate] = useState("");

  // Address
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [cap, setCap] = useState("");

  // Address search
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Emergency contact
  const [ecName, setEcName] = useState("");
  const [ecPhone, setEcPhone] = useState("");

  // Password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!userData?.id) return;
      const p = (await getProfileById(userData.id)) as ProfileRow | null;
      if (p) {
        setName(p.name ?? "");
        setLastname(p.lastname ?? "");
        setPhone(p.phone ?? "");
        setEmail(p.email ?? userData.email ?? "");
        setBirthday(p.birthday ? String(p.birthday).split("T")[0] : "");
        setBaptismDate(
          p.baptism_date ? String(p.baptism_date).split("T")[0] : ""
        );
        setAddress(p.address ?? "");
        setCity(p.city ?? "");
        setProvince(p.province ?? "");
        setCap(p.cap ?? "");
        setEcName(p.emergency_contact_name ?? "");
        setEcPhone(p.emergency_contact_phone ?? "");
      }
      setLoaded(true);
    };
    load();
  }, [userData?.id, userData?.email]);

  const onSearchChange = (value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }
    setSearchLoading(true);
    debounceRef.current = setTimeout(async () => {
      const r = await geocodeAddress(value);
      setResults(r);
      setShowResults(true);
      setSearchLoading(false);
    }, 450);
  };

  const selectResult = (r: GeocodeResult) => {
    if (r.address) setAddress(r.address);
    if (r.city) setCity(r.city);
    if (r.province) setProvince(r.province);
    if (r.cap) setCap(r.cap);
    setShowResults(false);
    setSearchQuery("");
    setResults([]);
  };

  const handleSave = async () => {
    if (newPassword || confirmPassword) {
      if (newPassword.length < 6) {
        addToast({
          title: "Password troppo corta",
          description: "La password deve contenere almeno 6 caratteri.",
          color: "danger",
        });
        return;
      }
      if (newPassword !== confirmPassword) {
        addToast({
          title: "Le password non coincidono",
          description: "Controlla di aver inserito la stessa password.",
          color: "danger",
        });
        return;
      }
    }

    setSaving(true);
    const res = await updateFullAccountAction({
      name,
      lastname,
      phone,
      birthday: birthday || null,
      baptism_date: baptismDate || null,
      address: address || null,
      city: city || null,
      province: province || null,
      cap: cap || null,
      emergency_contact_name: ecName || null,
      emergency_contact_phone: ecPhone || null,
      newPassword: newPassword || null,
    });
    setSaving(false);

    if (res.success) {
      addToast({
        title: "Account aggiornato",
        description: "Le tue informazioni sono state salvate.",
        color: "success",
      });
      setNewPassword("");
      setConfirmPassword("");
      await fetchUser();
      router.push("/protected/dashboard/account");
    } else {
      addToast({
        title: "Errore durante il salvataggio",
        description: res.error ?? "Riprova più tardi.",
        color: "danger",
      });
    }
  };

  if (loading || !userData || !loaded) return <ChurchLabLoader />;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:py-10">
      <div className="mb-6">
        <p className="text-sm text-default-400">Account / Aggiorna</p>
        <h1 className="text-2xl font-semibold text-default-900 mt-1">
          Aggiorna il tuo account
        </h1>
      </div>

      <div className="flex flex-col gap-5">
        {/* Photo */}
        <SectionCard title="Foto profilo" icon={LuImage}>
          <ImageUploader type="profilepicture" />
        </SectionCard>

        {/* Personal info */}
        <SectionCard title="Informazioni personali" icon={LuUser}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nome"
              labelPlacement="outside"
              placeholder="Nome"
              value={name}
              onValueChange={setName}
            />
            <Input
              label="Cognome"
              labelPlacement="outside"
              placeholder="Cognome"
              value={lastname}
              onValueChange={setLastname}
            />
            <Input
              label="Telefono"
              labelPlacement="outside"
              placeholder="+39 …"
              value={phone}
              onValueChange={setPhone}
            />
            <Input
              type="date"
              label="Data di nascita"
              labelPlacement="outside"
              placeholder=" "
              value={birthday}
              onValueChange={setBirthday}
            />
            <Input
              type="date"
              label="Data di battesimo"
              labelPlacement="outside"
              placeholder=" "
              value={baptismDate}
              onValueChange={setBaptismDate}
            />
          </div>
        </SectionCard>

        {/* Email (read-only) */}
        <SectionCard title="Email di accesso" icon={LuMail}>
          <Input
            label="Email"
            labelPlacement="outside"
            value={email}
            isDisabled
            description="L'email di accesso non può essere modificata."
          />
        </SectionCard>

        {/* Address */}
        <SectionCard
          title="Indirizzo"
          icon={LuMapPin}
          description="Cerca e compila automaticamente, oppure inserisci a mano."
        >
          <div className="relative">
            <Input
              label="Cerca indirizzo"
              labelPlacement="outside"
              placeholder="Es. Via Roma 12, Milano"
              value={searchQuery}
              onValueChange={onSearchChange}
              startContent={<LuSearch className="text-default-400" size={16} />}
              isClearable
              onClear={() => {
                setSearchQuery("");
                setResults([]);
                setShowResults(false);
              }}
            />
            {showResults && (
              <div className="absolute z-20 left-0 right-0 mt-1 bg-content1 border border-divider rounded-lg overflow-hidden shadow-lg">
                {searchLoading ? (
                  <div className="px-3 py-2 text-sm text-default-400">
                    Ricerca…
                  </div>
                ) : results.length ? (
                  results.map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => selectResult(r)}
                      className="w-full text-left px-3 py-2 text-sm text-default-700 hover:bg-default-100 border-b border-divider last:border-0"
                    >
                      {r.label}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-default-400">
                    Nessun risultato.
                  </div>
                )}
              </div>
            )}
            <p className="text-[11px] text-default-400 mt-1">
              Risultati da OpenStreetMap · gratis, senza chiave
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="sm:col-span-2">
              <Input
                label="Via e civico"
                labelPlacement="outside"
                placeholder="Via Roma 12"
                value={address}
                onValueChange={setAddress}
              />
            </div>
            <Input
              label="CAP"
              labelPlacement="outside"
              placeholder="20121"
              value={cap}
              onValueChange={setCap}
            />
            <div className="sm:col-span-2">
              <Input
                label="Città"
                labelPlacement="outside"
                placeholder="Milano"
                value={city}
                onValueChange={setCity}
              />
            </div>
            <Input
              label="Provincia"
              labelPlacement="outside"
              placeholder="MI"
              value={province}
              onValueChange={setProvince}
            />
          </div>
        </SectionCard>

        {/* Emergency contact */}
        <SectionCard title="Contatto di emergenza" icon={LuTriangleAlert}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nome contatto"
              labelPlacement="outside"
              placeholder="Es. Sara Bianchi"
              value={ecName}
              onValueChange={setEcName}
            />
            <Input
              label="Telefono contatto"
              labelPlacement="outside"
              placeholder="+39 …"
              value={ecPhone}
              onValueChange={setEcPhone}
            />
          </div>
        </SectionCard>

        {/* Security */}
        <SectionCard
          title="Sicurezza"
          icon={LuShield}
          description="Lascia vuoto per non cambiare la password."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="password"
              label="Nuova password"
              labelPlacement="outside"
              placeholder="Minimo 6 caratteri"
              value={newPassword}
              onValueChange={setNewPassword}
            />
            <Input
              type="password"
              label="Conferma password"
              labelPlacement="outside"
              placeholder="Ripeti la password"
              value={confirmPassword}
              onValueChange={setConfirmPassword}
            />
          </div>
        </SectionCard>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-1">
          <Button
            variant="flat"
            onPress={() => router.push("/protected/dashboard/account")}
          >
            Annulla
          </Button>
          <Button color="primary" isLoading={saving} onPress={handleSave}>
            Salva modifiche
          </Button>
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  description,
  children,
}: {
  title: string;
  icon?: IconType;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-content1 rounded-xl border border-divider p-4 sm:p-5">
      <div className="flex items-start gap-3 mb-5">
        {Icon && (
          <span className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/10 text-primary">
            <Icon size={18} />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-default-900">{title}</h2>
          {description && (
            <p className="text-sm text-default-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
