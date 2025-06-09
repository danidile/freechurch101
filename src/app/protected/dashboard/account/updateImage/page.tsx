import ImageUploader from "@/app/protected/dashboard/account/updateImage/ImageUploader";

export default function Page() {
  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-4">Carica foto profilo</h1>
      <ImageUploader />
    </div>
  );
}
