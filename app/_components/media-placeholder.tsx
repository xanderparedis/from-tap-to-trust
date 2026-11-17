type MediaPlaceholderProps = {
  label: string;
  kind?: "Foto" | "Video" | "Illustratie";
};

export function MediaPlaceholder({ label, kind = "Foto" }: MediaPlaceholderProps) {
  return (
    <div className="media-placeholder">
      <div className="media-label">
        <span>{kind}</span>
        <strong>{label}</strong>
      </div>
    </div>
  );
}
