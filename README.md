# Dedrick D. | DevOps Engineer Portfolio

A modern, responsive portfolio website built with React, TypeScript, and Mantine UI.

![Preview](preview.png)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **UI Library:** Mantine v7
- **Animations:** Framer Motion
- **Icons:** Tabler Icons
- **Font:** Inter (via Fontsource)

## 📁 Project Structure

```
portfolio/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── index.ts
│   ├── sections/        # Page sections
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Experience.tsx
│   │   ├── Projects.tsx
│   │   ├── Certifications.tsx
│   │   ├── Contact.tsx
│   │   └── index.ts
│   ├── data/            # Profile data
│   │   └── profile.ts
│   ├── styles/          # Global styles and theme
│   │   ├── global.css
│   │   └── theme.ts
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## ✨ Features

- **Dark/Light Mode:** Toggle between color schemes
- **Responsive Design:** Fully responsive across all devices
- **Smooth Animations:** Subtle entrance and hover animations
- **Glassmorphism:** Modern frosted glass effect on cards
- **Timeline Layout:** Experience section with visual timeline
- **SEO Optimized:** Proper meta tags and semantic HTML
- **Accessible:** Follows WCAG guidelines

## 🎨 Design Decisions

### UI Library: Mantine
Chose Mantine over shadcn/ui for:
- Built-in component library (faster development)
- Excellent TypeScript support
- Easy theming and customization
- Great dark mode implementation

### Color Scheme
- Primary: Blue gradient (#0969ff → #00dcea)
- Dark background: Near-black (#0a0a0f)
- Glass effects with subtle transparency

### Typography
- Inter font for clean, professional readability
- Responsive font sizing
- Clear visual hierarchy

## 📝 Customization

### Update Profile Data
Edit `src/data/profile.ts` to update:
- Personal information
- Work experience
- Skills
- Certifications
- Education

### Modify Theme
Edit `src/styles/theme.ts` for:
- Brand colors
- Typography settings
- Default radius

### Update Styles
Edit `src/styles/global.css` for:
- CSS custom properties
- Animation keyframes
- Utility classes

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 📄 License

MIT License - feel free to use this template for your own portfolio!

---

Built with ❤️ by Dedrick D.
