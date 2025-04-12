
import ShareComponent from "./shareComponent";
export default async function App() {
  return (
    <div className="container-sub">
      <p>Condivi le canzoni della tua chiesa!</p>
      <h6>Crea codice per condivisione</h6>
      <ShareComponent />
    </div>
  );
}
