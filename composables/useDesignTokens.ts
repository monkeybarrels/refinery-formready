/**
 * Design Tokens for VA Decision Analysis UI
 * Professional blue-based color palette with accessibility focus
 */

export interface DesignTokens {
  colors: {
    approved: ColorSet
    denied: ColorSet
    deferred: ColorSet
    primary: ColorSet
    secondary: ColorSet
    background: {
      main: string
      card: string
      subtle: string
    }
    text: {
      primary: string
      secondary: string
      muted: string
      inverse: string
    }
  }
  spacing: Record<string, string>
  radius: Record<string, string>
  shadows: Record<string, string>
  transitions: Record<string, string>
  typography: {
    heading: Record<string, string>
    body: Record<string, string>
  }
  sizes: {
    button: Record<string, string>
    badge: Record<string, string>
    card: Record<string, string>
  }
}

interface ColorSet {
  bg: string
  border: string
  text: string
  badge: string
  icon: string
  hover?: string
}

export const useDesignTokens = (): DesignTokens => {
  return {
    // Color Palette
    colors: {
      // Decision States
      approved: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        badge: 'bg-blue-100 text-blue-800',
        icon: 'text-blue-600'
      },
      denied: {
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        text: 'text-slate-800',
        badge: 'bg-slate-100 text-slate-800',
        icon: 'text-slate-600'
      },
      deferred: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-800',
        badge: 'bg-amber-100 text-amber-800',
        icon: 'text-amber-600'
      },
      
      // UI Colors
      primary: {
        bg: 'bg-indigo-600',
        hover: 'hover:bg-indigo-700',
        text: 'text-indigo-600',
        border: 'border-indigo-600'
      },
      secondary: {
        bg: 'bg-slate-600',
        hover: 'hover:bg-slate-700',
        text: 'text-slate-600',
        border: 'border-slate-600'
      },
      
      // Backgrounds
      background: {
        main: 'bg-slate-50',
        card: 'bg-white',
        subtle: 'bg-slate-100'
      },
      
      // Text Colors
      text: {
        primary: 'text-slate-900',
        secondary: 'text-slate-600',
        muted: 'text-slate-500',
        inverse: 'text-white'
      }
    },
    
    // Spacing Scale
    spacing: {
      xs: 'p-1',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
      '2xl': 'p-12'
    },
    
    // Border Radius
    radius: {
      sm: 'rounded',
      md: 'rounded-lg',
      lg: 'rounded-xl',
      xl: 'rounded-2xl',
      full: 'rounded-full'
    },
    
    // Shadows
    shadows: {
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl'
    },
    
    // Transitions
    transitions: {
      fast: 'transition-all duration-150',
      normal: 'transition-all duration-200',
      slow: 'transition-all duration-300'
    },
    
    // Typography
    typography: {
      heading: {
        h1: 'text-4xl font-bold text-slate-900',
        h2: 'text-3xl font-bold text-slate-900',
        h3: 'text-2xl font-semibold text-slate-900',
        h4: 'text-xl font-semibold text-slate-900',
        h5: 'text-lg font-medium text-slate-900',
        h6: 'text-base font-medium text-slate-900'
      },
      body: {
        large: 'text-lg text-slate-700',
        base: 'text-base text-slate-700',
        small: 'text-sm text-slate-600',
        xs: 'text-xs text-slate-500'
      }
    },
    
    // Component Sizes
    sizes: {
      button: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
      },
      badge: {
        sm: 'px-2 py-1 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base'
      },
      card: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
      }
    }
  }
}
