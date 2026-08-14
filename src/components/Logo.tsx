interface LogoProps {
  className?: string
}

export default function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M24 10 V70 M24 42 L56 12 M24 42 L56 68"
        stroke="white"
        strokeWidth="11"
        strokeLinecap="round"
      />
    </svg>
  )
}