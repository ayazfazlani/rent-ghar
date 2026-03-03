'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Plus, User, Heart, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import SearchBar from '@/components/SearchBar';
import { useAuth } from '@/context/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Properties', path: '/properties' },
  // { name: 'Hotels', path: '/hotels' },
  { name: 'About', path: '/about' },
  { name: 'Blog', path: '/blog' },
];

const Navbar = () => {
  const pathname = usePathname() || '';
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // Fix hydration error by only rendering auth components on client
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Glassmorphism Navbar with gradient border */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/5">
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between  h-16 md:h-20">
            {/* Logo with Text */}
            <Link href="/" className="flex items-center group">
              {/* Logo Image */}
              <Image
                src="/logo.png"
                alt="RentGhar Logo"
                width={100}
                height={100}
                className="transition-all pl-0 duration-500 group-hover:scale-110"
              />

              {/* Brand Text */}
              <span className="text-xl pr-4 font-bold tracking-tight text-foreground transition-all duration-300 group-hover:text-primary">
                Property Dealer
              </span>
            </Link>

            {/* Desktop Navigation - Premium style */}
            <div className="hidden md:flex items-center gap-4 flex-1 justify-center max-w-3xl">
              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <SearchBar />
              </div>

              {/* Navigation Links */}
              <div className="flex items-center gap-1 bg-secondary/50 rounded-full px-2 py-2 backdrop-blur-sm shrink-0">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className="relative group px-5 py-2 rounded-full transition-all duration-300"
                  >
                    {/* Active/Hover background */}
                    <div className={`absolute inset-0 rounded-full transition-all duration-300 ${pathname === link.path
                      ? 'bg-primary shadow-lg shadow-primary/25'
                      : 'bg-transparent group-hover:bg-primary/10'
                      }`}>
                      {/* Lightning effect */}
                      <div className="absolute inset-0 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      </div>
                    </div>

                    <span className={`relative z-10 text-sm font-medium transition-all duration-300 ${pathname === link.path
                      ? 'text-primary-foreground'
                      : 'text-foreground group-hover:text-primary'
                      }`}>
                      {link.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop Actions - Premium buttons */}
            <div className="hidden md:flex items-center gap-2">
              {/* Add Property Button - Gradient style */}


              {/* Heart Button - Floating style */}
              {/* <div className="relative">
                <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-muted-foreground hover:text-red-500 transition-all duration-300 hover:scale-110 group"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:to-red-500/5 transition-all duration-300" />
                  <Heart className="w-5 h-5 relative z-10 transition-all duration-300 group-hover:fill-red-500 group-hover:scale-110" />

                  <div className="absolute inset-0 rounded-full border-2 border-red-500/0 group-hover:border-red-500/30 scale-100 group-hover:scale-150 opacity-100 group-hover:opacity-0 transition-all duration-500" />
                </Button>
              </div> */}

              {/* Auth Buttons - Only render after mount to prevent hydration errors */}
              {mounted && (
                <>
                  {!isAuthenticated ? (
                    <>
                      {/* <Link href="/register">
                        <Button
                          variant="outline"
                          className="relative overflow-hidden border-primary/30 hover:border-primary transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                          <span className="relative z-10 font-medium">Sign Up</span>
                        </Button>
                      </Link> */}

                      <Link href="/login">
                        <Button
                          size="icon"
                          className="ml-2 relative overflow-hidden bg-gradient-to-br from-primary to-primary/90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-primary/40 group"
                        >
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
                          <User className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.role === 'ADMIN' ? '' : ''} alt={user?.name || 'User'} />
                            <AvatarFallback>{user?.name?.[0] || user?.email?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user?.name || user?.email}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {user?.email}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard" className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout} className="cursor-pointer">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </>
              )}
            </div>

            {/* Mobile Menu Button - Premium style */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative overflow-hidden transition-all duration-300 hover:scale-110 group"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-lg bg-primary/0 group-hover:bg-primary/10 transition-all duration-300" />

                  {/* Lightning effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                  <Menu className="w-6 h-6 relative z-10 transition-all duration-500 group-hover:rotate-180" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-80 bg-background/95 backdrop-blur-xl border-l border-border/50">
                <DialogTitle className="sr-only">Navigation Menu</DialogTitle>

                {/* Mobile menu content */}
                <div className="flex flex-col gap-6 mt-12">
                  {/* Search Bar for Mobile */}
                  <div className="px-2">
                    <SearchBar />
                  </div>

                  {/* Navigation links */}
                  <div className="space-y-2">
                    {navLinks.map((link, index) => (
                      <Link
                        key={link.path}
                        href={link.path}
                        onClick={() => setMobileOpen(false)}
                        className="block group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className={`relative px-4 py-3 rounded-xl transition-all duration-300 ${pathname === link.path
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                          : 'hover:bg-secondary/80 group-hover:translate-x-2'
                          }`}>
                          {/* Lightning effect */}
                          <div className="absolute inset-0 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100">
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                          </div>

                          <span className="relative z-10 text-base font-medium">
                            {link.name}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                  {/* Action buttons */}
                  <div className="space-y-3">
                    <Button
                      className="w-full gap-2 relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30 group"
                      onClick={() => {
                        setMobileOpen(false);
                        setShowAddProperty(true);
                      }}
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <Plus className="w-4 h-4 relative z-10 transition-transform duration-500 group-hover:rotate-180" />
                      <span className="relative z-10">Add Property</span>
                    </Button>

                    {/* Auth buttons - Only render after mount */}
                    {mounted && (
                      <>
                        {!isAuthenticated ? (
                          <>
                            <Link href="/register" onClick={() => setMobileOpen(false)}>
                              <Button
                                variant="outline"
                                className="w-full relative overflow-hidden border-primary/30 hover:border-primary transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group mb-2"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                <span className="relative z-10 font-medium">Sign Up</span>
                              </Button>
                            </Link>
                            <Link href="/login" onClick={() => setMobileOpen(false)}>
                              <Button
                                variant="default"
                                className="w-full relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30 group"
                              >
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                <span className="relative z-10 font-medium">Sign In</span>
                              </Button>
                            </Link>
                          </>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                              <Button variant="outline" className="w-full">
                                <User className="mr-2 h-4 w-4" />
                                Dashboard
                              </Button>
                            </Link>
                            <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={logout}>
                              <LogOut className="mr-2 h-4 w-4" />
                              Log out
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
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
