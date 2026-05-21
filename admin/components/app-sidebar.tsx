"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Тойм", icon: LayoutDashboard },
  { href: "/products", label: "Бүтээгдэхүүн", icon: Package },
  { href: "/orders", label: "Захиалга", icon: ShoppingCart },
  { href: "/categories", label: "Ангилал", icon: Tags },
] as const;

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const menuButtonClass =
  "h-9 gap-2.5 rounded-xl px-2.5 text-[13px] font-medium tracking-tight text-neutral-600 shadow-none " +
  "hover:bg-neutral-100/90 hover:text-neutral-900 " +
  "data-[active=true]:bg-[#111827] data-[active=true]:text-white " +
  "data-[active=true]:hover:bg-[#111827] data-[active=true]:hover:text-white " +
  "[&>svg]:size-[18px] [&>svg]:shrink-0";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      className={cn(
        "border-r border-neutral-200/90 bg-transparent",
        "[&_[data-slot=sidebar-inner]]:bg-white",
      )}
    >
      <SidebarHeader className="border-b border-neutral-200/90 px-3 py-3">
        <div className="flex flex-col gap-0.5 px-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Petti
          </span>
          <span className="text-[15px] font-semibold leading-tight tracking-tight text-neutral-900">
            Admin
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-1.5 pt-2">
        <SidebarGroup className="p-0 px-0.5">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {nav.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActiveRoute(pathname, href)}
                    className={menuButtonClass}
                  >
                    <Link href={href}>
                      <Icon aria-hidden />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
