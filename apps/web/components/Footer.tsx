 import Link from 'next/link';
import { Home, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-primary">Rent</span>
                <span className="text-background">Ghr</span>
              </span>
            </Link>
            <p className="text-background/70 text-sm mb-4">
              Pakistan's premier property portal connecting buyers, sellers, and renters since 2007.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/properties" className="text-background/70 hover:text-primary transition-colors">Properties for Rent</Link></li>
              <li><Link href="/properties" className="text-background/70 hover:text-primary transition-colors">Properties for Sale</Link></li>
              <li><Link href="/hotels" className="text-background/70 hover:text-primary transition-colors">Hotels</Link></li>
              <li><Link href="/about" className="text-background/70 hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Cities</h3>
            <ul className="space-y-2">
              <li><Link href="/properties?city=Multan" className="text-background/70 hover:text-primary transition-colors">Multan</Link></li>
              <li><Link href="/properties?city=Lahore" className="text-background/70 hover:text-primary transition-colors">Lahore</Link></li>
              <li><Link href="/properties?city=Karachi" className="text-background/70 hover:text-primary transition-colors">Karachi</Link></li>
              <li><Link href="/properties?city=Islamabad" className="text-background/70 hover:text-primary transition-colors">Islamabad</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-background/70">Multan, Pakistan</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-background/70">+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-background/70">info@rentghr.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-6 text-center">
          <p className="text-background/60 text-sm">
            © 2025 RentGhr. All rights reserved. Since 2007
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;