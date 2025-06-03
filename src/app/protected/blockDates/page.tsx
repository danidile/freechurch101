import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";
import BlockDatesComponent from "./blockDatesComponent";

export default async function App() {
  const userData: basicUserData = await fbasicUserData();
  return (
    <div className="container-sub">
      <h1>Blocca date</h1>

      <p className="text-center">
        Inserisci durante quali date non sarai disponibile
        <br /> per essere aggiunto nelle turnazioni.
      </p>
      <div className="form-div crea-setlist-container">
        <BlockDatesComponent />
      </div>
    </div>
  );
}
