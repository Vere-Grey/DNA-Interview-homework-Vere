import { formatFragment } from './format-fragment';

export class FragmentHandler {
  private incompleteFragment: Buffer;
  private entryIndex: number = 1;
  private fragmentLengthL: number;

  constructor(fragmentLengthL: number) {
    this.incompleteFragment = Buffer.alloc(0);
    this.fragmentLengthL = fragmentLengthL;
  }

  processFragments(newChunk: Buffer) {
    const chunk = this.combineChunkAndIncompleteFragment(newChunk);

    for (let i = 0; i < chunk.length; i += this.fragmentLengthL) {
      const isLastFragmentIncomplete = i + this.fragmentLengthL > chunk.length;
      if (isLastFragmentIncomplete) {
        this.setIncompleteFragment(chunk.slice(i));
        break;
      }

      const fragment = chunk.slice(i, i + this.fragmentLengthL);
      const entry = formatFragment(fragment, this.entryIndex);
      this.entryIndex++;
      process.stdout.write(entry);
    }
  }

  combineChunkAndIncompleteFragment(chunk: Buffer): Buffer {
    if (this.hasIncompleteFragment()) {
      chunk = Buffer.concat([this.incompleteFragment, chunk]);
      this.clearIncompleteFragment();
    }
    return chunk;
  }

  setIncompleteFragment(fragment: Buffer) {
    this.incompleteFragment = fragment;
  }

  getIncompleteFragment(): Buffer {
    return this.incompleteFragment;
  }

  hasIncompleteFragment(): boolean {
    return this.incompleteFragment.length > 0;
  }

  clearIncompleteFragment() {
    this.incompleteFragment = Buffer.alloc(0);
  }

  processLeftoverIncompleteFragment() {
    const entry = formatFragment(this.incompleteFragment, this.entryIndex);
    process.stdout.write(entry);
    this.clearIncompleteFragment();
  }
}
