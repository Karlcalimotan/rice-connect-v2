export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-full border border-rice-mutedOlive/40 bg-rice-forest px-4 py-2 text-xs font-semibold uppercase tracking-widest text-rice-parchment transition duration-150 ease-in-out hover:bg-rice-darkMoss focus:bg-rice-darkMoss focus:outline-none focus:ring-2 focus:ring-rice-mutedOlive focus:ring-offset-2 focus:ring-offset-rice-parchment active:bg-rice-deep ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
