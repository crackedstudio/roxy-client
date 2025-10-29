# Crypto Portfolio Manager - Theme Guide

This project uses Tailwind CSS v4 with the new `@theme` directive for defining design tokens. All theme variables are defined in `src/index.css` and automatically generate corresponding utility classes.

## 🎨 Color Palette

### Primary Colors

The primary color is `#16A349` (green) with a full scale from 50 to 950:

```css
/* Available utility classes */
bg-primary-50, bg-primary-100, bg-primary-200, bg-primary-300, bg-primary-400
bg-primary-500, bg-primary-600, bg-primary-700, bg-primary-800, bg-primary-900, bg-primary-950

text-primary-50, text-primary-100, text-primary-200, text-primary-300, text-primary-400
text-primary-500, text-primary-600, text-primary-700, text-primary-800, text-primary-900, text-primary-950

border-primary-50, border-primary-100, border-primary-200, border-primary-300, border-primary-400
border-primary-500, border-primary-600, border-primary-700, border-primary-800, border-primary-900, border-primary-950
```

### Background & Text

```css
/* Available utility classes */
bg-background    /* #0A0A0A */
text-text        /* #FFFFFF */
```

## 📏 Spacing Scale

Custom spacing scale for consistent layouts:

```css
/* Available utility classes */
p-xs, m-xs, gap-xs, space-x-xs, space-y-xs    /* 0.25rem */
p-sm, m-sm, gap-sm, space-x-sm, space-y-sm    /* 0.5rem */
p-md, m-md, gap-md, space-x-md, space-y-md    /* 1rem */
p-lg, m-lg, gap-lg, space-x-lg, space-y-lg    /* 1.5rem */
p-xl, m-xl, gap-xl, space-x-xl, space-y-xl    /* 2rem */
p-2xl, m-2xl, gap-2xl, space-x-2xl, space-y-2xl /* 3rem */
p-3xl, m-3xl, gap-3xl, space-x-3xl, space-y-3xl /* 4rem */
```

## 🔲 Border Radius

Custom border radius scale:

```css
/* Available utility classes */
rounded-sm    /* 0.25rem */
rounded-md    /* 0.5rem */
rounded-lg    /* 0.75rem */
rounded-xl    /* 1rem */
rounded-2xl   /* 1.5rem */
rounded-full  /* 9999px */
```

## 🌟 Shadows

Custom shadow system including primary glow effects:

```css
/* Standard shadows */
shadow-sm, shadow-md, shadow-lg, shadow-xl, shadow-2xl

/* Primary glow effects */
glow-primary     /* 0 0 20px rgb(22 163 73 / 0.3) */
glow-primary-lg  /* 0 0 40px rgb(22 163 73 / 0.4) */
```

## 🎬 Animations

Custom animations defined in the theme:

```css
/* Available animation classes */
animate-scroll        /* Horizontal scrolling animation */
animate-fade-in       /* Fade in animation */
animate-slide-up      /* Slide up with fade */
animate-scale-in      /* Scale in animation */
animate-bounce-gentle /* Gentle bounce animation */
```

## 🎨 Custom Utility Classes

### Glass Morphism

```css
.glass      /* Light glass effect */
/* Light glass effect */
.glass-dark; /* Dark glass effect */
```

### Text Effects

```css
.text-gradient-primary/* Gradient text using primary colors */;
```

## 📱 Usage Examples

### Card Component

```html
<div
    class="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 glow-primary"
>
    <h3 class="text-gradient-primary text-xl font-bold">Card Title</h3>
    <p class="text-text/80">Card content goes here</p>
</div>
```

### Button Component

```html
<button
    class="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors glow-primary"
>
    Click me
</button>
```

### Animated Element

```html
<div class="animate-fade-in animate-bounce-gentle">
    <p>This element fades in and bounces gently</p>
</div>
```

### Glass Panel

```html
<div class="glass rounded-xl p-6">
    <h2 class="text-text font-semibold">Glass Panel</h2>
    <p class="text-text/70">Content with glass morphism effect</p>
</div>
```

## 🔧 CSS Variables Access

All theme variables are available as CSS variables:

```css
.custom-element {
    background-color: var(--color-primary-500);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-primary);
    animation: var(--animate-fade-in);
}
```

## 🎯 Arbitrary Values

Use theme variables in arbitrary values:

```html
<div class="rounded-[calc(var(--radius-xl)-1px)]">
    <!-- Nested element with slightly smaller radius -->
</div>

<div class="bg-[var(--color-primary-500)]">
    <!-- Direct color reference -->
</div>
```

## 📦 JavaScript Access

Access theme variables in JavaScript:

```javascript
// Get computed style
const styles = getComputedStyle(document.documentElement);
const primaryColor = styles.getPropertyValue("--color-primary-500");
const shadowValue = styles.getPropertyValue("--shadow-primary");

// Use with libraries like Framer Motion
<motion.div
    animate={{
        backgroundColor: "var(--color-primary-500)",
        boxShadow: "var(--shadow-primary)",
    }}
/>;
```

## 🚀 Benefits of This Approach

1. **Type Safety**: All utilities are generated from theme variables
2. **Consistency**: Single source of truth for design tokens
3. **Maintainability**: Easy to update colors, spacing, etc. globally
4. **Performance**: Only used utilities are included in the final CSS
5. **Flexibility**: Easy to extend with new theme variables
6. **Developer Experience**: IntelliSense support for all generated utilities

## 🔄 Adding New Theme Variables

To add new theme variables, simply add them to the `@theme` block in `src/index.css`:

```css
@theme {
    --color-accent: #ff6b6b;
    --spacing-custom: 2.5rem;
    --radius-custom: 0.875rem;
    --animate-custom: customAnimation 1s ease-in-out;
}
```

This will automatically generate utilities like:

-   `bg-accent`, `text-accent`, `border-accent`
-   `p-custom`, `m-custom`, `gap-custom`
-   `rounded-custom`
-   `animate-custom`
