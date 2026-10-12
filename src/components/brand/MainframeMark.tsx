type MainframeMarkProps = {
  className?: string;
};

/** Frame with one control core. Inherits color from the parent. */
export function MainframeMark({ className }: MainframeMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="1.6"
        y="1.6"
        width="28.8"
        height="28.8"
        rx="6.4"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <rect x="11.2" y="11.2" width="9.6" height="9.6" rx="2.2" fill="currentColor" />
      <rect x="14.85" y="5.15" width="2.3" height="4.15" rx="1.15" fill="currentColor" />
      <rect x="14.85" y="22.7" width="2.3" height="4.15" rx="1.15" fill="currentColor" />
      <rect x="5.15" y="14.85" width="4.15" height="2.3" rx="1.15" fill="currentColor" />
      <rect x="22.7" y="14.85" width="4.15" height="2.3" rx="1.15" fill="currentColor" />
    </svg>
  );
}
