import { Post } from "../types/post"

export function loadPosts(): Post[] {
  const saved = localStorage.getItem('vexel_posts')
  if (!saved) return []
  
  try {
    const posts = JSON.parse(saved)
    return posts.map((post: any) => ({
      ...post,
      createdAt: new Date(post.createdAt)
    }))
  } catch (error) {
    console.error('Error loading posts:', error)
    return []
  }
}

export function savePosts(posts: Post[]) {
  localStorage.setItem('vexel_posts', JSON.stringify(posts))
}