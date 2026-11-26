const paths = {
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  discover: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM16 8l-2.5 5.5L8 16l2.5-5.5L16 8Z",
  water: "M12 2.8C9.3 7 5 10.8 5 15a7 7 0 0 0 14 0c0-4.2-4.3-8-7-12.2ZM8.5 15a3.5 3.5 0 0 0 3.5 3.5",
  filter: "M4 4h16l-6 7v7l-4 2v-9L4 4Z",
  network: "M12 3v6m-7 5v-5h14v5M2 15h6v6H2zM16 15h6v6h-6zM9 1h6v4H9z",
  map: "M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z M14.5 10a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z",
  tests: "M9 3h6m-5 0v6l-5.5 9a1.5 1.5 0 0 0 1.3 2.2h12.4a1.5 1.5 0 0 0 1.3-2.2L14 9V3M7 15h10",
  shop: "M5 8h14l1.5 13h-17L5 8ZM8.5 10V6a3.5 3.5 0 0 1 7 0v4",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  arrow: "M5 12h14m-6-6 6 6-6 6",
} as const;

export function AppIcon({ name }: { name: keyof typeof paths }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={name === "more" ? 3 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  );
}
