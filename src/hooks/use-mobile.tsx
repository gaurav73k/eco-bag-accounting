
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(window.innerWidth < MOBILE_BREAKPOINT)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    window.addEventListener('resize', checkMobile)
    checkMobile() // Check on initial mount
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}
