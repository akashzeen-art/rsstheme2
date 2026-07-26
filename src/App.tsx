import { useState } from "react";
import Home from "./pages/Home";
import Preloader from "./components/Preloader";

export default function App() {
  const [done, setDone] = useState(false);

  return (
    <>
      {!done && <Preloader onDone={() => setDone(true)} />}
      {done && <Home />}
    </>
  );
}
