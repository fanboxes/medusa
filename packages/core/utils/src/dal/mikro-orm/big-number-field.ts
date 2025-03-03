import { BigNumberInput } from "@medusajs/types"
import { Property } from "@mikro-orm/core"
import { isDefined, isPresent, trimZeros } from "../../common"
import { BigNumber } from "../../totals/big-number"

export function MikroOrmBigNumberProperty(
  options: Parameters<typeof Property>[0] & {
    rawColumnName?: string
  } = {}
) {
  return function (target: any, columnName: string) {
    const rawColumnName = options.rawColumnName ?? `raw_${columnName}`

    Object.defineProperty(target, columnName, {
      get() {
        let value = this.__helper?.__data?.[columnName]

        if (!value && this[rawColumnName]) {
          value = new BigNumber(this[rawColumnName].value, {
            precision: this[rawColumnName].precision,
          }).numeric
        }

        return value
      },
      set(value: BigNumberInput) {
        if (options?.nullable && !isPresent(value)) {
          this.__helper.__data[columnName] = null
          this.__helper.__data[rawColumnName] = null
          this[rawColumnName] = null
        } else {
          // When mikro orm create and hydrate the entity with partial selection it can happen
          // that null value is being passed.
          if (!options?.nullable && value === null) {
            this.__helper.__data[columnName] = undefined
            this.__helper.__data[rawColumnName] = undefined
            this[rawColumnName] = undefined
          } else {
            let bigNumber: BigNumber

            try {
              if (value instanceof BigNumber) {
                bigNumber = value
              } else if (this[rawColumnName]) {
                const precision = this[rawColumnName].precision
                bigNumber = new BigNumber(value, {
                  precision,
                })
              } else {
                bigNumber = new BigNumber(value)
              }
            } catch (e) {
              throw new Error(`Cannot set value ${value} for ${columnName}.`)
            }

            const raw = bigNumber.raw!
            raw.value = trimZeros(raw.value as string)

            // Note: this.__helper isn't present when directly working with the entity
            // Adding this in optionally for it not to break.
            if (isDefined(this.__helper)) {
              this.__helper.__data[columnName] = bigNumber.numeric
              this.__helper.__data[rawColumnName] = raw
            }

            this[rawColumnName] = raw
          }
        }

        // Note: this.__helper isn't present when directly working with the entity
        // Adding this in optionally for it not to break.
        if (!isDefined(this.__helper)) {
          return
        }

        // This is custom code to keep track of which fields are bignumber, as well as their data
        if (!this.__helper.__bignumberdata) {
          this.__helper.__bignumberdata = {}
        }

        this.__helper.__bignumberdata[columnName] =
          this.__helper.__data[columnName]
        this.__helper.__bignumberdata[rawColumnName] =
          this.__helper.__data[rawColumnName]
        this.__helper.__touched = !this.__helper.hydrator.isRunning()
      },
      enumerable: true,
      configurable: true,
    })

    Property({
      type: "any",
      columnType: "numeric",
      trackChanges: false,
      runtimeType: "any",
      ...options,
    })(target, columnName)
  }
}
