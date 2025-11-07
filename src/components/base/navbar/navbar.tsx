import { Button } from "@/components/base/button";
import { LogoPacon } from "@/components/base/logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";

const Navbar = () => {
  return (
    <header className="w-full bg-muted border-b">
      <nav className="h-16 bg-background">
        <div className="h-full flex items-center justify-between max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <LogoPacon size="md" className="h-8  hidden md:block xl:h-9" />
          <LogoPacon size="sm" className="h-6 block md:hidden" />

          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />

          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:inline-flex">
              Sign In
            </Button>
            <Button>Get Started</Button>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
