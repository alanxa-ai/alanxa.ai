# 🎨 Alanxa.ai Color Palette - Quick Reference

## Brand Colors (Copy & Paste)

```css
/* Primary Colors */
--electric-indigo: #6366F1;     /* Main brand color */
--deep-indigo: #4F46E5;         /* Secondary accent */
--aqua-cyan: #06B6D4;           /* Gradient highlight */
--sky-blue: #0EA5E9;            /* CTA buttons */

/* Backgrounds */
--soft-white: #F1F5F9;          /* Main background */
--navy-black: #0F172A;          /* Dark sections */
--pure-white: #FFFFFF;          /* Cards */
--border-light: #E2E8F0;        /* Borders */

/* Text */
--slate-black: #1E293B;         /* Primary text */
--muted-slate: #475569;         /* Secondary text */
--light-main: #F8FAFC;          /* Text on dark */
--light-muted: #CBD5E1;         /* Muted on dark */
```

## Tailwind Classes Cheatsheet

### Backgrounds
```jsx
bg-brand-primary      // #6366F1 Electric Indigo
bg-brand-secondary    // #4F46E5 Deep Indigo
bg-brand-gradient     // #06B6D4 Aqua Cyan
bg-brand-cta          // #0EA5E9 Sky Electric Blue
bg-bg-light           // #F1F5F9 Soft White
bg-bg-dark            // #0F172A Navy Black
bg-bg-card            // #FFFFFF Pure White
```

### Text Colors
```jsx
text-text-primary         // #1E293B Slate Black
text-text-secondary       // #475569 Muted Slate
text-text-light-main      // #F8FAFC Light Main
text-text-light-muted     // #CBD5E1 Light Muted
```

### Gradients (Background)
```jsx
bg-gradient-hero          // Hero gradient (Deep → Electric → Aqua)
bg-gradient-brand         // Brand gradient
bg-gradient-brand-radial  // Radial gradient
```

### Custom CSS Classes
```jsx
.btn-cta                  // Sky Blue CTA button
.btn-primary              // Electric Indigo button
.btn-secondary            // Deep Indigo button
.btn-outline              // Outline button
.card                     // White card with hover
.card-dark                // Dark card
.glass                    // Light glassmorphism
.glass-dark               // Dark glassmorphism
.gradient-hero            // Hero gradient background
.animated-gradient        // Animated background
.text-gradient            // Gradient text
.text-gradient-animated   // Animated gradient text
.pulse-brand              // Pulsing animation
.glow-brand               // Brand glow effect
.glow-cta                 // CTA glow effect
```

## Common Patterns

### Hero Section
```jsx
<section className="gradient-hero min-h-screen flex items-center justify-center">
  <div className="text-center">
    <h1 className="text-5xl font-bold text-white mb-6">
      Your Heading
    </h1>
    <p className="text-xl text-text-light-muted mb-8">
      Your description
    </p>
    <button className="btn-cta">
      Get Started
    </button>
  </div>
</section>
```

### Feature Cards
```jsx
<div className="grid md:grid-cols-3 gap-6">
  <div className="card">
    <div className="w-12 h-12 bg-brand-primary rounded-lg mb-4"></div>
    <h3 className="text-xl font-bold text-text-primary mb-2">Title</h3>
    <p className="text-text-secondary">Description</p>
  </div>
</div>
```

### Dark Section
```jsx
<section className="bg-bg-dark py-20">
  <div className="container mx-auto">
    <h2 className="text-4xl font-bold text-text-light-main mb-4">
      Title
    </h2>
    <p className="text-text-light-muted">
      Content
    </p>
  </div>
</section>
```

### CTA Banner
```jsx
<section className="animated-gradient py-16">
  <div className="text-center">
    <h2 className="text-4xl font-bold text-white mb-6">
      Call to Action
    </h2>
    <button className="btn-cta pulse-brand">
      Take Action
    </button>
  </div>
</section>
```

### Glass Card
```jsx
<div className="glass p-8 rounded-2xl">
  <h3 className="text-2xl font-bold text-text-primary mb-3">
    Glass Effect
  </h3>
  <p className="text-text-secondary">
    Frosted glass styling
  </p>
</div>
```

### Gradient Text
```jsx
<h1 className="text-gradient text-5xl font-bold">
  Gradient Heading
</h1>

<h2 className="text-gradient-animated text-4xl font-bold">
  Animated Gradient
</h2>
```

## Button Examples

```jsx
{/* Primary CTA - Sky Electric Blue */}
<button className="btn-cta">
  Get Started
</button>

{/* Primary Brand - Electric Indigo */}
<button className="btn-primary">
  Learn More
</button>

{/* Secondary - Deep Indigo */}
<button className="btn-secondary">
  View Details
</button>

{/* Outline */}
<button className="btn-outline">
  Contact Us
</button>

{/* Pulsing CTA */}
<button className="btn-cta pulse-brand">
  Limited Offer
</button>
```

## Color Usage Rules

✅ **DO:**
- Use `btn-cta` for primary calls-to-action
- Use `gradient-hero` for hero/banner sections
- Maintain high contrast (light text on dark, dark on light)
- Use `card` class for content cards
- Apply `text-gradient` for emphasis

❌ **DON'T:**
- Mix too many gradient backgrounds on one page
- Use low contrast combinations
- Override brand colors with custom values
- Forget hover states on interactive elements

## Responsive Breakpoints

```jsx
// Mobile First Approach
className="
  px-4 py-8          /* Mobile */
  md:px-8 md:py-12   /* Tablet (768px+) */
  lg:px-16 lg:py-20  /* Desktop (1024px+) */
"
```

## Animation Classes

```jsx
.fade-in              // Fade in from bottom
.slide-in-left        // Slide from left
.slide-in-right       // Slide from right
.pulse-brand          // Pulsing brand color
```

## Shadows

```jsx
shadow-cta            // CTA button shadow
shadow-brand          // Brand color shadow
shadow-card           // Subtle card shadow
```

---

**Quick Tip**: For best results, always start with the hero gradient, use glass effects sparingly, and maintain consistent spacing with Tailwind's spacing scale (p-4, p-6, p-8, etc.).

**Documentation**: See `DESIGN_SYSTEM.md` for complete details
**Demo Component**: `client/src/components/ColorPaletteDemo.jsx`
