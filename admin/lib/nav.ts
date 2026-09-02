import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
} from "lucide-react";

export const ADMIN_NAV = [
  { href: "/", label: "Тойм", shortLabel: "Тойм", icon: LayoutDashboard },
  {
    href: "/products",
    label: "Бүтээгдэхүүн",
    shortLabel: "Бараа",
    icon: Package,
  },
  {
    href: "/orders",
    label: "Захиалга",
    shortLabel: "Захиалга",
    icon: ShoppingCart,
  },
  {
    href: "/categories",
    label: "Ангилал",
    shortLabel: "Ангилал",
    icon: Tags,
  },
] as const;

export function isActiveAdminRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
