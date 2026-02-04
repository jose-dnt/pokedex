export function capitalizeFirstLetter(text: string) {
  if (!text || !text.trim()) return;
  return text.charAt(0).toUpperCase() + text.slice(1);
}