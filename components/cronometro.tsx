"use client"

import { useRef, useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Pause, Play } from "lucide-react"

export function Cronometro() {
  const [time, setTime] = useState<number>(0)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const start = () => {
    if (intervalRef.current) return

    const startTime = Date.now() - time

    intervalRef.current = setInterval(() => {
      setTime(Date.now() - startTime)
    }, 1000)
    setIsRunning(true)
  }

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
  }

  const formatTime = (ms: number): string => {
    const hours = Math.floor(ms / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-row items-center justify-between gap-4">
      <h1 className="text-xl">{formatTime(time)}</h1>

      <div className="flex gap-2">
        {isRunning ? (
          <Button
            onClick={stop}
            className="aspect-square min-h-12 rounded bg-background6"
          >
            <Pause className="size-6 text-white" />
          </Button>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="aspect-square min-h-12 rounded bg-background6">
                <Play className="size-6 text-white" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Está seguro que desea crear la tarea y empezar a cronometrar?
                  No podrá editar los datos de la tarea una vez creada, solo
                  agregar tiempo extra al cronómetro.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={start}>Continuar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  )
}

export function DuracionInput({ 
  value: externalValue, 
  onChange: externalOnChange 
}: { 
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [internalValue, setInternalValue] = useState("00:00:00");

  const value = externalValue !== undefined ? externalValue : internalValue;
  const setValue = externalOnChange || setInternalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^[0-9:]*$/.test(newValue)) {
      setValue(newValue);
    }
  };

  const esValido = /^\d+:[0-5]\d:[0-5]\d$/.test(value);

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="HH:MM:SS"
        className="min-h-10 rounded border-2 border-background6 bg-background3 px-3 py-2 text-xl focus:border-background6"
      />
      {!esValido && (
        <span className="text-sm text-red-500">Formato válido: HH:MM:SS</span>
      )}
    </div>
  );
}