import { IconType } from "react-icons";
import { HiDatabase } from "react-icons/hi";
import { LuTextCursorInput } from "react-icons/lu";

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
    href: "/input",
    title: "Input Form",
    icon: LuTextCursorInput,
  },
];
