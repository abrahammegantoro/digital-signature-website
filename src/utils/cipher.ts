import { modifiedRC4Decrypt, modifiedRC4Encrypt } from "@/ciphers/modified_rc4";
import { crypt } from "@/ciphers/rsa";
import keccakHash from "@/ciphers/sha3";

import { NilaiMahasiswa } from "@/interface/interface";

export function encryptMahasiswaData(nim: string, nama: string, vigenere_key: string, rc4_key: string) {
  const encryptedNim = btoa(modifiedRC4Encrypt(nim, vigenere_key, rc4_key));
  const encryptedNama = btoa(modifiedRC4Encrypt(nama, vigenere_key, rc4_key));
  return { encryptedNim, encryptedNama };
}

export function decryptMahasiswaData(
  encryptedNim: string,
  encryptedNama: string,
  vigenere_key: string,
  rc4_key: string
) {
  const nim = modifiedRC4Decrypt(atob(encryptedNim), vigenere_key, rc4_key);
  const nama = modifiedRC4Decrypt(atob(encryptedNama), vigenere_key, rc4_key);
  return { nim, nama };
}

export function encryptCourseData(kode: string, nama: string, sks: number, vigenere_key: string, rc4_key: string) {
  const encryptedKode = btoa(modifiedRC4Encrypt(kode, vigenere_key, rc4_key));
  const encryptedNama = btoa(modifiedRC4Encrypt(nama, vigenere_key, rc4_key));
  const encryptedSks = btoa(
    modifiedRC4Encrypt(sks.toString(), vigenere_key, rc4_key)
  );
  return { encryptedKode, encryptedNama, encryptedSks };
}

export function decryptCourseData(
  encryptedKode: string,
  encryptedNama: string,
  encryptedSks: string,
  vigenere_key: string,
  rc4_key: string
) {
  const kode = modifiedRC4Decrypt(atob(encryptedKode), vigenere_key, rc4_key);
  const nama = modifiedRC4Decrypt(atob(encryptedNama), vigenere_key, rc4_key);
  const sks = Number(
    modifiedRC4Decrypt(atob(encryptedSks), vigenere_key, rc4_key)
  );
  return { kode, nama, sks };
}

export function encryptScoreData(kode: string, nilai: string, vigenere_key: string, rc4_key: string) {
  const encryptedKode = btoa(modifiedRC4Encrypt(kode, vigenere_key, rc4_key));
  const encryptedNilai = btoa(modifiedRC4Encrypt(nilai, vigenere_key, rc4_key));
  return { encryptedKode, encryptedNilai };
}

export function decryptScoreData(
  encryptedKode: string,
  encryptedNilai: string,
  vigenere_key: string,
  rc4_key: string
) {
  const kode = modifiedRC4Decrypt(atob(encryptedKode), vigenere_key, rc4_key);
  const nilai = modifiedRC4Decrypt(atob(encryptedNilai), vigenere_key, rc4_key);
  return { kode, nilai };
}

export function encryptIpkData(ipk: number, vigenere_key: string, rc4_key: string) {
  return btoa(modifiedRC4Encrypt(ipk.toString(), vigenere_key, rc4_key));
}

export function decryptDataMahasiswa(data: NilaiMahasiswa | NilaiMahasiswa[], vigenere_key: string, rc4_key: string): any {
  const decryptMahasiswa = (mahasiswa: NilaiMahasiswa) => {
    const decryptedFields = {
      nim: modifiedRC4Decrypt(atob(mahasiswa.nim), vigenere_key, rc4_key),
      nama: modifiedRC4Decrypt(atob(mahasiswa.nama), vigenere_key, rc4_key),
      tanda_tangan: mahasiswa.tanda_tangan.map((el) => {
        return modifiedRC4Decrypt(atob(el), vigenere_key, rc4_key);
      }),
    };

    const decryptedNilaiFields = Array.from({ length: 10 }, (_, index) => {
      const kode = mahasiswa[`kode_mk_${index + 1}` as keyof NilaiMahasiswa];
      const nama = mahasiswa[`nama_matkul_${index + 1}` as keyof NilaiMahasiswa];
      const nilai = mahasiswa[`nilai_${index + 1}` as keyof NilaiMahasiswa];
      const sks = mahasiswa[`sks_${index + 1}` as keyof NilaiMahasiswa];

      return {
        [`kode_mk_${index + 1}`]: kode !== '-' ? modifiedRC4Decrypt(atob(kode.toString()), vigenere_key, rc4_key) : '-',
        [`nama_matkul_${index + 1}`]: nama !== '-' ? modifiedRC4Decrypt(atob(nama.toString()), vigenere_key, rc4_key) : '-',
        [`nilai_${index + 1}`]: nilai !== '-' ? modifiedRC4Decrypt(atob(nilai.toString()), vigenere_key, rc4_key) : '-',
        [`sks_${index + 1}`]: sks !== '-' ? Number(modifiedRC4Decrypt(atob(sks.toString()), vigenere_key, rc4_key)) : '-',
      };
    });

    const flattenedDecryptedNilaiFields = decryptedNilaiFields.reduce(
      (acc, curr) => ({ ...acc, ...curr }),
      {}
    );

    return {
      ...decryptedFields,
      ...flattenedDecryptedNilaiFields,
      ipk: modifiedRC4Decrypt(atob(mahasiswa.ipk), vigenere_key, rc4_key),
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
  primeNumber: bigint,
  vigenere_key: string,
  rc4_key: string
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
    digitalSignature.push(btoa(modifiedRC4Encrypt(encryptedChar.toString(), vigenere_key, rc4_key)));
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
