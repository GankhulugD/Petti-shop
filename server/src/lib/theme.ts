export function mergeThemeConfig(
  current: Record<string, unknown>,
  patch: Record<string, unknown>,
): Record<string, unknown> {
  const next: Record<string, unknown> = { ...current, ...patch };
  const currentColors =
    current.colors && typeof current.colors === "object"
      ? (current.colors as Record<string, unknown>)
      : {};
  const patchColors =
    patch.colors && typeof patch.colors === "object"
      ? (patch.colors as Record<string, unknown>)
      : undefined;
  if (patchColors) {
    next.colors = { ...currentColors, ...patchColors };
  }
  return next;
}
