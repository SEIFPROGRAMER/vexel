import { useState } from "react"
import { X, Camera } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { User } from "../types/user"
import { Post } from "../types/post"
import VerifiedBadge from "./VerifiedBadge"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  currentUser: User | null
  posts: Post[]
}

export default function ProfileModal({ isOpen, onClose, currentUser, posts }: ProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState("Visual storyteller 📸 | Capturing moments that matter")
  const [tempBio, setTempBio] = useState(bio)

  if (!isOpen || !currentUser) return null

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'm'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }

  const handleSaveBio = () => {
    setBio(tempBio)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setTempBio(bio)
    setIsEditing(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="flex items-start gap-6 mb-8">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-24 h-24 rounded-full object-cover"
              />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-gray-900">{currentUser.username}</h3>
                {currentUser.isVerified && <VerifiedBadge size="lg" />}
              </div>
              <div className="flex items-center gap-6 text-gray-600 mb-4">
                <span><strong>{posts.length}</strong> posts</span>
                <span><strong>{formatNumber(currentUser.followers)}</strong> followers</span>
                <span><strong>{formatNumber(currentUser.following)}</strong> following</span>
              </div>
              {isEditing ? (
                <div className="space-y-3">
                  <Textarea
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    placeholder="Tell your story..."
                    className="min-h-[80px]"
                    maxLength={150}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveBio}
                      className="bg-gray-900 hover:bg-gray-800 text-white"
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEdit}
                      className="border-gray-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-700 mb-2">{bio}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="border-gray-300"
                  >
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>
          </div>

          {currentUser.isVerified && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <VerifiedBadge size="sm" />
                <span className="font-semibold text-blue-900">Verified Account</span>
              </div>
              <p className="text-blue-800 text-sm mt-1">
                This account is verified because it's notable in visual arts, photography, or creative expression.
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            {posts.map((post) => (
              <div key={post.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={post.thumbnailUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}