import { Badge } from '@/components/ui/badge'

interface PostStatusBadgeProps {
  status: 'PENDING' | 'PUBLISHED' | 'FAILED'
}

export function PostStatusBadge({ status }: PostStatusBadgeProps) {
  if (status === 'PUBLISHED') {
    return <Badge className="bg-green-100 text-green-700 border-green-200">Published</Badge>
  }
  if (status === 'FAILED') {
    return <Badge variant="destructive">Failed</Badge>
  }
  return <Badge variant="outline" className="text-yellow-600 border-yellow-300">Pending</Badge>
}
