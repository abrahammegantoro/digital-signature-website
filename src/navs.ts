import { IconType } from "react-icons";
import {
  HiChartPie,
  HiInboxIn,
  HiViewGrid,
} from "react-icons/hi";

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
    title: "Dashboard",
    icon: HiChartPie,
  },
  {
    href: "/kanban",
    title: "Kanban",
    icon: HiViewGrid,
  },
  {
    href: "/mailing/inbox",
    title: "Inbox",
    icon: HiInboxIn,
    badge: "3",
  },
  {
    title: "E-commerce",
    items: [
      {
        href: "/e-commerce/products",
        title: "Products",
      },
      {
        href: "/e-commerce/billing",
        title: "Billing",
      },
      {
        href: "/e-commerce/invoice",
        title: "Invoice",
      },
    ],
  },
  {
    title: "Users",
    items: [
      {
        href: "/users/list",
        title: "Users list",
      },
      {
        href: "/users/profile",
        title: "Profile",
      },
      {
        href: "/users/feed",
        title: "Feed",
      },
      {
        href: "/users/settings",
        title: "Settings",
      },
    ],
  },
  {
    title: "Pages",
    items: [
      {
        href: "/pages/pricing",
        title: "Pricing",
      },
      {
        href: "/pages/maintenance",
        title: "Maintenance",
      },
      {
        href: "/pages/404",
        title: "404 not found",
      },
      {
        href: "/pages/500",
        title: "500 server error",
      },
    ],
  },
  {
    title: "Authentication",
    items: [
      {
        href: "/authentication/sign-in",
        title: "Sign in",
      },
      {
        href: "/authentication/sign-up",
        title: "Sign up",
      },
      {
        href: "/authentication/forgot-password",
        title: "Forgot password",
      },
      {
        href: "/authentication/reset-password",
        title: "Reset password",
      },
      {
        href: "/authentication/profile-lock",
        title: "Profile lock",
      },
    ],
  },
];