export interface Post {
  id: string
  authorId: string
  imageUrl: string
  caption: string
  likes: number
  createdAt: Date
  videoUrl: string
  thumbnailUrl: string
}

export function createPost(authorId: string, caption: string, imageUrl: string): Post {
  const postId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
  
  return {
    id: postId,
    authorId,
    imageUrl,
    caption,
    likes: Math.floor(Math.random() * 100),
    createdAt: new Date(),
    videoUrl: `https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4`,
    thumbnailUrl: imageUrl
  }
}