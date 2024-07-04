# DNAnexus QA homework

DNA is a long molecule that lies inside the nucleus of a cell, and it can be thought of as a very long string consisting of characters in the alphabet {A, C, G, T}. DNA sequencing is the technology that enables reading from DNA molecules and converting them to strings on the output. This convertor works in the following way: 
the DNA molecules in the input are fragmented into pieces of equal length L; each piece is then sequenced by the technology, and its content is encoded in the output.

## How to run

1. Install dependencies `npm ci`
1. Run convertor `npm start <inputPath> <L>` where inputs are:
    1. inputPath is the path to an encoded file with DNA molecules fragmented in pieces
    1. L length of a DNA fragment, 0 < l <= byte size of input file

Example with input file from the repo:

```
npm start ./dna_conversion_samples/input 100
```

## How to test
Test are run automatically on commit

1. Install dependencies `npm ci`
1. Run convertor `npm test`


## TODOs

- test data generation
- more test for the formater
- redo parameter tests with mock-fs or just jest mock
- performance tests with larger data set