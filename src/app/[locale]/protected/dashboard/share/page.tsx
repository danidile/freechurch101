import { getShareCode } from "@/hooks/GET/getShareCode";
import ShareComponent from "./shareComponent";

export default async function App() {
  const shareCode: string = await getShareCode();
  return (
    <div className="container-sub">
      <p>Condivi le canzoni della tua chiesa!</p>
      <h6>Crea codice per condivisione</h6>
      <ShareComponent shareCode={shareCode} />
    </div>
  );
}
