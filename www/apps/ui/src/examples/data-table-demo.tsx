import { createDataTableColumnHelper, useDataTable, DataTable, Heading } from "@medusajs/ui"

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

export default function ProductTable () {
  const table = useDataTable({
    columns,
    data: products,
    getRowId: (product) => product.id,
    rowCount: products.length,
    isLoading: false,
  })
  
  return (
    <DataTable instance={table}>
	    <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
	      <Heading>Products</Heading>
      </DataTable.Toolbar>
      <DataTable.Table />
    </DataTable>
  )
}