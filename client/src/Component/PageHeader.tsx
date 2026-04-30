import useNowClock from "../hooks/useNowClock";

interface Props {
  title: string;
  eyebrow?: string;
  clockLabel?: string;
}

const PageHeader = ({ title, eyebrow, clockLabel = "Local Time" }: Props) => {
  const { time, tzLabel } = useNowClock();

  return (
    <div className="flex items-end justify-between border-b border-sky-400/20 pb-4">
      <div>
        {eyebrow && (
          <span className="text-sky-600 font-bold tracking-[0.2em] text-[10px] uppercase">
            {eyebrow}
          </span>
        )}
        <h2 className="text-5xl font-black mt-2 ba-bordered-text">{title}</h2>
      </div>
      <div className="text-right">
        <div className="text-2xl font-light text-slate-800">{time}</div>
        <div className="text-[10px] uppercase tracking-tighter text-sky-600 font-bold">
          {clockLabel} / {tzLabel}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
