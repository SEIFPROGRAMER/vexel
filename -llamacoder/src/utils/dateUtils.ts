import { formatDistanceToNow } from "date-fns"

export function formatTimestamp(dateString: string): string {
  try {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  } catch (error) {
    console.error("Error formatting timestamp:", error)
    return "Recently"
  }
}