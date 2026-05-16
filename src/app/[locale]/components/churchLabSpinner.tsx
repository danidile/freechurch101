export default function ChurchLabLoader({
  height = "full",
}: {
  height?: string;
}) {
  return (
    <div
      className={`container-sub ${height === "full" ? "h-[60vh]" : `h-[${height}]`}`}
    >
      <img
        src="/images/loader.gif"
        className="h-[30px] w-[30px]"
        alt="Loading..."
      />
    </div>
  );
}
