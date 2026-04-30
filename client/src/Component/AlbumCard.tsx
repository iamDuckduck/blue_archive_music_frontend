import { Skeleton } from "@mui/material";

interface Props {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  onClick?: () => void;
}

const AlbumCard = ({ title, subtitle, imageUrl, onClick }: Props) => {
  return (
    <div
      className="min-w-[260px] group cursor-pointer"
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="relative glass-panel p-4 border border-white/40 tactical-card transition-all hover:translate-y-[-4px] hover:border-sky-400/50">
        <div className="aspect-square w-full mb-3 tactical-album-small overflow-hidden border border-white/20 bg-white/20 shadow-lg">
          {imageUrl ? (
            <img
              alt={title}
              src={imageUrl}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <Skeleton variant="rectangular" width="100%" height="100%" />
          )}
        </div>
        <h4 className="text-sm font-bold text-slate-800 truncate uppercase">
          {title}
        </h4>
        {subtitle && (
          <p className="text-[10px] text-sky-600 font-bold uppercase tracking-tighter truncate">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default AlbumCard;
