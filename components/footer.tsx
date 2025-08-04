import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
  Building2,
  Users,
  Calendar,
  FileText,
  Award,
} from "lucide-react";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const companyLinks = [
    { name: "About Us", href: "/about", icon: Building2 },
    { name: "Our Mission", href: "/about/mission", icon: Award },
    { name: "Leadership", href: "/about/leadership", icon: Users },
    { name: "Privacy Policy", href: "/privacy", icon: FileText },
  ];

  const helpLinks = [
    { name: "FAQs", href: "/faqs", icon: FileText },
    { name: "Contact Us", href: "/contact", icon: Phone },
    { name: "Membership", href: "/membership", icon: Users },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Resources", href: "/resources", icon: FileText },
  ];

  const activitiesLinks = [
    { name: "Research", href: "/research", icon: FileText },
    { name: "Publications", href: "/publications", icon: FileText },
    { name: "Conference", href: "/conference", icon: Calendar },
    { name: "Gallery", href: "/gallery", icon: Award },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com/bcns",
      icon: Facebook,
      color: "hover:bg-blue-600",
    },
    {
      name: "Twitter",
      href: "https://twitter.com/bcns",
      icon: Twitter,
      color: "hover:bg-blue-400",
    },
    {
      name: "Instagram",
      href: "https://instagram.com/bcns",
      icon: Instagram,
      color: "hover:bg-pink-600",
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/bcns",
      icon: Linkedin,
      color: "hover:bg-blue-700",
    },
  ];

  return (
    <footer className="bg-gray-900 text-white overflow-hidden">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Company */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Image
                src="/images/logo.png"
                alt="BCNS Logo"
                width={100}
                height={100}
              />
            </div>

            <div className="space-y-2 sm:space-y-3">
              {companyLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center space-x-2 sm:space-x-3 text-gray-300 hover:text-white transition-colors duration-200 group"
                >
                  <link.icon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium truncate">{link.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Get Help */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-white border-b border-pink-500 pb-2">
              Get Help
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {helpLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center space-x-2 sm:space-x-3 text-gray-300 hover:text-white transition-colors duration-200 group"
                >
                  <link.icon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 group-hover:text-pink-400 transition-colors flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium truncate">{link.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-white border-b border-pink-500 pb-2">
              Activities
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {activitiesLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center space-x-2 sm:space-x-3 text-gray-300 hover:text-white transition-colors duration-200 group"
                >
                  <link.icon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 group-hover:text-pink-400 transition-colors flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium truncate">{link.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Follow Us */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-white border-b border-pink-500 pb-2">
              Follow Us
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex space-x-3 sm:space-x-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200 group flex-shrink-0"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                ))}
              </div>

              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center space-x-2 sm:space-x-3 text-gray-300">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm truncate">+880 1711261736</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 text-gray-300">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm truncate">office@bcns.org.bd</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 text-gray-300">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm truncate">
                    Dhaka Medical College Hospital
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
              © {currentYear} Bangladesh Child Neurology Society (BCNS). All
              rights reserved.
            </div>
            <div className="flex items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6 text-xs sm:text-sm flex-wrap justify-center sm:justify-end">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                href="/sitemap"
                className="text-gray-400 hover:text-white transition-colors duration-200"
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
