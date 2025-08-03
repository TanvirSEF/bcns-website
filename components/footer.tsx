import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Facebook,
  Youtube,
  ExternalLink,
  Linkedin,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const usefulLinks = [
    { name: "What's New", href: "/news" },
    { name: "Events", href: "/events" },
    { name: "How to become a Member", href: "/membership" },
    { name: "Sign Up", href: "/signup" },
    { name: "Resources", href: "/resources" },
    { name: "FAQs", href: "/faqs" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com/bcns",
      icon: Facebook,
      color: "hover:text-blue-600",
    },
    {
      name: "YouTube",
      href: "https://youtube.com/bcns",
      icon: Youtube,
      color: "hover:text-red-600",
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/bcns",
      icon: Linkedin,
      color: "hover:text-blue-700",
    },
    {
      name: "Twitter",
      href: "https://twitter.com/bcns",
      icon: Twitter,
      color: "hover:text-blue-400",
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-blue-50 to-blue-100 border-t border-blue-200">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Contact Us */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                BCNS
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">BCNS</h3>
                <p className="text-sm text-gray-600 font-medium">
                  Bangladesh Child Neurology Society
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700 leading-relaxed">
                  Dhaka Medical College Hospital,
                  <br />
                  Dhaka, Bangladesh
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-700">+880 1711261736</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-700">
                  office@bcns.org.bd
                </span>
              </div>
            </div>
          </div>

          {/* Follow Us */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-blue-200 pb-2">
              FOLLOW US
            </h3>
            <div className="space-y-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="flex items-center space-x-3 text-gray-700 transition-colors duration-200 group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div
                    className={`p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors ${social.color}`}
                  >
                    <social.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                    {social.name}
                  </span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
              <div className="flex items-center space-x-3 pt-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm text-gray-700">www.bcns.org.bd</span>
              </div>
            </div>
          </div>

          {/* Useful Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-blue-200 pb-2">
              USEFUL LINKS
            </h3>
            <div className="space-y-3">
              {usefulLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Location Map */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-blue-200 pb-2">
              LOCATION MAP
            </h3>
            <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 font-medium">
                    Interactive Map
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-blue-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600">
              © {currentYear} Bangladesh Child Neurology Society (BCNS). All
              rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                href="/sitemap"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
