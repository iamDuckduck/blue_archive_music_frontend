import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";
import useCategories from "../hooks/useCategories";
import PageHeader from "../Component/PageHeader";
import AlbumCard from "../Component/AlbumCard";
import { PUBLIC_URL_PREFIX } from "../constants/api";

const CategorySection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section>
    <div className="flex items-center gap-4 mb-6">
      <div className="h-6 w-1 bg-sky-400" />
      <h3 className="text-xl font-black text-slate-800 uppercase tracking-wider">
        {title}
      </h3>
    </div>
    <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar edge-fade-right">
      {children}
    </div>
  </section>
);

const SkeletonRow = () => (
  <>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="min-w-[260px]">
        <Skeleton
          variant="rectangular"
          width={260}
          height={320}
          sx={{ bgcolor: "rgba(255,255,255,0.3)" }}
        />
      </div>
    ))}
  </>
);

const Library = () => {
  const { data: categories, isLoading, isError } = useCategories();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full">
      <section className="shrink-0 pb-6">
        <PageHeader title="Library" clockLabel="System Time" />
      </section>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div className="space-y-12 pb-12">
          {isLoading && (
            <CategorySection title="Loading...">
              <SkeletonRow />
            </CategorySection>
          )}

          {isError && (
            <p className="text-sm text-red-500/80 uppercase tracking-wider">
              Failed to load categories.
            </p>
          )}

          {categories?.map((cat) => (
            <CategorySection key={cat.id} title={cat.category}>
              {cat.albumList.length === 0 ? (
                <p className="text-xs text-slate-500 italic">
                  No albums yet.
                </p>
              ) : (
                cat.albumList.map((album) => (
                  <AlbumCard
                    key={album.title}
                    title={album.title}
                    subtitle={album.category}
                    imageUrl={
                      album.coverImagePath
                        ? `${PUBLIC_URL_PREFIX}${album.coverImagePath}`
                        : undefined
                    }
                    onClick={
                      album.id != null
                        ? () => navigate(`/library/albums/${album.id}`)
                        : undefined
                    }
                  />
                ))
              )}
            </CategorySection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Library;

