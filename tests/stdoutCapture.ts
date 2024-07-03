function captureStdout() {
  const originalWrite = process.stdout.write;
  let capturedOutput = '';
  process.stdout.write = ((output: string | Buffer, ...args: any[]) => {
    capturedOutput += output;
    return true;
  }) as any;

  return {
    getOutput: () => capturedOutput,
    restore: () => (process.stdout.write = originalWrite),
  };
}

export default captureStdout;
