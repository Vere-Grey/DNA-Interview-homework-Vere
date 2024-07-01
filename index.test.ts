import { formatEntry } from './index';

it('formats fragment', () => {
  const input = Buffer.from([0x00, 0xe0, 0xc1, 0x7f]);
  const index = 1;
  expect(formatEntry(input, index)).toBe(`@READ_${index}
ATTC
+READ_${index}
!A"\`
`);
});
