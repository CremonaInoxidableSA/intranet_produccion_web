import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";

//---------------------------------------SELECTORES---------------------------------------//
export function Selector({ placeholder }: { placeholder: string }) {
  return (
    <Select>
      <SelectTrigger className="w-full min-h-10 bg-background3 border-2 border-background6 focus:border-background6 rounded-md px-3 py-2">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectGroup>
          <SelectItem value="opcion1">1192</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

//---------------------------------------TABLAS---------------------------------------//
export function Tabla({
  columns,
  data,
}: {
  columns: string[];
  data: Record<string, string>[];
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
  );
}

//---------------------------------------INPUTS---------------------------------------//
export function Inputs({
  placeholder,
  type,
}: {
  placeholder: string;
  type: string;
}) {
  return (
    <Input
      type={type}
      placeholder={placeholder}
      className="w-full min-h-10 bg-background3 border-2 border-background6 focus:border-background6 rounded-md px-3 py-2"
    />
  );
}

//---------------------------------------TEXTAREA---------------------------------------//
export function Textarea({ placeholder }: { placeholder: string }) {
  return (
    <textarea
      placeholder={placeholder}
      className="w-full min-h-24 bg-background3 border-2 border-background6 focus:outline-none focus:border-background6 rounded-md px-3 py-2 resize-none text-md"
    />
  );
}

//---------------------------------------BOTONES---------------------------------------//
export function GuardarButton() {
  return (
    <button className="w-full bg-green-500 text-white py-2 rounded">
      GUARDAR
    </button>
  );
}
