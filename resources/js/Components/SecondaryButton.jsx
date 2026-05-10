export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center rounded-full border border-rice-mutedOlive/35 bg-rice-parchment px-4 py-2 text-xs font-semibold uppercase tracking-widest text-rice-ink shadow-[0_8px_20px_rgba(7,30,24,0.08)] transition duration-150 ease-in-out hover:bg-rice-sideSage focus:outline-none focus:ring-2 focus:ring-rice-mutedOlive focus:ring-offset-2 focus:ring-offset-rice-parchment disabled:opacity-25 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
