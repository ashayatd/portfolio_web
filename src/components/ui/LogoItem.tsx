import Image from "next/image";

type LogoItemProps = {
  name: string;
  logoUrl?: string;
  icon?: React.ReactNode;
};

export default function LogoItem({ name, logoUrl, icon }: LogoItemProps) {
  return (
    <div className="flex items-center gap-8 md:gap-4 group cursor-default">
      {/* Logo */}
      <div className="relative h-10 w-10 md:h-12 md:w-12 flex-shrink-0 transition-transform group-hover:scale-110">
        {icon ? (
          icon
        ) : logoUrl ? (
          <Image
            src={logoUrl}
            alt={`${name} logo`}
            fill
            className="object-contain filter grayscale opacity-70 transition-all group-hover:grayscale-0 group-hover:opacity-100"
            unoptimized
          />
        ) : (
          <div className="h-full w-full rounded-lg bg-zinc-700" />
        )}
      </div>

      {/* Name */}
      <span className="text-sm md:text-base font-medium text-zinc-300 group-hover:text-white transition-colors whitespace-nowrap">
        {name}
      </span>
    </div>
  );
}