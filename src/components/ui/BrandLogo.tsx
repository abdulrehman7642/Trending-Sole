export default function BrandLogo({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 sm:gap-3 whitespace-nowrap">
      <svg aria-hidden="true" viewBox="0 0 64 64" className="w-9 h-9 sm:w-10 sm:h-10 shrink-0" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="16" fill="#17211e" stroke={inverse ? '#c6a77b' : 'none'} strokeWidth="1.5" />
        <path d="M12 17h22v4H25v20h-5V21h-8z" fill="#f5f1e9" />
        <path d="M49 20c-2.1-1-4.1-1.4-6.1-1.4-3.2 0-4.9 1.1-4.9 3 0 1.7 1.4 2.5 5.4 3.5 5.5 1.3 7.9 3.5 7.9 7.5 0 4.7-3.8 7.6-9.5 7.6-3.5 0-6.9-.9-9.8-2.5l1.8-3.8c2.8 1.5 5.4 2.3 8 2.3 3.4 0 5.2-1.1 5.2-3.2 0-1.7-1.5-2.6-5.4-3.6-5.5-1.4-7.9-3.4-7.9-7.4 0-4.5 3.6-7.4 9.2-7.4 2.9 0 5.5.6 8 1.7z" fill="#c6a77b" />
        <path d="M11 46c10 2.4 24 2.7 42-3.7-4.6 4.7-12.4 8.3-22.2 8.3-7.7 0-14.1-1.6-19.8-4.6z" fill="#c6a77b" />
      </svg>
      <span className={`flex flex-col items-start leading-none ${inverse ? 'text-ivory' : 'text-primary'}`}>
        <span className="font-serif text-lg sm:text-xl font-semibold tracking-wide">Trending Sole</span>
        <span className={`mt-1 text-[8px] sm:text-[9px] font-sans font-semibold uppercase tracking-[0.22em] ${inverse ? 'text-gold-light' : 'text-slate-light'}`}>Footwear</span>
      </span>
    </span>
  );
}
