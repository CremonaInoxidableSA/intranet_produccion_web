import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PencilLine, Trash2 } from "lucide-react"

//---------------------------------------BOTONES---------------------------------------//
export function GuardarButton({
  extraClass,
  placeholder,
  onClick,
}: {
  extraClass?: string
  placeholder?: string
  onClick?: () => void
}) {
  return (
    <Button
      className={`w-full rounded border-2 border-greencremona bg-greencremona/50 py-2 text-white hover:bg-greencremona/90 ${extraClass}`}
    >
      {placeholder}
    </Button>
  )
}

export function EliminarButton({
  extraClass,
  onClick,
}: {
  extraClass?: string
  onClick?: () => void
}) {
  return (
    <Trash2
      className={`aspect-square h-full cursor-pointer items-center justify-center text-redcremona ${extraClass}`}
      onClick={onClick}
    />
  )
}

export function EditarButton({
  extraClass,
  onClick,
}: {
  extraClass?: string
  onClick?: () => void
}) {
  return (
    <PencilLine
      className={`aspect-square h-full cursor-pointer items-center justify-center text-bluecremona ${extraClass}`}
      onClick={onClick}
    />
  )
}

//---------------------------------------SELECTORES---------------------------------------//
export function Selector({ placeholder }: { placeholder: string }) {
  return (
    <Select>
      <SelectTrigger className="text-sm min-h-10 w-full rounded-md border-2 border-background6 bg-background3 px-3 py-2 focus:border-background6">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectGroup>
          <SelectItem value="opcion1">1192</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

//---------------------------------------TABLAS---------------------------------------//
export function Tabla({
  columns,
  data,
}: {
  columns: string[]
  data: Record<string, string>[]
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-background3">
          {columns.map((column, index) => (
            <TableHead key={index}>{column}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((column, colIndex) => (
              <TableCell key={colIndex}>{row[column]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function TextScrollArea({
  tags,
  extraClass,
  placeholder,
  placeholderExtraClass,
  extras,
  height = "h-96",
  onTagClick,
}: {
  tags: string[]
  extraClass?: string
  placeholder?: string
  placeholderExtraClass?: string
  extras?: (tag: string) => React.ReactNode
  height?: string
  onTagClick?: (tag: string) => void
}) {
  return (
    <div className={`rounded ${extraClass || ""}`}>
      {placeholder ? (
        <h4
          className={`mb-5 leading-none font-medium ${placeholderExtraClass || ""}`}
        >
          {placeholder}
        </h4>
      ) : null}
      <ScrollArea className={height}>
        {tags.map((tag) => (
          <React.Fragment key={tag}>
            <div className="mr-4 flex flex-row items-center justify-between">
              <span
                onClick={() => onTagClick?.(tag)}
                className={`flex-1 truncate transition-colors duration-150 ${
                  onTagClick
                    ? "cursor-pointer rounded px-1 hover:bg-foreground/10"
                    : ""
                }`}
              >
                {tag}
              </span>
              {extras && extras(tag)}
            </div>
            <Separator className="my-3" />
          </React.Fragment>
        ))}
      </ScrollArea>
    </div>
  )
}

//---------------------------------------INPUTS---------------------------------------//
export function Inputs({
  placeholder,
  type,
}: {
  placeholder: string
  type: string
}) {
  return (
    <Input
      type={type}
      placeholder={placeholder}
      className="text-sm min-h-10 w-full rounded-md border-2 border-background6 bg-background3 px-3 py-2 focus:border-background6"
    />
  )
}

//---------------------------------------TEXTAREA---------------------------------------//
export function Textarea({ placeholder }: { placeholder: string }) {
  return (
    <textarea
      placeholder={placeholder}
      className="text-sm min-h-24 w-full resize-none rounded-md border-2 border-background6 bg-background3 px-3 py-2 focus:border-background6 focus:outline-none"
    />
  )
}
