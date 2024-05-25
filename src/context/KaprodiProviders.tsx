"use client";

import { createContext, useContext, useState } from "react";

const KaprodiContext = createContext({
  kaprodi: 1,
  setKaprodi: (kaprodi: number) => {},
});

export default function KaprodiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [kaprodi, setKaprodi] = useState(1);
  return (
    <KaprodiContext.Provider
      value={{
        kaprodi,
        setKaprodi,
      }}
    >
      {children}
    </KaprodiContext.Provider>
  );
}

export function useKaprodiContext() {
  return useContext(KaprodiContext);
}
