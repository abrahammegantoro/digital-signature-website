"use client";
import DSDataTable from "@/components/DSDataTable";
import { NilaiMahasiswa } from "@/interface/interface";
import {
  assignDigitalSignature,
  decryptDataMahasiswa,
  verifyDigitalSignature,
} from "@/utils/cipher";
import { KetuaProgramStudi } from "@prisma/client";
import { Button, Modal, ToggleSwitch } from "flowbite-react";
import { useState } from "react";
import { set } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { generateTranscript } from "@/utils/generateTranscript";
import { useKaprodiContext } from "@/context/KaprodiProviders";

export default function DataMahasiswa({
  nilaiMahasiswaEncrypt,
  nilaiMahasiswaDecrypt,
  listKaprodi,
}: {
  nilaiMahasiswaEncrypt: NilaiMahasiswa[];
  nilaiMahasiswaDecrypt: NilaiMahasiswa[];
  listKaprodi: KetuaProgramStudi[];
}) {
  const router = useRouter();

  const [isDataEncrypted, setIsDataEncrypted] = useState(true);
  const [isSignatureEncrypted, setIsSignatureEncrypted] = useState(true);

  const { kaprodi: idKaprodi } = useKaprodiContext();
  
  const kaprodi = listKaprodi.find((kaprodi) => kaprodi.id === idKaprodi);

  if (!kaprodi) {
    return null;
  }

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

  const [openModal, setOpenModal] = useState(
    Array(dataShown.length).fill(false)
  );

  const toggleModal = (index: number) => {
    setOpenModal((prev) => {
      const newOpenModal = [...prev];
      newOpenModal[index] = !newOpenModal[index];
      return newOpenModal;
    });
  };

  const handleAssign = async (index: number) => {
    const loadingToast = toast.loading("Submitting data...");
    const digitalSignature = assignDigitalSignature(
      nilaiMahasiswaDecrypt[index],
      BigInt(kaprodi.private_key),
      BigInt(kaprodi.prime_number)
    );

    try {
      const response = await fetch(`/api/digital-signature/${nilaiMahasiswaEncrypt[index].nim}`, {
        method: "PATCH",
        body: JSON.stringify({ tanda_tangan: digitalSignature }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      const result = await response.json();
      toast.success(result.message, { id: loadingToast });
      router.refresh();
    } catch (error) {
      toast.error("Failed to submit data", { id: loadingToast });
      console.error("Error saving key:", error);
    }
  };

  const handleVerify = (index: number) => {
    const loadingToast = toast.loading("Submitting data...");

    const data = nilaiMahasiswaDecrypt[index];

    const isVerified = verifyDigitalSignature(
      data,
      BigInt(kaprodi.public_key),
      BigInt(kaprodi.prime_number)
    );

    if (isVerified) {
      toast.success("Signature Verification Success", { id: loadingToast });
    } else {
      toast.error("Signature Verification Failed", { id: loadingToast });
    }
  };

  const handleDownload = async (index: number) => {
    const loadingToast = toast.loading("Submitting data...");
    const decryptedData = nilaiMahasiswaDecrypt[index];
    try {
      const pdfBytes = await generateTranscript(decryptedData);
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${decryptedData.nim}_transcript.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Transcript downloaded successfully", { id: loadingToast });
    } catch (error) {
      toast.error("Failed to download transcript", { id: loadingToast });
      console.error("Download error:", error);
    }
  };

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
        disableCheckboxes
        onDownload={(index) => {
          handleDownload(index);
        }}
        onAssign={(index) => {
          handleAssign(index);
        }}
        onVerify={(index) => {
          handleVerify(index);
        }}
        scopedSlots={{
          tanda_tangan: (item: NilaiMahasiswa, index: number) => (
            <>
              <Button onClick={() => toggleModal(index)}>
                Lihat Digital Signature
              </Button>
              <Modal show={openModal[index]} onClose={() => toggleModal(index)}>
                <Modal.Header>Digital Signature</Modal.Header>
                <Modal.Body>
                  <div className="text-wrap">
                    <p className="text-base leading-relaxed text-black dark:text-gray-400">
                      {item.tanda_tangan.join("")}
                    </p>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={() => toggleModal(index)}>Close</Button>
                </Modal.Footer>
              </Modal>
            </>
          ),
        }}
      />
    </div>
  );
}
