"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <h1 className="text-lg font-semibold">Алдаа гарлаа</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Хуудсыг дахин ачаална уу. Хэрэв үргэлжилбэл бидэнтэй холбогдоно уу.
      </p>
      <Button className="mt-6 rounded-full" onClick={reset}>
        Дахин оролдох
      </Button>
    </div>
  );
}
