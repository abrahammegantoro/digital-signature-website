import { HTMLProps } from "react";

export interface InputProps extends HTMLProps {
  error?: any;
  errors?: { [key: string]: any };
  inputClass?: string;
  label?: string | boolean;
  hideHelperText?: boolean;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
}

export interface SelectOptionEnum {
  [key: string | number]: string;
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectInputProps<>extends InputProps {
  autoCase?: "capital" | "camel" | "snake" | "kebab" | "constant";
  options: { [key: string]: string } | string[];
  enablePlaceholder?: boolean;
}

export interface NilaiMahasiswa {
  nim: string;
  nama: string;
  kode_mk_1: string;
  nama_matkul_1: string;
  nilai_1: string;
  sks_1: number | string;
  kode_mk_2: string;
  nama_matkul_2: string;
  nilai_2: string;
  sks_2: number | string;
  kode_mk_3: string;
  nama_matkul_3: string;
  nilai_3: string;
  sks_3: number | string;
  kode_mk_4: string;
  nama_matkul_4: string;
  nilai_4: string;
  sks_4: number | string;
  kode_mk_5: string;
  nama_matkul_5: string;
  nilai_5: string;
  sks_5: number | string;
  kode_mk_6: string;
  nama_matkul_6: string;
  nilai_6: string;
  sks_6: number | string;
  kode_mk_7: string;
  nama_matkul_7: string;
  nilai_7: string;
  sks_7: number | string;
  kode_mk_8: string;
  nama_matkul_8: string;
  nilai_8: string;
  sks_8: number | string;
  kode_mk_9: string;
  nama_matkul_9: string;
  nilai_9: string;
  sks_9: number | string;
  kode_mk_10: string;
  nama_matkul_10: string;
  nilai_10: string;
  sks_10: number | string;
  ipk: number;
  tanda_tangan: string;
}
