interface WordmarkProps {
  size?: number
}

export function Wordmark({ label, size = 100 }: WordmarkProps & { label: string }) {
  return (
    <svg
      viewBox="0 0 115 30"
      width={size}
      height={(size * 30) / 115}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="0"
        y="21"
        fontFamily="Manrope, sans-serif"
        fontWeight="700"
        fontSize="20"
        fill="white"
        opacity="0.8"
      >
        {label}
      </text>
    </svg>
  )
}

export function GithubWordmark({ size = 100 }: WordmarkProps) {
  return <Wordmark label="GitHub" size={size} />
}

export function LinkedinWordmark({ size = 100 }: WordmarkProps) {
  return <Wordmark label="LinkedIn" size={size} />
}

export function FtbHustleWordmark({ size = 100 }: WordmarkProps) {
  return <Wordmark label="FTB Hustle" size={size} />
}

export function ZidioWordmark({ size = 100 }: WordmarkProps) {
  return <Wordmark label="Zidio" size={size} />
}

export function ChristUniversityWordmark({ size = 100 }: WordmarkProps) {
  return <Wordmark label="Christ University" size={size} />
}

export function AutomateWordmark({ size = 100 }: WordmarkProps) {
  return <Wordmark label="Automation" size={size} />
}

export function FullstackWordmark({ size = 100 }: WordmarkProps) {
  return <Wordmark label="Full-Stack" size={size} />
}