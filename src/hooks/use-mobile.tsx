
import * as React from "react"

// Define mobile breakpoint using the design system approach
const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Initial check based on window width
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Check immediately
    checkMobile()
    
    // Set up media query listener for responsive changes
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Modern event listener pattern
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches)
    }
    
    // Call with the media query list initially
    handleChange(mql)
    
    // Use the appropriate event listener based on browser support
    if (mql.addEventListener) {
      mql.addEventListener("change", handleChange)
    } else {
      // Fallback for older browsers
      window.addEventListener("resize", checkMobile)
    }
    
    // Cleanup
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", handleChange)
      } else {
        window.removeEventListener("resize", checkMobile) 
      }
    }
  }, [])

  // Return false during SSR/initial render, then the actual value once mounted
  return isMobile === undefined ? false : isMobile
}
