import { DataTable, Heading, createDataTableColumnHelper, useDataTable, type DataTablePaginationState } from "@medusajs/ui"
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
  },
  {
    id: "3",
    title: "Hat",
    price: 15
  },
  {
    id: "4",
    title: "Socks",
    price: 5
  },
  {
    id: "5",
    title: "Shoes",
    price: 50
  },
  {
    id: "6",
    title: "Jacket",
    price: 100
  },
  {
    id: "7",
    title: "Scarf",
    price: 25
  },
  {
    id: "8",
    title: "Gloves",
    price: 12
  },
  {
    id: "9",
    title: "Belt",
    price: 18
  },
  {
    id: "10",
    title: "Sunglasses",
    price: 30
  },
  {
    id: "11",
    title: "Watch",
    price: 200
  },
  {
    id: "12",
    title: "Tie",
    price: 20
  },
  {
    id: "13",
    title: "Sweater",
    price: 40
  },
  {
    id: "14",
    title: "Jeans",
    price: 60
  },
  {
    id: "15",
    title: "Shorts",
    price: 25
  },
  {
    id: "16",
    title: "Blouse",
    price: 35
  },
  {
    id: "17",
    title: "Dress",
    price: 80
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

const PAGE_SIZE = 10;

export default function ProductTable () {
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: PAGE_SIZE,
    pageIndex: 0,
  })

  const shownProducts = useMemo(() => {
    return products.slice(
      pagination.pageIndex * pagination.pageSize,
      (pagination.pageIndex + 1) * pagination.pageSize
    )
  }, [pagination])

  const table = useDataTable({
    data: shownProducts,
    columns,
    rowCount: products.length,
    getRowId: (product) => product.id,
    pagination: {
      // Pass the pagination state and updater to the table instance
      state: pagination,
      onPaginationChange: setPagination,
    },
    isLoading: false,
  });

  return (
      <DataTable instance={table}>
        <DataTable.Toolbar>
          <Heading>Products</Heading>
        </DataTable.Toolbar>
				<DataTable.Table />
        {/** This component will render the pagination controls **/}
        <DataTable.Pagination />
      </DataTable>
  );
};