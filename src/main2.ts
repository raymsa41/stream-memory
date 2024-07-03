

import { Stream, pipe, Effect } from "effect"
import * as ReadonlyArray from 'effect/ReadonlyArray'

const stream = pipe(
  Stream.iterate(1, n => n + 1),
  Stream.flatMap(() => pipe(
    ReadonlyArray.range(1, 200).map(() => pipe(
        Effect.all({})
    )),
    Effect.allWith({ concurrency: 2 }),
  )),
  Stream.runDrain,
)

Effect.runPromise(stream)