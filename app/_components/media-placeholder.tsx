type MediaPlaceholderProps = {
  label: string;
  kind?: "Photo" | "Video" | "Illustration";
};

export function MediaPlaceholder({ label, kind = "Photo" }: MediaPlaceholderProps) {
  return (
    <div className="media-placeholder">
      <div className="media-label">
        <span>{kind}</span>
        <strong>{label}</strong>
      </div>
    </div>
  );
}
