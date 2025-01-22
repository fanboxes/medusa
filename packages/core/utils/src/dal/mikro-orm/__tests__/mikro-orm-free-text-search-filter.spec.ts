import { MikroORM } from "@mikro-orm/core"
import { defineConfig } from "@mikro-orm/postgresql"
import { SearchableEntity1, SearchableEntity2 } from "../__fixtures__/utils"
import { mikroOrmFreeTextSearchFilterOptionsFactory } from "../mikro-orm-free-text-search-filter"

describe("mikroOrmFreeTextSearchFilterOptionsFactory", () => {
  let orm

  beforeEach(async () => {
    orm = await MikroORM.init(
      defineConfig({
        entities: [SearchableEntity1, SearchableEntity2],
        user: "postgres",
        password: "",
        dbName: "test",
        connect: false,
      })
    )
  })

  it("should return a filter function that filters entities based on the free text search value", async () => {
    const entityManager = orm.em.fork()
    const freeTextSearchValue = "search"

    let filterConstraints = mikroOrmFreeTextSearchFilterOptionsFactory(
      SearchableEntity1.name
    ).cond(
      {
        value: freeTextSearchValue,
        fromEntity: SearchableEntity1.name,
      },
      "read",
      entityManager
    )

    expect(filterConstraints).toEqual({
      $or: [
        {
          searchableField: {
            $ilike: `%${freeTextSearchValue}%`,
          },
        },
        {
          entity2: {
            $or: [
              {
                searchableField: {
                  $ilike: `%${freeTextSearchValue}%`,
                },
              },
            ],
          },
        },
      ],
    })

    filterConstraints = mikroOrmFreeTextSearchFilterOptionsFactory(
      SearchableEntity2.name
    ).cond(
      {
        value: freeTextSearchValue,
        fromEntity: SearchableEntity2.name,
      },
      "read",
      entityManager
    )

    expect(filterConstraints).toEqual({
      $or: [
        {
          searchableField: {
            $ilike: `%${freeTextSearchValue}%`,
          },
        },
      ],
    })
  })
})
