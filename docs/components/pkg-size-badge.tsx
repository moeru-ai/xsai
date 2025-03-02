export interface PkgSizeBadgeProps {
  pkg: string
}

export const PkgSizeBadge = ({ pkg }: PkgSizeBadgeProps) => (
  <div className="not-prose flex gap-2">
    <img alt="install size" src={`https://flat.badgen.net/packagephobia/install/${pkg}?color=gray`} />
    <img alt="minified size" src={`https://flat.badgen.net/bundlephobia/min/${pkg}?color=gray`} />
    <img alt="minzipped size" src={`https://flat.badgen.net/bundlephobia/minzip/${pkg}?color=gray`} />
  </div>
)
