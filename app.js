// Supabase Configuration
const SUPABASE_URL = 'https://mjhkaeuranonnipuwbwa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qaGthZXVyYW5vbm5pcHV3YndhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1OTkxMDcsImV4cCI6MjEwNDE3NTEwN30.fc6eMYlsS8BrvJWxnwxl2ERnjcsiYXyh-Z3xohI9ecs';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let postsData = [];

// --- DOM ELEMENTS ---
const galleryGrid = document.getElementById('galleryGrid');
const searchGrid = document.getElementById('searchGrid');
const relatedGrid = document.getElementById('relatedGrid');
const homePage = document.getElementById('homePage');
const searchPage = document.getElementById('searchPage');
const postDetailPage = document.getElementById('postDetailPage');
const mainHeader = document.getElementById('mainHeader');
const bottomNav = document.getElementById('bottomNav');
const navHome = document.getElementById('navHome');
const navSearch = document.getElementById('navSearch');

let currentActivePage = 'home';
let currentActivePost = null;

// --- FETCH POSTS FROM SUPABASE ---
async function fetchPostsFromSupabase() {
  const { data, error } = await supabaseClient.from('posts').select('*').order('id', { ascending: false });
  if (!error && data) {
    postsData = data;
    renderGallery(postsData, galleryGrid);
  }
}

// --- DARK / LIGHT MODE ---
const themeToggleBtn = document.getElementById('themeToggle');
themeToggleBtn?.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// --- GALLERY RENDER ---
function createPostCard(post) {
  const card = document.createElement('div');
  card.className = "break-inside-avoid rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 cursor-pointer group relative";
  card.onclick = () => openPostDetail(post.id, true);

  // Pehle console.log likhein taaki browser ke console mein data print ho
console.log("Post data from Supabase:", post);

card.innerHTML = `
    <div class="relative overflow-hidden">
      <img src="${post.image}" alt="${post.title}" loading="lazy" class="w-full object-cover group-hover:scale-105 transition-transform duration-300">
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
        <p class="text-white text-xs font-semibold truncate">${post.title}</p>
      </div>
    </div>
  `;
return card;

function renderGallery(posts = postsData, container = galleryGrid) {
  if (!container) return;
  container.innerHTML = '';
  posts.forEach(post => {
    container.appendChild(createPostCard(post));
  });
}

// --- NAVIGATION & VIEWS ---
function showHomePage(pushHistory = true) {
  currentActivePage = 'home';
  postDetailPage?.classList.add('hidden');
  searchPage?.classList.add('hidden');
  homePage?.classList.remove('hidden');
}

function openPostDetail(postId, pushHistory = true) {
  const post = postsData.find(p => p.id === postId);
  if (!post) return;

  currentActivePost = post;
  currentActivePage = 'detail';

  document.getElementById('detailImage').src = post.image;
  document.getElementById('detailTitle').innerText = post.title;
  document.getElementById('detailCategory').innerText = post.category || 'General';

  homePage?.classList.add('hidden');
  searchPage?.classList.add('hidden');
  postDetailPage?.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'instant' });
}

document.getElementById('postDetailBackBtn')?.addEventListener('click', () => { showHomePage(); });
navHome?.addEventListener('click', () => showHomePage(true));

// --- INITIAL LOAD ---
document.addEventListener('DOMContentLoaded', () => {
  fetchPostsFromSupabase();
});
