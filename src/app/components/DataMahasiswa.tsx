"use client"
import DSDataTable from "@/components/DSDataTable";
import { NilaiMahasiswa } from "@/interface/interface";

export default function DataMahasiswa({ nilaiMahasiswa }: { nilaiMahasiswa: NilaiMahasiswa[] }) {
    return (
        <div className="w-full">
            <DSDataTable
                title="Data Mahasiswa"
                items={nilaiMahasiswa}
                totalItemsCount={100}
                disableMultiActions
                disableCheckboxes
            />
        </div>
    );
}
