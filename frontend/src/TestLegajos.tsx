import { useEffect, useState } from "react";
 
function TestLegajos() {
  const [data, setData] = useState<unknown>(null);
 
  useEffect(() => {
    fetch("/api/v1/legajos")
      .then((res) => res.json())
      .then((json) => {
        console.log("legajos recibidos:", json);
        setData(json);
      })
      .catch((err) => console.error("fetch falló:", err));
  }, []);
 
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

export default TestLegajos
