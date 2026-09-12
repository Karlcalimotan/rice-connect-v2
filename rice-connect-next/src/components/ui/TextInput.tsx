import { forwardRef, useEffect, useImperativeHandle, useRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  isFocused?: boolean
}

interface TextInputRef {
  focus: () => void
}

const TextInput = forwardRef<TextInputRef, TextInputProps>(
  ({ type = 'text', className = '', isFocused = false, ...props }, ref) => {
    const localRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => ({
      focus: () => localRef.current?.focus(),
    }))

    useEffect(() => {
      if (isFocused) {
        localRef.current?.focus()
      }
    }, [isFocused])

    return (
      <input
        {...props}
        type={type}
        className={cn(
          'rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500',
          className
        )}
        ref={localRef}
      />
    )
  }
)

TextInput.displayName = 'TextInput'

export default TextInput
