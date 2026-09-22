// Supabase APIの初期化
const SUPABASE_URL = "https://xtsybgpkdnuunmqitskf.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_V2YRGXa91ellm8VooS2aHg_piuF2WbD";
window.supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
);

const LOGIN_PAGE = "login.html";
const HOME_PAGE = "index.html";

async function requireAuth() {
  const { data } = await window.supabaseClient.auth.getSession();
  const session = data?.session ?? null;

  if (!session) {
    window.location.href = LOGIN_PAGE;
    return null;
  }

  return session;
}

async function redirectIfAuthenticated() {
  const { data } = await window.supabaseClient.auth.getSession();
  const session = data?.session ?? null;

  if (session) {
    window.location.href = HOME_PAGE;
  }
}

if (
  window.location.pathname.endsWith("/login.html") ||
  window.location.pathname.endsWith("login.html")
) {
  window.addEventListener("DOMContentLoaded", redirectIfAuthenticated);
}
