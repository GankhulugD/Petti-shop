/** "₮ 485.000" → 485000 */
export function parseMntFromLabel(label: string): number {
  const digits = label.replace(/\D/g, "");
  if (!digits) return 0;
  return parseInt(digits, 10);
}
