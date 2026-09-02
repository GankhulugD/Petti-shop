"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { AdminBottomNav } from "@/components/admin-bottom-nav";
import { AppSidebar } from "@/components/app-sidebar";
import { UserMenu } from "@/components/user-menu";

const titles: Record<string, string> = {
  "/": "Тойм",
  "/products": "Бүтээгдэхүүн",
  "/orders": "Захиалга",
  "/categories": "Ангилал",
};

function headerTitle(pathname: string) {
  if (titles[pathname]) return titles[pathname];
  if (pathname === "/products/new") return "Шинэ бараа";
  if (pathname.startsWith("/products/")) return "Бараа засах";
  const base = `/${pathname.split("/")[1]}`;
  return titles[base] ?? "Dashboard";
}

export function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageTitle = headerTitle(pathname);

  return (
    <SidebarProvider className="overflow-x-hidden">
      <AppSidebar />
      <SidebarInset className="flex min-h-svh min-w-0 flex-col bg-background">
        <header className="sticky top-0 z-30 shrink-0 border-b border-neutral-200/80 bg-card/95 px-3 py-2.5 backdrop-blur-md supports-[backdrop-filter]:bg-card/90 sm:px-5 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <SidebarTrigger className="-ml-0.5 hidden size-9 shrink-0 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 md:inline-flex" />
              <h1 className="truncate text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl lg:text-2xl">
                {pageTitle}
              </h1>
            </div>

            <div className="hidden min-w-0 flex-1 items-center justify-end gap-2 md:flex lg:max-w-[min(100%,28rem)] xl:max-w-md">
              <div className="relative w-full flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
                  aria-hidden
                />
                <Input
                  type="search"
                  placeholder="Хайх…"
                  className="h-9 w-full rounded-full border-neutral-200/90 bg-neutral-100/60 pl-9 pr-3 text-sm text-neutral-900 shadow-none placeholder:text-neutral-400 focus-visible:border-neutral-300 focus-visible:ring-[#111827]/15 sm:h-10"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9 shrink-0 rounded-full text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                aria-label="Мэдэгдэл"
              >
                <Bell className="size-[18px]" />
              </Button>
            </div>

            <UserMenu />
          </div>
        </header>

        <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">{children}</div>
        <AdminBottomNav />
      </SidebarInset>
    </SidebarProvider>
  );
}
