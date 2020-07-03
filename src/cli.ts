import { createWriteStream } from 'fs';

import { transformsList } from './transforms';
import { run } from './run';
import { TransformInput } from './types';

// See examples/buildExamples.sh for usage

const args = process.argv.slice(2);

const [inputFname, outputFname, ...transformArgs] = args;
if (!inputFname || !outputFname || transformArgs.length === 0) {
  throw new Error('Bad input format; TODO');
}

const transforms: TransformInput[] = transformArgs.map((arg) => {
  const [name, params] = arg.split(':');

  const transform = transformsList.find((t) => t.name === name);
  if (!transform) {
    throw new Error(`Unknown transform: ${name}`);
  }

  return {
    transform,
    params: params ? params.split(',') : [],
  };
});

run(inputFname, createWriteStream(outputFname), transforms).catch((err) =>
  console.log(err.stack)
);
