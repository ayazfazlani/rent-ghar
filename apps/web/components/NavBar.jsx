'use client'
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Menu, X, Plus, User, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SignedIn, SignedOut, SignUpButton, SignInButton, UserButton } from '@clerk/nextjs';
 
const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Properties', path: '/properties' },
  { name: 'Hotels', path: '/hotels' },
  { name: 'About', path: '/about' },
];

const Navbar = () => {
  const pathname = usePathname();
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-primary">Rent</span>
                <span className="text-foreground">Ghr</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`nav-link ${pathname === link.path ? 'active' : ''}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setShowAddProperty(true)}
              >
                <Plus className="w-4 h-4" />
                Add Property
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary"
              >
                <Heart className="w-5 h-5" />
              </Button>
              
              {/* Clerk Authentication */}
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button variant="default" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </SignUpButton>
              </SignedOut>
              
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-6 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      href={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`text-lg font-medium transition-colors ${
                        pathname === link.path
                          ? 'text-primary'
                          : 'text-foreground hover:text-primary'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <hr className="border-border" />
                  <Button
                    className="w-full gap-2"
                    onClick={() => {
                      setMobileOpen(false);
                      setShowAddProperty(true);
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Property
                  </Button>
                  
                  {/* Mobile Clerk Authentication */}
                  <SignedOut>
                    <SignUpButton mode="modal">
                      <Button variant="outline" className="w-full">
                        Sign Up
                      </Button>
                    </SignUpButton>
                    <SignInButton mode="modal">
                      <Button variant="default" className="w-full">
                        Sign In
                      </Button>
                    </SignInButton>
                  </SignedOut>
                  
                  <SignedIn>
                    <div className="flex items-center justify-center pt-4">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </SignedIn>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;