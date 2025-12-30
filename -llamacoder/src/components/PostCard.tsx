import { useState } from "react"
import { Heart, Share2, Play, Crown, Bot } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Post } from "../types/post"
import { User } from "../types/user"

interface PostCardProps {
  post: Post
  author: User
  currentUser: User
  onLike: (postId: string) => void
  onShare: (postId: string) => void
}

export default function PostCard({ post, author, currentUser, onLike, onShare }: PostCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoError, setVideoError] = useState(false)
  
  const isLiked = currentUser.likedPosts.includes(post.id)
  const videoId = post.videoUrl.split('/').pop()?.split('.')[0] || 'video'

  const handleVideoPlay = () => {
    setIsPlaying(true)
  }

  const handleVideoError = () => {
    setVideoError(true)
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={author.avatar}
            alt={author.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{author.username}</h3>
              {author.isOfficial && <Crown className="w-4 h-4 text-yellow-500" />}
              {author.isVerified && <Bot className="w-4 h-4 text-blue-500" />}
            </div>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>

      {/* Media Content */}
      <div className="relative bg-gray-100 aspect-[4/5]">
        {videoError ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <Play className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">Video unavailable</p>
            </div>
          </div>
        ) : (
          <>
            {/* Thumbnail */}
            <img
              src={post.thumbnailUrl}
              alt="Post thumbnail"
              className="w-full h-full object-cover"
            />
            
            {/* Play Button Overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <button
                  onClick={handleVideoPlay}
                  className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all transform hover:scale-105"
                >
                  <Play className="w-8 h-8 text-gray-900 ml-1" />
                </button>
              </div>
            )}
            
            {/* Video Player (shown when playing) */}
            {isPlaying && (
              <div className="absolute inset-0">
                <video
                  src={post.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                  onError={handleVideoError}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center gap-4 mb-3">
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isLiked 
                ? "bg-red-50 text-red-600 hover:bg-red-100" 
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            <span className="text-sm font-medium">
              {formatNumber(post.likes || 0)}
            </span>
          </button>
          
          <button
            onClick={() => onShare(post.id)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>

        {/* Caption */}
        {post.caption && (
          <div className="text-gray-900">
            <span className="font-semibold mr-2">{author.username}</span>
            <span className="text-gray-700">{post.caption}</span>
          </div>
        )}
      </div>
    </article>
  )
}