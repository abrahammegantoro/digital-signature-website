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
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { generateTranscript } from "@/utils/generateTranscript";
import { useKaprodiContext } from "@/context/KaprodiProviders";
import DSTextField from "@/components/DSTextField";
import { encrypt } from "@/ciphers/aes";

export default function DataMahasiswa({
  nilaiMahasiswaEncrypt,
  nilaiMahasiswaDecrypt,
  listKaprodi,
  public_key,
  private_key
}: {
  nilaiMahasiswaEncrypt: NilaiMahasiswa[];
  nilaiMahasiswaDecrypt: NilaiMahasiswa[];
  listKaprodi: KetuaProgramStudi[];
  public_key: string;
  private_key: string;
}) {
  const router = useRouter();

  const [isDataEncrypted, setIsDataEncrypted] = useState(true);
  const [isSignatureEncrypted, setIsSignatureEncrypted] = useState(true);
  const [openKeyModal, setOpenKeyModal] = useState(false);
  const [toggleType, setToggleType] = useState("")
  const [rc4Key, setRc4Key] = useState("");
  const [vigenereKey, setVigenereKey] = useState("");

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
      BigInt(kaprodi.prime_number),
      private_key,
      public_key
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
      const pdfBytes = await generateTranscript(decryptedData, kaprodi.nama);
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

  const handleToggleEncryption = (type: string) => {
    setToggleType(type);
    setOpenKeyModal(true);
  };

  const handleSubmitKeys = () => {
    if (!rc4Key || !vigenereKey) {
      toast.error("Please fill in the keys");
      return;
    }

    if (rc4Key !== public_key || vigenereKey !== private_key) {
      toast.error("Invalid keys");
      return;
    }

    if (toggleType === "data") {
      setIsDataEncrypted(!isDataEncrypted);
    } else {
      setIsSignatureEncrypted(!isSignatureEncrypted);
    }
    
    toast.success("Keys submitted successfully");
    setRc4Key("");
    setVigenereKey("");
    setOpenKeyModal(false);
  };

  return (
    <div className="w-full">
      <div className="flex justify-end gap-4 mb-5">
        <ToggleSwitch
          label="Encrypt Data Mahasiswa"
          checked={isDataEncrypted}
          onChange={(checked: boolean) => handleToggleEncryption("data")}
        />
        <ToggleSwitch
          label="Encrypt Tanda Tangan"
          checked={isSignatureEncrypted}
          onChange={(checked: boolean) => handleToggleEncryption("signature")}
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

<Modal show={openKeyModal} onClose={() => setOpenKeyModal(false)}>
        <Modal.Header>Enter Encryption Keys</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <DSTextField
              label="RC4 Key"
              value={rc4Key}
              onChange={(e) => setRc4Key(e.target.value)}
              required
            />
            <DSTextField
              label="Vigenere Key"
              value={vigenereKey}
              onChange={(e) => setVigenereKey(e.target.value)}
              required
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmitKeys}>Submit</Button>
          <Button color="gray" onClick={() => setOpenKeyModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
