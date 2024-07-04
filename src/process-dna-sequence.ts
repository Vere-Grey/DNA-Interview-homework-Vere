import { createReadStream } from 'node:fs';
import { FragmentHandler } from './fragment-handler';

export const processDNASequence = (
  inputFullPath: string,
  fragmentLengthL: number,
) => {
  return new Promise<void>((resolve, reject) => {
    const inputStream = createReadStream(inputFullPath);
    const fragmentHandler = new FragmentHandler(fragmentLengthL);

    inputStream.on('data', (chunk: Buffer) => {
      fragmentHandler.processFragments(chunk);
    });

    inputStream.on('error', (err) => {
      reject(err);
    });

    inputStream.on('close', () => {
      if (fragmentHandler.hasIncompleteFragment()) {
        fragmentHandler.processLeftoverIncompleteFragment();
      }
      resolve();
    });
  });
};
