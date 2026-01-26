export function ExclamationmarkCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="12" y1="7" x2="12" y2="13" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  )
}
