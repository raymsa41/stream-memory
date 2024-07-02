

import { Stream, pipe, Effect } from "effect"
import * as ReadonlyArray from 'effect/ReadonlyArray'

const onePage = (page: number) =>
    pipe(
      Effect.succeed({
        meta: { items_page: page },
        items: 
          ReadonlyArray.range(1, 200).map((i) => ({
            appointment: {
              description: '',
              active: true,
              id: 1,
              start_at: null,
              duration: 1,
              type_id: 1,
              status_id: 1,
              animal_id: null,
              contact_id: null,
              resources: [{ id: 1 }],
            },
          })),
      }),
      Effect.delay(1),
    )

const stream = pipe(
  Stream.iterate(1, n => n + 1),
  Stream.mapEffect(currentPage => onePage(currentPage)),
  Stream.map(({ items }) => items),
  Stream.flatMap(items =>
    pipe(
      items,
      ReadonlyArray.map(({ appointment }) =>
        pipe(
          Effect.all({
            firstResource: pipe(
              Effect.succeed({
                meta: { items_page_total: 511, items_page: 1 },
                items: [
                  {
                    resource: {
                      name: 'Xero',
                      type: 'user',
                      id: 3,
                      active: false,
                      ownership_id: 1,
                    },
                  },
                ],
              }),
              Effect.map(({ items }) => items),
              Effect.map(ReadonlyArray.map(({ resource }) => resource)),
            ),
          }),
          Effect.map(({ firstResource }) => ({
            appointment: { ...appointment, firstResource },
          })),
        ),
      ),
      Effect.allWith({ concurrency: 'inherit' }),
    ),
  ),
  Stream.runDrain
)

Effect.runPromise(stream)