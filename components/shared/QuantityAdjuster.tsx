"use client";

import { LoaderIcon, MinusIcon, PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import IconButton from "./buttons/IconButton";

type QuantityAdjusterProps = {
  value: number;
  onChange: (newValue: number) => void;
  minMax?: {
    min: number;
    max: number;
    minDisabled?: boolean;
    maxDisabled?: boolean;
    disabled?: boolean;
    onMinClick: () => void;
    onMaxClick: () => void;
  } | null;
  stepButtons: {
    decrementDisabled: boolean;
    incrementDisabled: boolean;
    onDecrementClick: () => void;
    onIncrementClick: () => void;
  };
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  loading?: boolean;
};

const QuantityAdjuster = ({
  value,
  onChange,
  minMax,
  stepButtons,
  inputProps = {},
  loading,
}: QuantityAdjusterProps) => {
  const [inputValue, setInputValue] = useState(value.toString());

  // Update the local state when the value prop changes.
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (inputProps.onChange) {
      inputProps.onChange(e);
    }
  };

  // On blur, validate and clamp the value.
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let newValue = parseInt(e.target.value);
    if (isNaN(newValue)) {
      newValue = minMax ? minMax.min : 0;
    }
    const validValue = minMax
      ? Math.min(Math.max(minMax.min, newValue), minMax.max)
      : newValue;
    onChange(validValue);
    setInputValue(validValue.toString());
  };

  return (
    <div className="flex flex-row w-full items-center gap-0 border rounded-md">
      {minMax && (
        <>
          <IconButton
            className="p-0 border-none rounded-r-none rounded-l-sm flex-grow text-xs"
            variant="secondary"
            disabled={minMax.disabled || minMax.minDisabled}
            onClick={minMax.onMinClick}
          >
            MIN
          </IconButton>
          <Separator orientation="vertical" className="h-10" />
        </>
      )}

      <IconButton
        className={`rounded-none transition-colors size-10 border-none hover:bg-muted ${
          !minMax ? "rounded-l-md" : "rounded-l-none"
        }`}
        tooltip="Decrease quantity"
        disabled={stepButtons.decrementDisabled}
        onClick={stepButtons.onDecrementClick}
      >
        <MinusIcon className="size-4" />
      </IconButton>

      <Separator orientation="vertical" className="h-10" />

      {loading ? (
        <LoaderIcon className="animate-spin min-w-[3ch] w-12 h-5" />
      ) : (
        <input
          type="number"
          className="min-w-[3ch] w-12 h-10 text-sm text-center tabular-nums border-none focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          min={minMax ? minMax.min : undefined}
          max={minMax ? minMax.max : undefined}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          disabled={inputProps.disabled}
          aria-label="Quantity"
          {...inputProps}
        />
      )}

      <Separator orientation="vertical" className="h-10" />

      <IconButton
        className={`rounded-none transition-colors size-10 border-none hover:bg-muted ${
          !minMax ? "rounded-r-md" : "rounded-r-none"
        }`}
        tooltip="Increase quantity"
        disabled={stepButtons.incrementDisabled}
        onClick={stepButtons.onIncrementClick}
      >
        <PlusIcon className="size-4" />
      </IconButton>

      {minMax && (
        <>
          <Separator orientation="vertical" className="h-10" />
          <IconButton
            className="p-0 border-none rounded-r-sm rounded-l-none flex-grow text-xs"
            variant="secondary"
            disabled={minMax.disabled || minMax.maxDisabled}
            onClick={minMax.onMaxClick}
          >
            MAX
          </IconButton>
        </>
      )}
    </div>
  );
};

export default QuantityAdjuster;
