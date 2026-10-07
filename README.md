# TAMAFLIX 🎬🇬🇭

**TAMAFLIX** is a full-stack Netflix clone tailored with Ghanaian cinema, blockbusters, and an integrated digital cinema storefront (Buy for GH₵20, Rent for GH₵10).

Built with **Next.js 14 App Router**, **Tailwind CSS**, and **TypeScript**.

---

## ✨ Features

- **Iconic Netflix UI**: Dark aesthetic (`#141414`), red TAMAFLIX logo, sticky navbar that transitions on scroll, and responsive hero banner.
- **Categorized Movie Carousels**:
  - Trending Now
  - Top 10 in Ghana Today (with rank numbers)
  - Action & High-Octane Thrillers
  - Comedy & Feel-Good Laughs
- **Interactive Movie Cards**: Hover scaling previews, instant Play button, movie metadata pills, and price badges.
- **Movie Details (`/movies/[id]`)**: Full synopsis, high-res backdrops, director, starring cast, and similar recommendations.
- **Buy & Rent Storefront**:
  - **Buy for GH₵20**: Unlocks the title permanently.
  - **Rent for GH₵10**: 48-hour rental pass.
- **Authentication Guard**: Unauthenticated users attempting to **Play**, **Buy**, or **Rent** are automatically redirected to the `/login` portal.
- **Watch Page (`/watch/[id]`)**: Fullscreen responsive HTML5 video player with auto-hiding navigation overlay and fallback streaming support.
- **Admin Portal (`/admin/movies`)**: Complete CRUD capabilities stored in browser `localStorage` to add custom titles or remove movies, with a one-click reset to the 12 defaults.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/tamaflix.git
   cd tamaflix
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Visit [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy to Vercel

1. Push your repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your `tamaflix` repository.
4. Click **Deploy**. Vercel will build and assign a live production URL with free SSL.
