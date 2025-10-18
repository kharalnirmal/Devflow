# 🎨 Local Fonts in Next.js 15 + Tailwind CSS v4

> A no-nonsense guide to shipping custom fonts without Google's CDN slowing you down.

---

## 🧩 Why Local Fonts?

Before we dive in, here's why you should care:

| Benefit | Description |
|---------|-------------|
| **Performance** | No external requests = faster initial load. Your fonts are bundled and optimized. |
| **Privacy** | No tracking pixels from Google Fonts. GDPR lawyers will thank you. |
| **Reliability** | Zero dependency on third-party CDNs. Works offline, always. |
| **Control** | Fine-tune subsetting, weights, and fallbacks exactly how you want. |
| **Caching** | Fonts are versioned with your build. Cache invalidation actually works. |

---

## 🚀 Setup Guide

### Step 1: Download Your Fonts

Grab your font files (preferably `.ttf` or `.woff2` for variable fonts). For this example, we're using **Inter** — a beautiful variable font that scales from 100 to 900 weight.

**Where to get fonts:**
- [Google Fonts](https://fonts.google.com/) (download button in top right)
- [Fontsource](https://fontsource.org/)
- Buy them if you're feeling fancy

**Pro tip:** Variable fonts (with `VF` in the name) are single files that contain multiple weights. Way better than downloading 9 separate files.

---

### Step 2: Create Your Fonts Folder

Structure matters. Keep your fonts organized in your `app` directory:

```
app/
├── fonts/
│   ├── InterVF.ttf
│   └── SpaceGroteskVF.ttf
├── layout.tsx
└── globals.css
```

**Why in `app/fonts`?** Next.js 15 uses the app directory structure. Keeping fonts here makes imports clean and relative paths simple.

---

### Step 3: Import Font in `layout.tsx`

This is where the magic happens. Open your root layout file (usually `app/layout.tsx`) and add:

```tsx
import localFont from "next/font/local";

const inter = localFont({
  src: "./fonts/InterVF.ttf",
  variable: "--font-inter",
  weight: "100 200 300 400 500 600 700 800 900",
});

const spaceGrotesk = localFont({
  src: "./fonts/SpaceGroteskVF.ttf",
  variable: "--font-space-grotesk",
  weight: "100 200 300 400 500 600 700 800 900",
});
```

**What's happening here:**

- **`localFont()`** — Next.js built-in helper that handles font optimization and loading
- **`src`** — Relative path to your font file (from the current file's location)
- **`variable`** — The CSS custom property name you'll reference in Tailwind
- **`weight`** — All available weights (variable fonts support the full range)

**Why this approach?** Next.js automatically optimizes fonts, generates fallback fonts, and prevents layout shift (FOUT/FOIT). It's basically free performance.

---

### Step 4: Apply to Root Layout

Still in `layout.tsx`, add the font variable classes to your root elements:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

**Why on `<html>`?** This makes your CSS variables globally available. You can now reference them anywhere in your styles.

---

### Step 5: Configure Tailwind v4

Here's where Tailwind v4 shines. Open your `globals.css` and add your theme configuration:

```css
@import "tailwindcss";

@theme {
  --font-inter: var(--font-inter);
  --font-space-grotesk: var(--font-space-grotesk);
}
```

**What changed in v4:**

- **`@theme`** replaces the old `theme.extend` object in `tailwind.config.js`
- CSS-native configuration means less context-switching
- Values map directly to Tailwind utilities

**Translation:** `--font-inter` becomes `font-inter` in your HTML classes. Simple.

---

## 💅 Using Your Fonts

Now for the fun part. Apply fonts using standard Tailwind classes:

```tsx
// Default font (Inter)
<body className="font-inter">
  <h1 className="font-bold">Clean typography</h1>
</body>

// Switch fonts per element
<div className="font-space-grotesk">
  <h2 className="font-semibold">Different heading font</h2>
</div>

// Mix and match
<article className="font-inter">
  <h1 className="font-space-grotesk font-black text-4xl">
    Grotesk for impact
  </h1>
  <p className="font-normal">Inter for readability</p>
</article>
```

**Pro tip:** Set your primary font on `<body>` so you don't repeat `font-inter` everywhere.

---

## ⚡ Advanced: Multiple Font Formats

Want to support both modern and legacy browsers? Use multiple sources:

```tsx
const inter = localFont({
  src: [
    {
      path: "./fonts/InterVF.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "./fonts/InterVF.ttf",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-inter",
});
```

Browsers will pick the first format they support (`.woff2` is smaller and preferred).

---

## 📦 Complete Directory Structure

Here's what your setup should look like:

```
my-app/
├── app/
│   ├── fonts/
│   │   ├── InterVF.ttf
│   │   └── SpaceGroteskVF.ttf
│   ├── layout.tsx          # Font imports and root layout
│   ├── page.tsx            # Your pages
│   └── globals.css         # Tailwind + @theme config
├── public/
├── package.json
└── next.config.ts
```

---

## 🔍 `.variable` vs `.className` — What's the Difference?

When you use `localFont()`, Next.js gives you **two properties** to work with:

```tsx
const inter = localFont({
  src: "./fonts/InterVF.ttf",
  variable: "--font-inter",
});

console.log(inter.variable);  // "some-hash-class"
console.log(inter.className); // "another-hash-class"
```

### The Breakdown

| Property | Purpose | What Happens |
|----------|---------|--------------|
| `.variable` | **Defines CSS custom property** | Makes `--font-inter` available globally. You control usage with Tailwind classes. |
| `.className` | **Applies font directly** | Sets font-family on that element immediately. No class needed. |

### Pattern 1: Tailwind-First (Recommended)

```tsx
<html className={`${inter.variable} ${spaceGrotesk.variable}`}>
  <body className="font-inter">
    <h1 className="font-space-grotesk">Different font</h1>
  </body>
</html>
```

**Result:** Nothing applied by default. You explicitly choose fonts with utility classes.

**Best for:** Apps with multiple fonts used throughout.

---

### Pattern 2: Set Default + Keep Options

```tsx
<html className={`${inter.className} ${spaceGrotesk.variable}`}>
  <body>
    <p>This uses Inter automatically</p>
    <h1 className="font-space-grotesk">This switches to Space Grotesk</h1>
  </body>
</html>
```

**Result:** Inter is the default everywhere. Space Grotesk available when you need it.

**Best for:** Apps with one primary font (90% usage) + accent fonts.

---

### Pattern 3: Maximum Control

```tsx
<html className={`${inter.variable} ${spaceGrotesk.variable}`}>
  <body className={inter.className}>
    {/* Inter applied here, variables defined globally */}
  </body>
</html>
```

**Result:** CSS variables on `<html>`, font applied at `<body>`.

**Best for:** Complex apps needing granular control.

---

### Quick Rule

- Use `.variable` → You **need** Tailwind classes (`font-inter`)
- Use `.className` → Font applies **automatically** (no class needed)

**My take:** Stick with Pattern 1 (`.variable` everywhere) for consistency with Tailwind's utility-first philosophy. You'll always know what font is being used just by reading the className.

---

## 🏷️ Version Info

This guide is built for:

- **Next.js 15.x** (App Router)
- **Tailwind CSS v4.x** (with `@theme` syntax)
- **React 18+**

If you're on older versions, some syntax may differ (especially the Tailwind config).

---

## 🎯 Troubleshooting

**Fonts not loading?**
- Check file paths are relative to your `layout.tsx`
- Verify font files are actually in the `fonts/` folder
- Clear `.next` cache and rebuild

**Weights not working?**
- Make sure you're using a variable font (VF)
- If using static fonts, specify exact weight per file

**Tailwind classes not applying?**
- Confirm `@theme` block is in `globals.css`
- Restart dev server after CSS changes

---

## 🤝 Contributing

Found a better way? Open an issue or PR. Fonts are personal, and setups vary.

---

**Author:** Built for developers who value speed, control, and clean code.  
**License:** Do whatever you want with this guide.  
**Last Updated:** October 2024

---

*Now go ship those crisp, locally-served fonts. Your Lighthouse score will thank you.* ⚡