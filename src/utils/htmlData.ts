/** Safe inside an HTML data-script element, including mixed-case </script> text. */
export function serializeJsonForHtml(value: unknown): string {
  const json = JSON.stringify(value);
  if (json === undefined) throw new TypeError('HTML data must be JSON serializable.');
  return json.replace(/</g, '\\u003c');
}
