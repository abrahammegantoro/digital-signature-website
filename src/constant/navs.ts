import { IconType } from "react-icons";
import { HiDatabase } from "react-icons/hi";
import { LuTextCursorInput } from "react-icons/lu";
import { IoBook, IoPerson } from "react-icons/io5";
import { MdClass } from "react-icons/md";

export interface SidebarItem {
  href: string;
  label?: string;
  title?: string;
  icon?: IconType;
  badge?: string;
}

export interface SidebarGroup {
  label?: string;
  title?: string;
  icon?: IconType;
  items: SidebarItem[];
}

export const sidebarItems: (SidebarGroup | SidebarItem)[] = [
  {
    href: "/",
    title: "Database",
    icon: HiDatabase,
  },
  {
    title: "Input Form",
    icon: LuTextCursorInput,
    items: [
      {
        href: "/input/nilai",
        title: "Input Nilai",
        icon: IoBook,
      },
      {
        href: "/input/mahasiswa",
        title: "Input Mahasiswa",
        icon: IoPerson,
      },
      {
        href: "/input/mata-kuliah",
        title: "Input Mata Kuliah",
        icon: MdClass,
      },
    ]
  },
];
