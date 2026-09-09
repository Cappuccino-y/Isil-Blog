export function OrnamentDivider({ phrase, translation }: { phrase?: string; translation?: string }) {
  return (
    <div
      role="separator"
      aria-hidden
      className="mx-auto mt-16 flex max-w-3xl select-none flex-col items-center gap-4 px-6"
    >
      <div className="flex w-full items-center gap-4">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/40" />
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="shrink-0 text-gold drop-shadow-[0_0_10px_rgba(201,168,106,0.5)]"
        >
          <path d="M12 0 14.6 9.4 24 12 14.6 14.6 12 24 9.4 14.6 0 12 9.4 9.4Z" />
        </svg>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/40" />
      </div>
      {phrase && (
        <p className="text-center font-body text-xs italic tracking-wider text-gold-bright dark:text-gold/75">
          {phrase}
          {translation && (
            <span className="ml-3 not-italic text-muted-foreground">{translation}</span>
          )}
        </p>
      )}
    </div>
  );
}
