import { modifiedRC4Decrypt, modifiedRC4Encrypt } from "@/ciphers/modified_rc4";
import { crypt } from "@/ciphers/rsa";
import keccakHash from "@/ciphers/sha3";

import { NilaiMahasiswa } from "@/interface/interface";

const VIGENERE_KEY = process.env.NEXT_PUBLIC_VIGENERE_KEY;
const RC4_KEY = process.env.NEXT_PUBLIC_RC4_KEY;

export function encryptMahasiswaData(nim: string, nama: string) {
  const encryptedNim = btoa(modifiedRC4Encrypt(nim, VIGENERE_KEY, RC4_KEY));
  const encryptedNama = btoa(modifiedRC4Encrypt(nama, VIGENERE_KEY, RC4_KEY));
  return { encryptedNim, encryptedNama };
}

export function decryptMahasiswaData(
  encryptedNim: string,
  encryptedNama: string
) {
  const nim = modifiedRC4Decrypt(atob(encryptedNim), VIGENERE_KEY, RC4_KEY);
  const nama = modifiedRC4Decrypt(atob(encryptedNama), VIGENERE_KEY, RC4_KEY);
  return { nim, nama };
}

export function encryptCourseData(kode: string, nama: string, sks: number) {
  const encryptedKode = btoa(modifiedRC4Encrypt(kode, VIGENERE_KEY, RC4_KEY));
  const encryptedNama = btoa(modifiedRC4Encrypt(nama, VIGENERE_KEY, RC4_KEY));
  const encryptedSks = btoa(
    modifiedRC4Encrypt(sks.toString(), VIGENERE_KEY, RC4_KEY)
  );
  return { encryptedKode, encryptedNama, encryptedSks };
}

export function decryptCourseData(
  encryptedKode: string,
  encryptedNama: string,
  encryptedSks: string
) {
  const kode = modifiedRC4Decrypt(atob(encryptedKode), VIGENERE_KEY, RC4_KEY);
  const nama = modifiedRC4Decrypt(atob(encryptedNama), VIGENERE_KEY, RC4_KEY);
  const sks = Number(
    modifiedRC4Decrypt(atob(encryptedSks), VIGENERE_KEY, RC4_KEY)
  );
  return { kode, nama, sks };
}

export function encryptScoreData(kode: string, nilai: string) {
  const encryptedKode = btoa(modifiedRC4Encrypt(kode, VIGENERE_KEY, RC4_KEY));
  const encryptedNilai = btoa(modifiedRC4Encrypt(nilai, VIGENERE_KEY, RC4_KEY));
  return { encryptedKode, encryptedNilai };
}

export function decryptScoreData(
  encryptedKode: string,
  encryptedNilai: string
) {
  const kode = modifiedRC4Decrypt(atob(encryptedKode), VIGENERE_KEY, RC4_KEY);
  const nilai = modifiedRC4Decrypt(atob(encryptedNilai), VIGENERE_KEY, RC4_KEY);
  return { kode, nilai };
}

export function encryptIpkData(ipk: number) {
  return btoa(modifiedRC4Encrypt(ipk.toString(), VIGENERE_KEY, RC4_KEY));
}

export function decryptDataMahasiswa(data: NilaiMahasiswa | NilaiMahasiswa[]): any {
  const decryptMahasiswa = (mahasiswa: NilaiMahasiswa) => {
    const decryptedFields = {
      nim: modifiedRC4Decrypt(atob(mahasiswa.nim), VIGENERE_KEY, RC4_KEY),
      nama: modifiedRC4Decrypt(atob(mahasiswa.nama), VIGENERE_KEY, RC4_KEY),
      tanda_tangan: mahasiswa.tanda_tangan.map((el) => {
        return modifiedRC4Decrypt(atob(el), VIGENERE_KEY, RC4_KEY);
      }),
    };

    const decryptedNilaiFields = Array.from({ length: 10 }, (_, index) => {
      const kode = mahasiswa[`kode_mk_${index + 1}` as keyof NilaiMahasiswa];
      const nama = mahasiswa[`nama_matkul_${index + 1}` as keyof NilaiMahasiswa];
      const nilai = mahasiswa[`nilai_${index + 1}` as keyof NilaiMahasiswa];
      const sks = mahasiswa[`sks_${index + 1}` as keyof NilaiMahasiswa];

      return {
        [`kode_mk_${index + 1}`]: kode !== '-' ? modifiedRC4Decrypt(atob(kode.toString()), VIGENERE_KEY, RC4_KEY) : '-',
        [`nama_matkul_${index + 1}`]: nama !== '-' ? modifiedRC4Decrypt(atob(nama.toString()), VIGENERE_KEY, RC4_KEY) : '-',
        [`nilai_${index + 1}`]: nilai !== '-' ? modifiedRC4Decrypt(atob(nilai.toString()), VIGENERE_KEY, RC4_KEY) : '-',
        [`sks_${index + 1}`]: sks !== '-' ? Number(modifiedRC4Decrypt(atob(sks.toString()), VIGENERE_KEY, RC4_KEY)) : '-',
      };
    });

    const flattenedDecryptedNilaiFields = decryptedNilaiFields.reduce(
      (acc, curr) => ({ ...acc, ...curr }),
      {}
    );

    return {
      ...decryptedFields,
      ...flattenedDecryptedNilaiFields,
      ipk: modifiedRC4Decrypt(atob(mahasiswa.ipk), VIGENERE_KEY, RC4_KEY),
    };
  };

  if (Array.isArray(data)) {
    return data.map(decryptMahasiswa);
  } else {
    return decryptMahasiswa(data);
  }
}

export function assignDigitalSignature(
  data: NilaiMahasiswa,
  privateKey: bigint,
  primeNumber: bigint
) {
  const dataString = Object.keys(data)
    .filter(
      (key) =>
        key !== "nama" &&
        key !== "nim" &&
        key !== "ipk" &&
        key !== "tanda_tangan"
    )
    .map((key) => data[key as keyof NilaiMahasiswa])
    .join("");

  const hashedMessage = keccakHash(dataString);

  let digitalSignature: string[] = [];
  for (let i = 0; i < hashedMessage.length; i++) {
    const encryptedChar = crypt(
      BigInt(hashedMessage.charCodeAt(i)),
      privateKey,
      primeNumber
    );
    digitalSignature.push(btoa(modifiedRC4Encrypt(encryptedChar.toString(), VIGENERE_KEY, RC4_KEY)));
  }
  
  return digitalSignature;
}

export function verifyDigitalSignature(
  data: NilaiMahasiswa,
  publicKey: bigint,
  primeNumber: bigint,
) {
  const digitalSignature = data.tanda_tangan;
  const dataString = Object.keys(data)
    .filter(
      (key) =>
        key !== "nama" &&
        key !== "nim" &&
        key !== "ipk" &&
        key !== "tanda_tangan"
    )
    .map((key) => data[key as keyof NilaiMahasiswa])
    .join("");

  const hashedMessage = keccakHash(dataString);

  let decryptedMessage = "";
  for (let i = 0; i < digitalSignature.length; i++) {
    const decryptedChar = crypt(
      BigInt(digitalSignature[i]),
      publicKey,
      primeNumber
    );
    decryptedMessage += String.fromCharCode(Number(decryptedChar));
  }
  
  return hashedMessage === decryptedMessage;
}
