import { createDataTableColumnHelper, useDataTable, DataTable, Heading } from "@medusajs/ui"
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

export default function ProductTable () {
	const [search, setSearch] = useState<string>("")

  const shownProducts = useMemo(() => {
    return products.filter((product) => product.title.toLowerCase().includes(search.toLowerCase()))
  }, [search]) 
  
  const table = useDataTable({
    columns,
    data: shownProducts,
    getRowId: (product) => product.id,
    rowCount: products.length,
    isLoading: false,
    // Pass the state and onSearchChange to the table instance.
    search: {
	    state: search,
	    onSearchChange: setSearch
    }
  })
  
  return (
    <DataTable instance={table}>
	    <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
	      <Heading>Products</Heading>
	      {/* This component renders the search bar */}
	      <DataTable.Search placeholder="Search..." />
      </DataTable.Toolbar>
      <DataTable.Table />
    </DataTable>
  )
}