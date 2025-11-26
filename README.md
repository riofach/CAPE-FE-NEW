# CAPE Frontend

> Frontend untuk CAPE (Catatan Pengeluaran) - AI-powered expense tracker dengan Soft Claymorphism design

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI library |
| **Vite** | Build tool & dev server |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **Framer Motion** | Animations |
| **Lucide React** | Icons |
| **React Router** | Client-side routing |
| **Supabase Auth** | Authentication |

## Design System

- **Style**: Soft Claymorphism
- **Palette**: Pastel Green/Mint + White + Soft Shadows
- **Typography**: Rounded & friendly
- **Corners**: Extra large (rounded-3xl)
- **Shadows**: Double inner-shadows for "inflated" look

See `theme.md` for complete design guidelines.

## Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- Supabase project (for Auth)

## Getting Started

### 1. Clone & Install

```bash
cd CAPE-FE
npm install
```

### 2. Environment Setup

Create `.env` file:

```bash
cp .env.example .env  # or create manually
```

**Required Environment Variables:**

```env
VITE_SUPABASE_URL=https://[PROJECT_REF].supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Where to get credentials:**
- **Supabase**: Dashboard → Project Settings → API

### 3. Run Development Server

```bash
npm run dev
```

App will start at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Project Structure

```
CAPE-FE/
├── public/
│   └── capev2-logo.png       # App logo
├── components/
│   ├── ui/                   # Reusable UI components
│   │   ├── button.tsx
│   │   ├── clay-card.tsx
│   │   └── clay-input.tsx
│   ├── layout/               # Layout components
│   │   └── navbar.tsx
│   ├── marketing/            # Landing page sections
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Features.tsx
│   │   ├── Pricing.tsx
│   │   ├── Testimonials.tsx
│   │   └── Footer.tsx
│   └── auth/                 # Auth components
│       └── ProtectedRoute.tsx
├── pages/                    # Route pages
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   └── AuthCallback.tsx
├── contexts/
│   └── AuthContext.tsx       # Auth state management
├── lib/
│   ├── utils.ts              # Utilities (cn, etc.)
│   └── supabase.ts           # Supabase client
├── App.tsx                   # Root component with Router
├── index.tsx                 # Entry point
├── index.html
├── theme.md                  # Design guidelines
├── vite.config.ts
└── package.json
```

## Routes

| Path | Component | Protected | Description |
|------|-----------|-----------|-------------|
| `/` | Landing | No | Marketing landing page |
| `/login` | Login | No | Sign in page |
| `/register` | Register | No | Sign up page |
| `/auth/callback` | AuthCallback | No | OAuth callback handler |
| `/dashboard` | Dashboard | **Yes** | User dashboard |

## Authentication

CAPE uses Supabase Auth with:
- Email/Password authentication
- Google OAuth (requires setup in Supabase Dashboard)

### Setting up Google OAuth

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Add OAuth credentials from Google Cloud Console
4. Add redirect URL: `https://[PROJECT_REF].supabase.co/auth/v1/callback`

## Custom Components

### ClayCard
Neumorphic card with soft shadows:
```tsx
<ClayCard color="white | green | lime">
  Content here
</ClayCard>
```

### ClayInput
Neumorphic input field:
```tsx
<ClayInput 
  label="Email" 
  type="email" 
  placeholder="kamu@email.com"
  error="Error message"
/>
```

### Button
Squishy clay-style button:
```tsx
<Button variant="primary | secondary | ghost" size="sm | md | lg">
  Click me
</Button>
```

## Deployment

### Netlify (Recommended)

1. Connect your Git repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Vercel

```bash
npm i -g vercel
vercel
```

### Manual

1. Build: `npm run build`
2. Deploy `dist/` folder to any static hosting

## Troubleshooting

### "Missing Supabase environment variables"
- Ensure `.env` file exists with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after changing env vars

### Auth redirect not working
- Check redirect URL is added to Supabase Auth settings
- For OAuth: Add `https://your-domain.com/auth/callback`

### Styles not loading
- Clear Vite cache: `rm -rf node_modules/.vite`
- Restart dev server

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT © Fachrio Raditya
