export default function BrandLogo({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className={inverse ? 'inline-flex items-center whitespace-nowrap rounded-sm bg-ivory px-2 py-1' : 'inline-flex items-center whitespace-nowrap'}>
      <img src="/logo.svg" alt="Trending Sole" className="h-12 w-auto sm:h-14" />
    </span>
  );
}
