# 🎨 Alanxa.ai Color Palette & Design System

## 📋 Table of Contents
1. [Brand Colors](#brand-colors)
2. [Background System](#background-system)
3. [Text Colors](#text-colors)
4. [Gradients](#gradients)
5. [Button Styles](#button-styles)
6. [Usage Examples](#usage-examples)

---

## 🎨 Brand Colors

### Primary Accent (Main Brand Color)
**Electric Indigo**
- **HEX:** `#6366F1`
- **Usage:** Primary buttons, important icons, links, key highlights
- **Tailwind:** `bg-brand-primary` or `bg-primary`
- **CSS Variable:** `var(--color-brand-primary)`

### Secondary Accent
**Deep Indigo**
- **HEX:** `#4F46E5`
- **Usage:** Secondary buttons, gradients, badges, hover states
- **Tailwind:** `bg-brand-secondary` or `bg-secondary`
- **CSS Variable:** `var(--color-brand-secondary)`

### Gradient Highlight Color
**Aqua Cyan**
- **HEX:** `#06B6D4`
- **Usage:** Gradients, accent glow, focus borders
- **Tailwind:** `bg-brand-gradient` or `bg-accent`
- **CSS Variable:** `var(--color-brand-gradient)`

### CTA Button Color
**Sky Electric Blue**
- **HEX:** `#0EA5E9`
- **Usage:** Main call-to-action buttons, important form buttons
- **Tailwind:** `bg-brand-cta`
- **CSS Variable:** `var(--color-brand-cta)`

---

## 🖼️ Background System

### Light Background (Default)
**Soft White**
- **HEX:** `#F1F5F9`
- **Usage:** Main page background, sections, form backgrounds
- **Tailwind:** `bg-bg-light` or `bg-light`

### Dark Background
**Navy Black**
- **HEX:** `#0F172A`
- **Usage:** Dark sections, hero, footer, premium blocks
- **Tailwind:** `bg-bg-dark` or `bg-dark`

### Card Backgrounds
**Pure White**
- **HEX:** `#FFFFFF`
- **Usage:** Card backgrounds on light sections
- **Tailwind:** `bg-bg-card`
- **Border:** `#E2E8F0` (use `border-border-light`)

---

## ✍️ Text Colors

### Primary Text
**Slate Black**
- **HEX:** `#1E293B`
- **Usage:** Body text, primary headings (H1-H3)
- **Tailwind:** `text-text-primary`

### Secondary Text
**Muted Slate**
- **HEX:** `#475569`
- **Usage:** Sub-headings, descriptions, helper text
- **Tailwind:** `text-text-secondary`

### Text on Dark Backgrounds

#### Main Text on Dark
- **HEX:** `#F8FAFC`
- **Tailwind:** `text-text-light-main`

#### Muted Text on Dark
- **HEX:** `#CBD5E1`
- **Tailwind:** `text-text-light-muted`

---

## 🌈 Gradients

### 1. Hero Gradient (Primary)
```css
background: linear-gradient(135deg, #4F46E5 0%, #6366F1 40%, #06B6D4 100%);
```
**Tailwind:** `bg-gradient-hero`
**CSS Class:** `.gradient-hero`

### 2. Animated Brand Gradient
```css
background: linear-gradient(-45deg, #4F46E5, #6366F1, #06B6D4, #0EA5E9);
background-size: 400% 400%;
animation: gradient 15s ease infinite;
```
**CSS Class:** `.animated-gradient`

### 3. Text Gradient
```css
background: linear-gradient(to right, #4F46E5, #6366F1, #06B6D4);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```
**CSS Class:** `.text-gradient`

### 4. Radial Gradient
```css
background: radial-gradient(circle, #6366F1 0%, #4F46E5 50%, #06B6D4 100%);
```
**CSS Class:** `.gradient-radial`
**Tailwind:** `bg-gradient-brand-radial`

---

## 🔘 Button Styles

### Primary CTA Button
```jsx
<button className="btn-cta">Get Started</button>
```
**Properties:**
- Background: `#0EA5E9`
- Hover: Gradient to `#06B6D4`
- Shadow: `0 4px 12px rgba(14,165,233,0.35)`
- Border-radius: `10px`

### Secondary Button
```jsx
<button className="btn-secondary">Learn More</button>
```
**Properties:**
- Background: `#4F46E5`
- Hover: `#6366F1`
- Border-radius: `10px`

### Primary Brand Button
```jsx
<button className="btn-primary">Contact Us</button>
```
**Properties:**
- Background: `#6366F1`
- Hover: `#4F46E5`

### Outline Button
```jsx
<button className="btn-outline">View Details</button>
```
**Properties:**
- Border: `2px solid #6366F1`
- Hover: Fills with brand color

---

## 💡 Usage Examples

### Example 1: Hero Section
```jsx
<section className="gradient-hero min-h-screen flex items-center justify-center">
  <div className="text-center">
    <h1 className="text-5xl font-bold text-text-light-main mb-4">
      Welcome to Alanxa.ai
    </h1>
    <p className="text-xl text-text-light-muted mb-8">
      Innovative AI Solutions for Modern Businesses
    </p>
    <button className="btn-cta">
      Get Started Today
    </button>
  </div>
</section>
```

### Example 2: Feature Cards on Light Background
```jsx
<section className="bg-bg-light py-16">
  <div className="container mx-auto px-4">
    <div className="grid md:grid-cols-3 gap-6">
      <div className="card">
        <h3 className="text-2xl font-bold text-text-primary mb-3">
          AI Solutions
        </h3>
        <p className="text-text-secondary">
          Cutting-edge artificial intelligence services
        </p>
        <button className="btn-primary mt-4">Learn More</button>
      </div>
    </div>
  </div>
</section>
```

### Example 3: Dark Section with Glassmorphism
```jsx
<section className="bg-dark py-20">
  <div className="container mx-auto px-4">
    <div className="glass-dark rounded-2xl p-8 max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-text-light-main text-gradient mb-6">
        Why Choose Alanxa.ai?
      </h2>
      <p className="text-text-light-muted text-lg">
        We deliver excellence in every project
      </p>
    </div>
  </div>
</section>
```

### Example 4: CTA Banner with Gradient
```jsx
<section className="animated-gradient py-16">
  <div className="container mx-auto px-4 text-center">
    <h2 className="text-4xl font-bold text-white mb-6">
      Ready to Transform Your Business?
    </h2>
    <button className="btn-cta pulse-brand">
      Start Your Journey
    </button>
  </div>
</section>
```

---

## 🎯 Design Principles

### 1. High Contrast
- Always use dark text (#1E293B) on light backgrounds
- Always use light text (#F8FAFC) on dark backgrounds (#0F172A)

### 2. Consistent Spacing
- Use Tailwind's spacing scale: `p-4`, `p-6`, `p-8`, etc.
- Maintain consistent gaps: `gap-4`, `gap-6`, `gap-8`

### 3. Smooth Transitions
- All interactive elements should have `transition-all duration-300`
- Hover states should have subtle transforms: `hover:translate-y-[-2px]`

### 4. Shadows & Depth
- Cards: `shadow-card` (subtle)
- Buttons: `shadow-cta` or `shadow-brand`
- Hover: Increase shadow intensity

### 5. Border Radius
- Cards: `12px` (rounded-xl)
- Buttons: `10px` (rounded-lg)
- Small elements: `8px` (rounded-lg)

---

## 🛠️ Utility Classes Reference

### Glassmorphism
- `.glass` - Light glassmorphism effect
- `.glass-dark` - Dark glassmorphism effect

### Gradients
- `.gradient-hero` - Hero section gradient
- `.animated-gradient` - Animated background
- `.text-gradient` - Gradient text effect
- `.text-gradient-animated` - Animated gradient text

### Effects
- `.glow-brand` - Brand color glow
- `.glow-cta` - CTA color glow
- `.pulse-brand` - Pulsing animation
- `.fade-in` - Fade in animation
- `.slide-in-left` - Slide from left
- `.slide-in-right` - Slide from right

---

## 📱 Responsive Design

All components should follow mobile-first approach:

```jsx
<div className="
  px-4 py-8          /* Mobile */
  md:px-8 md:py-12   /* Tablet */
  lg:px-16 lg:py-20  /* Desktop */
">
  {/* Content */}
</div>
```

---

## ✅ Checklist

When creating new components, ensure:

- [ ] Uses approved color palette
- [ ] High contrast maintained
- [ ] Hover states implemented
- [ ] Mobile responsive
- [ ] Smooth transitions
- [ ] Proper spacing
- [ ] Accessibility (focus states)
- [ ] Brand gradient used for hero/CTA sections

---

**Last Updated:** December 5, 2025  
**Version:** 1.0  
**Brand:** Alanxa.ai
