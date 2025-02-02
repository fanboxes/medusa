import { DataTable, DataTableRowSelectionState, Heading, createDataTableColumnHelper, createDataTableCommandHelper, useDataTable } from "@medusajs/ui"
import { useState } from "react"

let products = [
  {
    id: "1",
    title: "Shirt",
    price: 10,
  },
  {
    id: "2",
    title: "Pants",
    price: 20,
  }
]

const columnHelper = createDataTableColumnHelper<typeof products[0]>()

const columns = [
  // Commands requires a select column.
  columnHelper.select(),
  columnHelper.accessor("title", {
    header: "Title",
    enableSorting: true,
  }),
  columnHelper.accessor("price", {
    header: "Price",
    enableSorting: true,
  }),
]

const commandHelper = createDataTableCommandHelper()

const useCommands = () => {
  return [
    commandHelper.command({
      label: "Delete",
      shortcut: "D",
      action: async (selection) => {
        const productsToDeleteIds = Object.keys(selection)

        alert(`You deleted product(s) with IDs: ${productsToDeleteIds.join()}`)
      }
    })
  ]
}

export default function ProductTable () {
	const [rowSelection, setRowSelection] = useState<DataTableRowSelectionState>({})

  const commands = useCommands()

  const instance = useDataTable({
    data: products,
    columns,
    getRowId: (product) => product.id,
    rowCount: products.length,
    isLoading: false,
    commands,
    rowSelection: {
      state: rowSelection,
      onRowSelectionChange: setRowSelection,
    },
  });

  return (
    <DataTable instance={instance}>
      <DataTable.Toolbar className="flex justify-between items-center">
        <Heading>Products</Heading>
      </DataTable.Toolbar>
	    <DataTable.Table />
      {/** This component will the command bar when the user has selected at least one row. **/}
	    <DataTable.CommandBar selectedLabel={(count) => `${count} selected`} />
    </DataTable>
  );
};