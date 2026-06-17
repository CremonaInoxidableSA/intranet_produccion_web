"use client"

import * as React from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { EditarButton, EliminarButton } from "@/components/components"

import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

//---------------------------------------DATE PICKER---------------------------------------//
export function DateRangePicker({ placeholder }: { placeholder: string }) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  })

  return (
    <Field className="w-full">
      <FieldLabel htmlFor="date-picker-range">{placeholder}</FieldLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker-range"
            className="min-h-10 items-center justify-start px-2.5 font-normal"
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}

export function TimePicker() {
  return (
    <Input
      type="time"
      id="time-picker-optional"
      step="1"
      defaultValue="00:00:00"
      className="min-h-10 w-full rounded-md border-2 border-background6 bg-background3 px-3 py-2 text-xl focus:border-background6"
    />
  )
}

//---------------------------------------TABLAS---------------------------------------//
export function TablaEdicion({
  columns,
  data,
  onClickEdit,
  onClickDelete,
}: {
  columns: string[]
  data: Record<string, string>[]
  onClickEdit: (row: Record<string, string>) => void
  onClickDelete: (row: Record<string, string>) => void
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-background3">
          {columns.map((column, index) => (
            <TableHead key={index}>{column}</TableHead>
          ))}
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex} className="group">
            {columns.map((column, colIndex) => (
              <TableCell key={colIndex}>{row[column]}</TableCell>
            ))}
            <TableCell className="flex items-center justify-end gap-2">
              <EditarButton
                extraClass="opacity-0 group-hover:opacity-100"
                onClick={() => onClickEdit(row)}
              />
              <EliminarButton
                extraClass="opacity-0 group-hover:opacity-100"
                onClick={() => onClickDelete(row)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

//---------------------------------------DIALOGS---------------------------------------//
export function DialogTemplate({
  title,
  description,
  fields,
  open,
  onOpenChange,
  dialogFooter
}: {
  title: string
  description?: string
  fields: React.ReactNode
  open: boolean
  dialogFooter: React.ReactNode
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          <div className="flex max-h-[65vh] scrollbar-gutter-stable flex-col gap-4 overflow-y-auto pr-1">
            {fields}
          </div>
          <DialogFooter>
            {dialogFooter}
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export function AlertDialogTemplate({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
