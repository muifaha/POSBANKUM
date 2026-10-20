import Image from "next/image";
import Link from "next/link";

interface AppLogoProps {
  href?: string;
  variant?: "full" | "mark";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AppLogo({ href = "/", variant = "full", size = "md", className = "" }: AppLogoProps) {
  const heights = {
    sm: "h-9",
    md: "h-12",
    lg: "h-16",
  };

  const content = (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className={`relative ${heights[size]} aspect-[2.57/1]`}>
        <Image
          src="/logo-lapor-posbankum.png"
          alt="LAPOR! POSBANKUM - Layanan Pengaduan Pos Bantuan Hukum Kelurahan Mangunsari"
          fill
          sizes="(max-width: 768px) 150px, 200px"
          className="object-contain"
          priority
        />
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#C9962B] rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
