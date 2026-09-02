"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ADMIN_NAV, isActiveAdminRoute } from "@/lib/nav";
import { cn } from "@/lib/utils";

const menuButtonClass =
  "h-11 gap-2.5 rounded-xl px-3 text-sm font-medium tracking-tight text-neutral-600 shadow-none md:h-9 md:px-2.5 md:text-[13px] " +
  "hover:bg-neutral-100/90 hover:text-neutral-900 " +
  "data-[active=true]:bg-[#111827] data-[active=true]:text-white " +
  "data-[active=true]:hover:bg-[#111827] data-[active=true]:hover:text-white " +
  "[&>svg]:size-5 [&>svg]:shrink-0 md:[&>svg]:size-[18px]";

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

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
              {ADMIN_NAV.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActiveAdminRoute(pathname, href)}
                    className={menuButtonClass}
                  >
                    <Link href={href} onClick={() => setOpenMobile(false)}>
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
