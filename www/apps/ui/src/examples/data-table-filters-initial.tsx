import { DataTable, DataTableFilteringState, Heading, createDataTableColumnHelper, createDataTableFilterHelper, useDataTable } from "@medusajs/ui"
import { useMemo, useState } from "react"

const products = [
  {
    id: "1",
    title: "Shirt",
    price: 10
  },
  {
    id: "2",
    title: "Pants",
    price: 20
  }
]

const columnHelper = createDataTableColumnHelper<typeof products[0]>()

const columns = [
  columnHelper.accessor("title", {
    header: "Title",
    enableSorting: true,
  }),
  columnHelper.accessor("price", {
    header: "Price",
    enableSorting: true,
  }),
]

const filterHelper = createDataTableFilterHelper<typeof products[0]>()

const filters = [
  filterHelper.accessor("title", {
    type: "select",
    label: "Title",
    options: products.map((product) => ({
      label: product.title,
      value: product.title.toLowerCase()
    }))
  }),
]

export default function ProductTable () {
	const [filtering, setFiltering] = useState<DataTableFilteringState>({
    title: ["shirt"]
  })

  const shownProducts = useMemo(() => {
    return products.filter((product) => {
      return Object.entries(filtering).every(([key, value]) => {
        if (!value) {
          return true
        }
        if (typeof value === "string") {
          // @ts-ignore
          return product[key].toString().toLowerCase().includes(value.toString().toLowerCase())
        }
        if (Array.isArray(value)) {
          // @ts-ignore
          return value.includes(product[key].toLowerCase())
        }
        if (typeof value === "object") {
          // @ts-ignore
          const date = new Date(product[key])
          let matching = false
          if ("$gte" in value && value.$gte) {
            matching = date >= new Date(value.$gte as number)
          }
          if ("$lte" in value && value.$lte) {
            matching = date <= new Date(value.$lte as number)
          }
          if ("$lt" in value && value.$lt) {
            matching = date < new Date(value.$lt as number)
          }
          if ("$gt" in value && value.$gt) {
            matching = date > new Date(value.$gt as number)
          }
          return matching
        }
      })
    })
  }, [filtering])

  const table = useDataTable({
    data: shownProducts,
    columns,
    getRowId: (product) => product.id,
    rowCount: products.length,
    isLoading: false,
    filtering: {
      state: filtering,
      onFilteringChange: setFiltering,
    },
    filters
  });

  return (
    <DataTable instance={table}>
      <DataTable.Toolbar className="flex justify-between items-center">
        <Heading>Products</Heading>
        {/** This component will render a menu that allows the user to choose which filters to apply to the table data. **/}
        <DataTable.FilterMenu tooltip="Filter" />
      </DataTable.Toolbar>
	    <DataTable.Table />
    </DataTable>
  );
};