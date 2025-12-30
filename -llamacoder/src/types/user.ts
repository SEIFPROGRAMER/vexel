export interface User {
  id: string
  username: string
  email: string
  avatar: string
  bio: string
  followers: number
  following: number
  postsCount: number
  isOfficial: boolean
  isVerified: boolean
  joinDate: Date
  likedPosts: string[]
  location?: string
  website?: string
}

export function createUser(
  username: string,
  email: string,
  password: string,
  avatar: string = `https://i.pravatar.cc/150?u=${username}`
): User {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    username,
    email,
    avatar,
    bio: "Sharing beautiful moments 📸",
    followers: Math.floor(Math.random() * 1000) + 100,
    following: Math.floor(Math.random() * 500) + 50,
    postsCount: 0,
    isOfficial: false,
    isVerified: false,
    joinDate: new Date(),
    likedPosts: [],
    location: undefined,
    website: undefined
  }
}

export function updateUser(user: User, updates: Partial<User>): User {
  return { ...user, ...updates }
}

export function loadUsers(): User[] {
  const saved = localStorage.getItem('vexel_users')
  if (!saved) return []
  
  try {
    const users = JSON.parse(saved)
    return users.map((user: any) => ({
      ...user,
      joinDate: new Date(user.joinDate)
    }))
  } catch (error) {
    console.error('Error loading users:', error)
    return []
  }
}

export function saveUsers(users: User[]) {
  localStorage.setItem('vexel_users', JSON.stringify(users))
}