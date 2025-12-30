import { Check } from "lucide-react"

interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg"
  className?: string
  isOfficial?: boolean
}

export default function VerifiedBadge({ size = "md", className = "", isOfficial = false }: VerifiedBadgeProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  }

  const bgColor = isOfficial ? "bg-gradient-to-r from-yellow-400 to-yellow-500" : "bg-blue-500"

  return (
    <div className={`inline-flex items-center justify-center ${bgColor} rounded-full ${sizes[size]} ${className} shadow-sm`}>
      <Check className="w-2/3 h-2/3 text-white" />
    </div>
  )
}