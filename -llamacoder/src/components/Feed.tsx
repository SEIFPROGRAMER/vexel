import { useState, useEffect, useRef, useCallback } from "react"
import PostCard from "./PostCard"
import { Post } from "../types/post"
import { User } from "../types/user"

interface FeedProps {
  posts: Post[]
  currentUser: User
  onLike: (postId: string) => void
  onShare: (postId: string) => void
  getAuthor: (authorId: string) => User
}

export default function Feed({ posts, currentUser, onLike, onShare, getAuthor }: FeedProps) {
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const lastPostRef = useRef<HTMLDivElement | null>(null)

  const postsPerLoad = 5

  useEffect(() => {
    // Reset when posts change
    setDisplayedPosts(posts.slice(0, postsPerLoad))
    setHasMore(posts.length > postsPerLoad)
  }, [posts])

  const loadMorePosts = useCallback(() => {
    if (loading || !hasMore) return
    
    setLoading(true)
    
    // Simulate loading delay
    setTimeout(() => {
      const currentLength = displayedPosts.length
      const nextPosts = posts.slice(currentLength, currentLength + postsPerLoad)
      
      if (nextPosts.length > 0) {
        setDisplayedPosts(prev => [...prev, ...nextPosts])
        setHasMore(currentLength + nextPosts.length < posts.length)
      } else {
        setHasMore(false)
      }
      
      setLoading(false)
    }, 500)
  }, [posts, displayedPosts.length, loading, hasMore])

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMorePosts()
        }
      },
      { threshold: 0.1 }
    )

    if (lastPostRef.current) {
      observerRef.current.observe(lastPostRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loadMorePosts, hasMore, loading])

  if (displayedPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No posts yet. Be the first to share!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {displayedPosts.map((post, index) => (
        <div
          key={post.id}
          ref={index === displayedPosts.length - 1 ? lastPostRef : null}
        >
          <PostCard
            post={post}
            author={getAuthor(post.authorId)}
            currentUser={currentUser}
            onLike={onLike}
            onShare={onShare}
          />
        </div>
      ))}
      
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        </div>
      )}
      
      {!hasMore && displayedPosts.length > 0 && (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">No more posts to load</p>
        </div>
      )}
    </div>
  )
}