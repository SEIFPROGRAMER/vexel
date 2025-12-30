import { useState, useEffect } from "react"
import { Plus, User } from "lucide-react"
import Feed from "./components/Feed"
import PostModal from "./components/PostModal"
import ProfileModal from "./components/ProfileModal"
import LoginModal from "./components/LoginModal"
import Toast from "./components/Toast"
import { Post, createPost } from "./types/post"
import { User as UserType, createUser, updateUser, loadUsers, saveUsers } from "./types/user"
import { loadPosts, savePosts } from "./utils/localStorage"

function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<UserType[]>([])
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [showToast, setShowToast] = useState(false)

  // Initialize app with demo data
  useEffect(() => {
    const existingUsers = loadUsers()
    const existingPosts = loadPosts()
    
    if (existingUsers.length === 0) {
      // Create demo users
      const demoUsers = [
        createUser("vexel", "vexel@demo.com", "asdf1234flol", "https://i.pravatar.cc/150?u=vexel"),
        createUser("creator1", "creator1@demo.com", "pass123", "https://i.pravatar.cc/150?u=creator1"),
        createUser("artist2", "artist2@demo.com", "pass123", "https://i.pravatar.cc/150?u=artist2"),
        createUser("photographer", "photo@demo.com", "pass123", "https://i.pravatar.cc/150?u=photo"),
      ]
      
      // Set first user as official
      demoUsers[0].isOfficial = true
      demoUsers[0].isVerified = true
      demoUsers[0].bio = "Official Vexel account - Share your moments beautifully"
      demoUsers[0].followers = 15420
      demoUsers[0].following = 342
      
      setUsers(demoUsers)
      saveUsers(demoUsers)
      
      // Create demo posts
      const demoPosts = [
        createPost(
          demoUsers[0].id,
          "Beautiful sunset from last night's walk. The colors were absolutely stunning! 🌅",
          "https://picsum.photos/400/500?random=1"
        ),
        createPost(
          demoUsers[1].id,
          "Morning coffee and good vibes. Simple pleasures are the best. ☕",
          "https://picsum.photos/400/500?random=2"
        ),
        createPost(
          demoUsers[2].id,
          "New artwork completed! Mixed media on canvas. What do you think?",
          "https://picsum.photos/400/500?random=3"
        ),
        createPost(
          demoUsers[3].id,
          "Urban exploration leads to the most interesting discoveries.",
          "https://picsum.photos/400/500?random=4"
        ),
        createPost(
          demoUsers[0].id,
          "Welcome to Vexel! Share your visual moments with the world.",
          "https://picsum.photos/400/500?random=5"
        ),
      ]
      
      setPosts(demoPosts)
      savePosts(demoPosts)
    } else {
      setUsers(existingUsers)
      setPosts(existingPosts)
    }
    
    // Try to restore logged in user
    const savedUsername = localStorage.getItem('vexel_current_user')
    if (savedUsername) {
      const user = existingUsers.find(u => u.username === savedUsername)
      if (user) {
        setCurrentUser(user)
      }
    }
  }, [])

  const handleLike = (postId: string) => {
    if (!currentUser) {
      setIsLoginModalOpen(true)
      return
    }

    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, likes: (post.likes || 0) + (currentUser.likedPosts.includes(postId) ? -1 : 1) }
          : post
      )
    )

    const updatedUser = {
      ...currentUser,
      likedPosts: currentUser.likedPosts.includes(postId)
        ? currentUser.likedPosts.filter(id => id !== postId)
        : [...currentUser.likedPosts, postId]
    }

    setCurrentUser(updatedUser)
    
    // Update users array
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === currentUser.id ? updatedUser : user
      )
    )
    
    // Save to localStorage
    saveUsers(users.map(user => user.id === currentUser.id ? updatedUser : user))
    localStorage.setItem('vexel_current_user', currentUser.username)
  }

  const handleShare = (postId: string) => {
    const post = posts.find(p => p.id === postId)
    if (!post) return

    const shareUrl = `https://vexel.app/post/${postId}`
    
    if (navigator.share) {
      navigator.share({
        title: 'Check out this post on Vexel',
        text: post.caption || 'Amazing content on Vexel',
        url: shareUrl
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
      showToastMessage('Link copied to clipboard!')
    }
  }

  const handlePost = (imageUrl: string, caption: string) => {
    if (!currentUser) return

    const newPost = createPost(currentUser.id, caption, imageUrl)
    const updatedPosts = [newPost, ...posts]
    
    setPosts(updatedPosts)
    savePosts(updatedPosts)
    
    // Update user's posts count
    const updatedUser = { ...currentUser, postsCount: (currentUser.postsCount || 0) + 1 }
    setCurrentUser(updatedUser)
    
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === currentUser.id ? updatedUser : user
      )
    )
    saveUsers(users.map(user => user.id === currentUser.id ? updatedUser : user))
  }

  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleLogin = (username: string, password: string, rememberMe: boolean) => {
    const user = users.find(u => u.username === username)
    
    // Check if it's the special vexel user with the secret password
    if (user && user.username === "vexel" && password === "asdf1234flol") {
      setCurrentUser(user)
      if (rememberMe) {
        localStorage.setItem('vexel_current_user', username)
      } else {
        sessionStorage.setItem('vexel_current_user', username)
      }
      setIsLoginModalOpen(false)
      showToastMessage(`Welcome back, @${username}!`)
    } else if (user && user.username !== "vexel") {
      // For other users, accept any password (demo mode)
      setCurrentUser(user)
      if (rememberMe) {
        localStorage.setItem('vexel_current_user', username)
      } else {
        sessionStorage.setItem('vexel_current_user', username)
      }
      setIsLoginModalOpen(false)
      showToastMessage(`Welcome back, @${username}!`)
    } else {
      // Silently fail for invalid vexel password or non-existent users
      setIsLoginModalOpen(false)
    }
  }

  const handleSignup = (username: string, email: string, password: string, avatar?: string) => {
    if (users.some(u => u.username === username)) {
      // Silently fail - no error message shown
      setIsLoginModalOpen(false)
      return
    }

    const newUser = createUser(username, email, password, avatar || `https://i.pravatar.cc/150?u=${username}`)
    const updatedUsers = [...users, newUser]
    
    setUsers(updatedUsers)
    saveUsers(updatedUsers)
    setCurrentUser(newUser)
    localStorage.setItem('vexel_current_user', username)
    setIsLoginModalOpen(false)
    showToastMessage(`Welcome to Vexel, @${username}!`)
  }

  const handleProfileClick = () => {
    if (!currentUser) {
      setIsLoginModalOpen(true)
    } else {
      setIsProfileModalOpen(true)
    }
  }

  const handleUpdateAvatar = (avatarUrl: string) => {
    if (!currentUser) return

    const updatedUser = { ...currentUser, avatar: avatarUrl }
    setCurrentUser(updatedUser)
    
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === currentUser.id ? updatedUser : user
      )
    )
    saveUsers(users.map(user => user.id === currentUser.id ? updatedUser : user))
    
    showToastMessage('Profile picture updated!')
  }

  const getAuthor = (authorId: string) => {
    return users.find(u => u.id === authorId) || users[0]
  }

  const userPostsCount = posts.filter(p => p.authorId === currentUser?.id).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Vexel</h1>
            <button
              onClick={handleProfileClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <User className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <Feed
          posts={posts}
          currentUser={currentUser || users[0]}
          onLike={handleLike}
          onShare={handleShare}
          getAuthor={getAuthor}
        />
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsPostModalOpen(true)}
        className="fixed bottom-6 right-6 bg-gray-900 text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors z-30"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modals */}
      <PostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onPost={handlePost}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        posts={posts}
        userPostsCount={userPostsCount}
        onUpdateAvatar={handleUpdateAvatar}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />

      {/* Toast */}
      <Toast message={toastMessage} show={showToast} />
    </div>
  )
}

export default App