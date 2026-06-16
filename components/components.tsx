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
  extraClass: string
  placeholder: string
  onClick: () => void
}) {
  return (
    <Button className={`w-full rounded bg-green-500 py-2 text-white ${extraClass}`}>
      GUARDAR
    </Button>
  )
}

export function EliminarButton({
  extraClass,
  onClick,
}: {
  extraClass: string
  onClick: () => void
}) {
  return (
    <button
      className="aspect-square h-full cursor-pointer items-center justify-center"
      onClick={onClick}
    >
      <Trash2
        className={`aspect-square h-full cursor-pointer items-center justify-center text-redcremona ${extraClass}`}
      />
    </button>
  )
}

export function EditarButton({
  extraClass,
  onClick,
}: {
  extraClass: string
  onClick: () => void
}) {
  return (
    <button
      className="aspect-square h-full cursor-pointer items-center justify-center"
      onClick={onClick}
    >
      <PencilLine
        className={`aspect-square h-full cursor-pointer items-center justify-center text-bluecremona ${extraClass}`}
      />
    </button>
  )
}

//---------------------------------------SELECTORES---------------------------------------//
export function Selector({ placeholder }: { placeholder: string }) {
  return (
    <Select>
      <SelectTrigger className="min-h-10 w-full rounded-md border-2 border-background6 bg-background3 px-3 py-2 focus:border-background6">
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
}: {
  tags: string[]
  extraClass?: string
  placeholder?: string
  placeholderExtraClass?: string
  extras?: (tag: string) => React.ReactNode
  height?: string
}) {
  return (
    <div className={`rounded border ${extraClass || ""}`}>
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
            <div className="text-md mr-4 flex flex-row items-center justify-between">
              {tag}
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
      className="min-h-10 w-full rounded-md border-2 border-background6 bg-background3 px-3 py-2 focus:border-background6"
    />
  )
}

//---------------------------------------TEXTAREA---------------------------------------//
export function Textarea({ placeholder }: { placeholder: string }) {
  return (
    <textarea
      placeholder={placeholder}
      className="text-md min-h-24 w-full resize-none rounded-md border-2 border-background6 bg-background3 px-3 py-2 focus:border-background6 focus:outline-none"
    />
  )
}
