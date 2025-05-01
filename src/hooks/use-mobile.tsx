
import * as React from "react"

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
    
    // Use the appropriate event listener based on browser support
    if (mql.addEventListener) {
      mql.addEventListener("change", checkMobile)
    } else {
      // Fallback for older browsers
      window.addEventListener("resize", checkMobile)
    }
    
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", checkMobile)
      } else {
        window.removeEventListener("resize", checkMobile) 
      }
    }
  }, [])

  // Use double exclamation to ensure boolean return type
  return isMobile === undefined ? false : isMobile
}
