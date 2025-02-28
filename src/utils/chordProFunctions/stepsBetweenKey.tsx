import chromaticScale from "./chromaticScale";

export function stepsBetweenKeys(initialKey: string, finalKey: string) {
  if (finalKey) {
    const startIndex = chromaticScale.indexOf(initialKey);
    const endIndex = chromaticScale.indexOf(finalKey);

    if (startIndex === -1 || endIndex === -1) {
      // throw new Error("Invalid key provided. Please use valid chromatic scale notes.");
    }

    // Calculate steps, handling wrapping around the array
    const steps =
      (endIndex - startIndex + chromaticScale.length) % chromaticScale.length;

    return steps;
  }else{
    return 0;
  }
}
