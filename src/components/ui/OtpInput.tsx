import { useRef, useCallback } from "react";
import type { OtpInputProps } from "@/interface";

export function OtpInput({
  length = 4,
  value,
  onChange,
  disabled = false,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = useCallback(
    (index: number, inputValue: string) => {
      // Only allow digits
      const digit = inputValue.replace(/\D/g, "").slice(-1);
      const newOtp = [...value];
      newOtp[index] = digit;
      onChange(newOtp);

      // Auto-focus next input
      if (digit && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [value, onChange, length],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      if (e.key === "ArrowRight" && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [value, length],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pastedData = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, length);
      if (pastedData) {
        const newOtp = [...value];
        for (let i = 0; i < pastedData.length; i++) {
          newOtp[i] = pastedData[i];
        }
        onChange(newOtp);
        // Focus last filled input or last input
        const focusIndex = Math.min(pastedData.length, length) - 1;
        inputRefs.current[focusIndex]?.focus();
      }
    },
    [value, onChange, length],
  );

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : undefined}
          disabled={disabled}
          className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white"
          autoFocus={index === 0}
        />
      ))}
    </div>
  );
}
