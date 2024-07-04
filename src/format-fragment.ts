const qualityOffset = 33;
const binaryToDNAMap = {
  '00': 'A',
  '01': 'C',
  '10': 'G',
  '11': 'T',
};
type BinaryKey = keyof typeof binaryToDNAMap;

const encodeQuality = (binaryQuality: string): string => {
  const numericValue = parseInt(binaryQuality, 2);
  return String.fromCharCode(numericValue + qualityOffset);
};

const entryTemplate = (
  entryIndex: number,
  dna: string,
  quality: string,
) => `@READ_${entryIndex}
${dna}
+READ_${entryIndex}
${quality}\n`;

export const formatFragment = (
  fragment: Buffer,
  entryIndex: number,
): string => {
  let dna = '';
  let quality = '';

  fragment.forEach((byte) => {
    const binaryString = byte.toString(2).padStart(8, '0');
    const key = binaryString.substring(0, 2);
    if (!(key in binaryToDNAMap)) {
      throw new Error(
        `Invalid key '${key}' encountered. These keys are supported: ${Object.keys(
          binaryToDNAMap,
        )}`,
      );
    }
    dna += binaryToDNAMap[key as BinaryKey];
    quality += encodeQuality(binaryString.substring(2));
  });

  return entryTemplate(entryIndex, dna, quality);
};
