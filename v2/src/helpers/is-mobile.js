export default function() {
  return (
    'ontouchstart' in window ||
    (window.DocumentTouch && document instanceof DocumentTouch)
  );
}
