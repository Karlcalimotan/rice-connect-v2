import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-xl border-rice-mutedOlive/35 bg-rice-parchment text-rice-ink shadow-sm placeholder:text-rice-ink/35 focus:border-rice-mutedOlive focus:ring-rice-mutedOlive ' +
                className
            }
            ref={localRef}
        />
    );
});
