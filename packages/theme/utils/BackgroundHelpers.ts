export const getoverlay = (gradient: string, depth: number) => {
  const deg =
    gradient && gradient !== 'none'
      ? gradient == 'left'
        ? '90deg'
        : gradient == 'left-bottom'
          ? '60deg'
          : gradient == 'left-top'
            ? '120deg'
            : gradient == 'right'
              ? '270deg'
              : gradient == 'bottom'
                ? '10deg'
                : gradient == 'top'
                  ? '170deg'
                  : ''
      : ''
  return gradient && gradient !== 'none'
    ? gradient !== 'full'
      ? `linear-gradient(${deg}, oklch(from var(--color-primary-bg) l c h / ${depth}) 18%, rgba(255, 255, 255, 0.62) 50%, rgba(255, 255, 255, 0.10) 81%)`
      : ''
    : ''
}
