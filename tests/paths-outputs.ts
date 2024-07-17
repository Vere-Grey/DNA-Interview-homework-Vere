import { resolve as resolvePath } from 'node:path';

export const validInputFilePath = resolvePath(
  __dirname,
  `../dna_conversion_samples/input`,
);
export const output7Path = resolvePath(
  __dirname,
  `../dna_conversion_samples/output7`,
);
export const output15Path = resolvePath(
  __dirname,
  `../dna_conversion_samples/output15`,
);
export const output80Path = resolvePath(
  __dirname,
  `../dna_conversion_samples/output80`,
);
export const indexFiveFragmentExpectedOutput = `@READ_5
ATTC
+READ_5
!A"\`
`;
export const twoFragmentExpectedOutput = `@READ_1
AT
+READ_1
!A
@READ_2
TC
+READ_2
"\`
`;
