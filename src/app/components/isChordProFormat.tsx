
export default function isChordProFormat(text: string): boolean {
  const bracketMatches = text.match(/[\[\]]/g);
  return !!bracketMatches && bracketMatches.length > 5;
}
