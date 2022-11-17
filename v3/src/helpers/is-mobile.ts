export default function (): boolean {
  return (
    "ontouchstart" in window ||
    // @ts-ignore
    (window.DocumentTouch && document instanceof DocumentTouch)
  );
}
