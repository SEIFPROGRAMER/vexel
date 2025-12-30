interface AuthCookie {
  id: string
  username: string
}

const AUTH_COOKIE_KEY = "vexel_auth"

export const setAuthCookie = (user: AuthCookie, rememberMe: boolean = false): void => {
  const expiry = rememberMe 
    ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
    : new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  
  const cookieData = {
    ...user,
    expires: expiry.toISOString()
  }
  
  localStorage.setItem(AUTH_COOKIE_KEY, JSON.stringify(cookieData))
}

export const getAuthCookie = (): AuthCookie | null => {
  try {
    const stored = localStorage.getItem(AUTH_COOKIE_KEY)
    if (!stored) return null
    
    const data = JSON.parse(stored)
    const now = new Date()
    const expires = new Date(data.expires)
    
    if (now > expires) {
      deleteAuthCookie()
      return null
    }
    
    return { id: data.id, username: data.username }
  } catch {
    return null
  }
}

export const deleteAuthCookie = (): void => {
  localStorage.removeItem(AUTH_COOKIE_KEY)
}

export const isAuthenticated = (): boolean => {
  return getAuthCookie() !== null
}