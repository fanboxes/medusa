import { DataTable, DataTableSortingState, Heading, createDataTableColumnHelper, useDataTable } from "@medusajs/ui"
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
    // Enables sorting for the column.
    enableSorting: true,
    // If omitted, the header will be used instead if it's a string, 
    // otherwise the accessor key (id) will be used.
    sortLabel: "Title",
    // If omitted the default value will be "A-Z"
    sortAscLabel: "A-Z",
    // If omitted the default value will be "Z-A"
    sortDescLabel: "Z-A",
  }),
  columnHelper.accessor("price", {
    header: "Price",
  }),
]

export default function ProductTable () {
  const [sorting, setSorting] = useState<DataTableSortingState | null>({
    id: "title",
    desc: false,
  })

  const shownProducts = useMemo(() => {
    if (!sorting) {
      return products
    }
    return products.slice().sort((a, b) => {
      // @ts-ignore
      const aVal = a[sorting.id]
      // @ts-ignore
      const bVal = b[sorting.id]
      if (aVal < bVal) {
        return sorting.desc ? 1 : -1
      }
      if (aVal > bVal) {
        return sorting.desc ? -1 : 1
      }
      return 0
    })
  }, [sorting])

  const table = useDataTable({
    data: shownProducts,
    columns,
    getRowId: (product) => product.id,
    rowCount: products.length,
    sorting: {
      // Pass the pagination state and updater to the table instance
      state: sorting,
      onSortingChange: setSorting,
    },
    isLoading: false,
  })

  return (
    <DataTable instance={table}>
      <DataTable.Toolbar className="flex justify-between items-center">
        <Heading>Products</Heading>
        {/** This component will render a menu that allows the user to choose which column to sort by and in what direction. **/}
        <DataTable.SortingMenu tooltip="Sort" />
      </DataTable.Toolbar>
	    <DataTable.Table />
    </DataTable>
  );
};