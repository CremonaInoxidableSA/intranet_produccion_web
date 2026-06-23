import * as React from "react"
import { ChangeEvent } from "react"

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
    <button type="button" onClick={onClick} className="cursor-pointer">
      <Trash2 className={`aspect-square text-redcremona ${extraClass}`} />
    </button>
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
type SimpleArray = (string | number)[]
type ObjectArray = Record<string, string | number>[]
type ArrayData = SimpleArray | ObjectArray

function isObjectArray(data: ArrayData): data is ObjectArray {
  return data.length > 0 && typeof data[0] === "object"
}

export function Selector({
  placeholder,
  data,
  keyId = "id",
  keyLabel = "nombre",
  onValueChange,
  extraClass,
  value,
  disabled = false,
}: {
  placeholder: string
  data: ArrayData
  keyId?: string
  keyLabel?: string
  extraClass?: string
  disabled?: boolean
  value?: string
  onValueChange?: (value: string) => void
}) {
  return (
    <Select onValueChange={onValueChange} disabled={disabled} value={value}>
      <SelectTrigger
        className={`min-h-10 w-full rounded border-2 border-background6 bg-background3 px-3 py-2 text-sm focus:border-background6 ${extraClass}`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectGroup>
          {isObjectArray(data)
            ? data.map((opcion) => (
                <SelectItem key={opcion[keyId]} value={String(opcion[keyId])}>
                  {opcion[keyLabel]}
                </SelectItem>
              ))
            : data.map((opcion) => (
                <SelectItem key={opcion} value={String(opcion)}>
                  {String(opcion)}
                </SelectItem>
              ))}
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
            <div className="mr-4">
              <span
                className={`flex flex-row items-center rounded px-2 hover:bg-foreground/10`}
              >
                <div
                  onClick={() => onTagClick?.(tag)}
                  className="flex flex-1 cursor-pointer py-2"
                >
                  {tag}
                </div>
                <div>{extras && extras(tag)}</div>
              </span>
            </div>
            <Separator className="my-2" />
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
  disabled = false,
  value,
  onChange,
}: {
  placeholder: string
  type: string
  disabled?: boolean
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <Input
      placeholder={placeholder}
      type={type}
      disabled={disabled}
      value={value}
      onChange={onChange}
      className="min-h-10 w-full rounded border-2 border-background6 bg-background3 px-3 py-2 text-sm focus:border-background6"
    />
  )
}
//---------------------------------------TEXTAREA---------------------------------------//
export function Textarea({ placeholder }: { placeholder: string }) {
  return (
    <textarea
      placeholder={placeholder}
      className="text-sm min-h-24 w-full resize-none rounded border-2 border-background6 bg-background3 px-3 py-2 focus:border-background6 focus:outline-none"
    />
  )
}
