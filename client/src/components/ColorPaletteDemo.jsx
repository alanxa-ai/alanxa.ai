import React from 'react';

/**
 * Alanxa.ai Color Palette Demo Component
 * This component demonstrates all the brand colors and design elements
 */
const ColorPaletteDemo = () => {
  return (
    <div className="min-h-screen bg-bg-light py-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Demo */}
        <section className="gradient-hero rounded-3xl p-12 mb-16 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Alanxa.ai Color System
          </h1>
          <p className="text-text-light-muted text-xl mb-8">
            A comprehensive design system with Electric Indigo, Sky Blue, and Aqua Cyan
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="btn-cta">Primary CTA Button</button>
            <button className="btn-secondary">Secondary Button</button>
            <button className="btn-outline border-white text-white hover:bg-white hover:text-brand-primary">Outline Button</button>
          </div>
        </section>

        {/* Color Swatches */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-text-primary mb-8">Brand Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Electric Indigo */}
            <div className="card">
              <div className="bg-brand-primary h-32 rounded-lg mb-4"></div>
              <h3 className="font-bold text-text-primary mb-2">Electric Indigo</h3>
              <p className="text-text-secondary text-sm mb-2">#6366F1</p>
              <p className="text-xs text-text-secondary">Primary brand color</p>
            </div>

            {/* Deep Indigo */}
            <div className="card">
              <div className="bg-brand-secondary h-32 rounded-lg mb-4"></div>
              <h3 className="font-bold text-text-primary mb-2">Deep Indigo</h3>
              <p className="text-text-secondary text-sm mb-2">#4F46E5</p>
              <p className="text-xs text-text-secondary">Secondary accent</p>
            </div>

            {/* Aqua Cyan */}
            <div className="card">
              <div className="bg-brand-gradient h-32 rounded-lg mb-4"></div>
              <h3 className="font-bold text-text-primary mb-2">Aqua Cyan</h3>
              <p className="text-text-secondary text-sm mb-2">#06B6D4</p>
              <p className="text-xs text-text-secondary">Gradient highlight</p>
            </div>

            {/* Sky Electric Blue */}
            <div className="card">
              <div className="bg-brand-cta h-32 rounded-lg mb-4"></div>
              <h3 className="font-bold text-text-primary mb-2">Sky Electric Blue</h3>
              <p className="text-text-secondary text-sm mb-2">#0EA5E9</p>
              <p className="text-xs text-text-secondary">CTA button color</p>
            </div>
          </div>
        </section>

        {/* Gradient Examples */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-text-primary mb-8">Gradient System</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="gradient-hero rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Hero Gradient</h3>
              <p className="text-text-light-muted">Deep Indigo → Electric Indigo → Aqua Cyan</p>
            </div>

            <div className="animated-gradient rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Animated Gradient</h3>
              <p className="text-text-light-muted">Smooth animated background</p>
            </div>
          </div>
        </section>

        {/* Text Examples */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-text-primary mb-8">Typography & Text Colors</h2>
          <div className="card">
            <h1 className="text-4xl font-bold text-text-primary mb-4">
              Heading 1 - Primary Text
            </h1>
            <h2 className="text-3xl font-bold text-gradient mb-4">
              Heading 2 - Gradient Text
            </h2>
            <p className="text-xl text-text-secondary mb-4">
              Secondary text for descriptions and helper content
            </p>
            <p className="text-gradient-animated text-2xl font-bold">
              Animated Gradient Text Effect
            </p>
          </div>
        </section>

        {/* Dark Section Example */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-text-primary mb-8">Dark Background</h2>
          <div className="bg-bg-dark rounded-2xl p-12">
            <h3 className="text-4xl font-bold text-text-light-main mb-4">
              Perfect for hero sections
            </h3>
            <p className="text-text-light-muted text-lg mb-6">
              Navy Black background (#0F172A) with light text maintains excellent contrast
            </p>
            <button className="btn-cta">Get Started</button>
          </div>
        </section>

         {/* Cards Demo */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-text-primary mb-8">Card Styles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="w-12 h-12 bg-brand-primary rounded-lg mb-4 flex items-center justify-center text-white text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Feature One</h3>
              <p className="text-text-secondary">Clean white cards with subtle shadows</p>
            </div>
            
            <div className="card">
              <div className="w-12 h-12 bg-brand-cta rounded-lg mb-4 flex items-center justify-center text-white text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Feature Two</h3>
              <p className="text-text-secondary">Hover effects with brand colors</p>
            </div>
            
            <div className="card">
              <div className="w-12 h-12 bg-brand-gradient rounded-lg mb-4 flex items-center justify-center text-white text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Feature Three</h3>
              <p className="text-text-secondary">Smooth transitions and animations</p>
            </div>
          </div>
        </section>

        {/* Glassmorphism */}
        <section className="mb-16 gradient-hero rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-8">Glassmorphism Effects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-text-primary mb-3">Light Glass</h3>
              <p className="text-text-secondary">Frosted glass effect for light sections</p>
            </div>
            
            <div className="glass-dark p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-white mb-3">Dark Glass</h3>
              <p className="text-text-light-muted">Frosted glass for dark backgrounds</p>
            </div>
          </div>
        </section>

        {/* Button Showcase */}
        <section className="card">
          <h2 className="text-3xl font-bold text-text-primary mb-8">Button Variants</h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn-cta">CTA Button</button>
            <button className="btn-primary">Primary Button</button>
            <button className="btn-secondary">Secondary Button</button>
            <button className="btn-outline">Outline Button</button>
            <button className="btn-cta pulse-brand">Pulsing CTA</button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ColorPaletteDemo;
