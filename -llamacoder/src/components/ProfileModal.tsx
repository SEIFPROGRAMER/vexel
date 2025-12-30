import { useState } from "react"
import { X, Camera } from "lucide-react"
import { User } from "../types/user"
import { Post } from "../types/post"
import { format, isValid } from "date-fns"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  currentUser: User | null
  posts: Post[]
  userPostsCount: number
  onUpdateAvatar: (avatarUrl: string) => void
}

export default function ProfileModal({ 
  isOpen, 
  onClose, 
  currentUser, 
  posts, 
  userPostsCount,
  onUpdateAvatar 
}: ProfileModalProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useState<HTMLInputElement | null>(null)

  if (!isOpen || !currentUser) return null

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveAvatar = () => {
    if (previewImage) {
      onUpdateAvatar(previewImage)
      setPreviewImage(null)
    }
  }

  // Safe date formatting
  const formatJoinedDate = () => {
    try {
      const date = currentUser.joinedDate ? new Date(currentUser.joinedDate) : new Date()
      if (isValid(date)) {
        return format(date, 'M/d/yyyy')
      }
      return '1/1/2024'
    } catch {
      return '1/1/2024'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-20 h-20 rounded-full object-cover"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-gray-900 text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={(ref) => fileInputRef.current = ref}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                @{currentUser.username}
                {currentUser.isVerified && (
                  <span className="text-blue-500 text-sm">✓</span>
                )}
                {currentUser.isOfficial && (
                  <span className="text-xs bg-gray-900 text-white px-2 py-1 rounded-full">Official</span>
                )}
              </h3>
              <p className="text-gray-600">{currentUser.bio || "No bio yet"}</p>
            </div>
          </div>

          {/* Avatar Preview */}
          {previewImage && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Preview new avatar:</p>
              <img
                src={previewImage}
                alt="Preview"
                className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveAvatar}
                  className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                >
                  Save Avatar
                </button>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{userPostsCount}</div>
              <div className="text-sm text-gray-600">Posts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{currentUser.followers}</div>
              <div className="text-sm text-gray-600">Followers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{currentUser.following}</div>
              <div className="text-sm text-gray-600">Following</div>
            </div>
          </div>

          {/* Account Info */}
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Location:</span>
              <span>Global</span>
            </div>
            <div className="flex justify-between">
              <span>Joined:</span>
              <span>{formatJoinedDate()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}