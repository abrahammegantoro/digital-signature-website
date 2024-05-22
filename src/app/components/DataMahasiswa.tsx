"use client";
import DSDataTable from "@/components/DSDataTable";
import { NilaiMahasiswa } from "@/interface/interface";
import { ToggleSwitch } from "flowbite-react";
import { useState } from "react";
import { set } from "react-hook-form";

export default function DataMahasiswa({
  nilaiMahasiswaEncrypt,
  nilaiMahasiswaDecrypt,
}: {
  nilaiMahasiswaEncrypt: NilaiMahasiswa[];
  nilaiMahasiswaDecrypt: NilaiMahasiswa[];
}) {
  const [isDataEncrypted, setIsDataEncrypted] = useState(true);
  const [isSignatureEncrypted, setIsSignatureEncrypted] = useState(true);
  console.log("nilaiMahasiswaEncrypt", nilaiMahasiswaEncrypt);
  console.log("nilaiMahasiswaDecrypt", nilaiMahasiswaDecrypt);

  const mahasiswaEncrypt = nilaiMahasiswaEncrypt.map((mahasiswa) => {
    const { tanda_tangan, ...rest } = mahasiswa;
    return rest;
  });

  const mahasiswaDecrypt = nilaiMahasiswaDecrypt.map((mahasiswa) => {
    const { tanda_tangan, ...rest } = mahasiswa;
    return rest;
  });

  const tandaTanganEncrypt = nilaiMahasiswaEncrypt.map((mahasiswa) => {
    return mahasiswa.tanda_tangan;
  });

  const tandaTanganDecrypt = nilaiMahasiswaDecrypt.map((mahasiswa) => {
    return mahasiswa.tanda_tangan;
  });

  const dataMahasiswa = isDataEncrypted ? mahasiswaEncrypt : mahasiswaDecrypt;
  const dataTandaTangan = isSignatureEncrypted
    ? tandaTanganEncrypt
    : tandaTanganDecrypt;

  const dataShown = dataMahasiswa.map((mahasiswa, index) => {
    return { ...mahasiswa, tanda_tangan: dataTandaTangan[index] };
  });

  return (
    <div className="w-full">
      <div className="flex justify-end gap-4 mb-5">
        <ToggleSwitch
          label="Encrypt Data Mahasiswa"
          checked={isDataEncrypted}
          onChange={setIsDataEncrypted}
        />
        <ToggleSwitch
          label="Encrypt Tanda Tangan"
          checked={isSignatureEncrypted}
          onChange={setIsSignatureEncrypted}
        />
      </div>
      <DSDataTable
        title="Data Mahasiswa"
        items={dataShown}
        totalItemsCount={100}
        disableMultiActions
        disableCheckboxes
      />
    </div>
  );
}
