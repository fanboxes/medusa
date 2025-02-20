import { Checkbox, CommandBar, Label, Text } from "@medusajs/ui"
import * as React from "react"

export default function CommandBarDemo() {
  const [selected, setSelected] = React.useState<boolean>(false)

  return (
    <div className="flex justify-center gap-y-2 flex-col">
      <div className="flex items-center gap-x-2">
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) =>
            setSelected(checked === true ? true : false)
          }
        />
        <Label>Item One</Label>
      </div>
      <div><Text size="small" className="text-ui-fg-muted">Check the box to view the command bar</Text></div>
      <CommandBar open={selected}>
        <CommandBar.Bar>
          <CommandBar.Value>1 selected</CommandBar.Value>
          <CommandBar.Seperator />
          <CommandBar.Command
            action={() => {
              alert("Delete")
            }}
            label="Delete"
            shortcut="d"
          />
          <CommandBar.Seperator />
          <CommandBar.Command
            action={() => {
              alert("Edit")
            }}
            label="Edit"
            shortcut="e"
          />
        </CommandBar.Bar>
      </CommandBar>
    </div>
  )
}
