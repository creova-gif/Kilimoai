import { useState, useEffect } from "react";
import { NavigationMenu } from "./NavigationMenu";
import { DesktopNavigation } from "./DesktopNavigation";

interface ResponsiveNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole: "farmer" | "expert" | "admin";
  language: "en" | "sw";
  userName?: string;
}

export function ResponsiveNavigation(props: ResponsiveNavigationProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? (
    <NavigationMenu {...props} isMobile={true} />
  ) : (
    <DesktopNavigation {...props} />
  );
}
