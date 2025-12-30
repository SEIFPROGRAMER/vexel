// App state
let currentUser = null;
let posts = [];
let postIdCounter = 1;

// DOM elements
const loginScreen = document.getElementById('loginScreen');
const mainApp = document.getElementById('mainApp');
const feed = document.getElementById('feed');
const postModal = document.getElementById('postModal');
const imageInput = document.getElementById('imageInput');
const captionInput = document.getElementById('captionInput');
const imagePreview = document.getElementById('imagePreview');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Initialize app
function init() {
    loadPostsFromStorage();
    renderFeed();
}

// Login functionality
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === 'vexel' && password === 'asdf1234flol') {
        currentUser = username;
        loginScreen.classList.add('hidden');
        mainApp.classList.remove('hidden');
        init();
    } else {
        showToast('Invalid credentials');
    }
}

// Load posts from localStorage
function loadPostsFromStorage() {
    const stored = localStorage.getItem('vexel-posts');
    if (stored) {
        posts = JSON.parse(stored);
        postIdCounter = Math.max(...posts.map(p => p.id), 0) + 1;
    } else {
        // Create initial sample posts
        createSamplePosts();
    }
}

// Save posts to localStorage
function savePostsToStorage() {
    localStorage.setItem('vexel-posts', JSON.stringify(posts));
}

// Create sample posts
function createSamplePosts() {
    const samplePosts = [
        {
            id: postIdCounter++,
            imageUrl: 'https://picsum.photos/600/750?random=1',
            caption: 'Morning light through the window ✨',
            likes: 42,
            liked: false,
            timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
            id: postIdCounter++,
            imageUrl: 'https://picsum.photos/600/750?random=2',
            caption: 'Urban exploration in the city',
            likes: 128,
            liked: true,
            timestamp: new Date(Date.now() - 7200000).toISOString()
        },
        {
            id: postIdCounter++,
            imageUrl: 'https://picsum.photos/600/750?random=3',
            caption: 'Coffee and contemplation',
            likes: 67,
            liked: false,
            timestamp: new Date(Date.now() - 10800000).toISOString()
        }
    ];
    
    posts = [...samplePosts, ...posts];
    savePostsToStorage();
}

// Render feed
function renderFeed() {
    feed.innerHTML = '';
    posts.forEach(post => {
        const postElement = createPostElement(post);
        feed.appendChild(postElement);
    });
}

// Create post element
function createPostElement(post) {
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    
    const timeAgo = getTimeAgo(post.timestamp);
    const likedClass = post.liked ? 'liked' : '';
    
    postCard.innerHTML = `
        <img src="${post.imageUrl}" alt="Post" class="post-image">
        <div class="post-content">
            <div class="post-actions">
                <button class="action-button ${likedClass}" onclick="toggleLike(${post.id})">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="${post.liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span>${post.likes}</span>
                </button>
                <button class="action-button" onclick="sharePost(${post.id})">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                </button>
            </div>
            <div class="post-caption">${post.caption}</div>
            <div class="post-time">${timeAgo}</div>
        </div>
    `;
    
    return postCard;
}

// Toggle like
function toggleLike(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        savePostsToStorage();
        renderFeed();
    }
}

// Share post
function sharePost(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        const shareText = `Check out this post on Vexel: ${post.caption}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Vexel Post',
                text: shareText,
                url: post.imageUrl
            });
        } else {
            navigator.clipboard.writeText(post.imageUrl);
            showToast('Image URL copied to clipboard!');
        }
    }
}

// Modal functions
function openPostModal() {
    postModal.classList.remove('hidden');
}

function closePostModal() {
    postModal.classList.add('hidden');
    imageInput.value = '';
    captionInput.value = '';
    imagePreview.classList.add('hidden');
    uploadPlaceholder.classList.remove('hidden');
}

// Handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.style.backgroundImage = `url(${e.target.result})`;
            imagePreview.classList.remove('hidden');
            uploadPlaceholder.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
}

// Create new post
function createPost() {
    const file = imageInput.files[0];
    const caption = captionInput.value.trim();
    
    if (!file) {
        showToast('Please select an image');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const newPost = {
            id: postIdCounter++,
            imageUrl: e.target.result,
            caption: caption || 'Shared a moment',
            likes: 0,
            liked: false,
            timestamp: new Date().toISOString()
        };
        
        posts.unshift(newPost);
        savePostsToStorage();
        renderFeed();
        closePostModal();
        showToast('Post created!');
    };
    reader.readAsDataURL(file);
}

// Show toast notification
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Get time ago string
function getTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
}

// Close modal on outside click
postModal.addEventListener('click', function(e) {
    if (e.target === postModal) {
        closePostModal();
    }
});

// Handle Enter key on login
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !mainApp.classList.contains('hidden')) {
        handleLogin();
    }
});