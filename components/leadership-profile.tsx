"use client";

import Image from "next/image";
import { X, Phone, Mail, MapPin, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeadershipProfileProps {
  isOpen: boolean;
  onClose: () => void;
  leader: {
    id: string;
    name: string;
    position: string;
    designation: string;
    institute: string;
    mobile: string;
    email: string;
    image: string;
    message: string;
  } | null;
}

export function LeadershipProfile({ isOpen, onClose, leader }: LeadershipProfileProps) {
  if (!isOpen || !leader) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-bold mb-2">{leader.name}</h2>
          <p className="text-blue-100">{leader.position}</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Image and Basic Info */}
            <div className="space-y-6">
              {/* Profile Image */}
              <div className="text-center">
                <div className="relative w-48 h-60 mx-auto mb-4">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    width={192}
                    height={240}
                    className="w-48 h-60 object-cover rounded-lg border-2 border-gray-200 shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{leader.name}</h3>
                <p className="text-blue-600 font-semibold">{leader.position}</p>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-gray-800 mb-3">Contact Information</h4>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <a href={`tel:${leader.mobile}`} className="text-sm text-blue-600 hover:underline">
                    {leader.mobile}
                  </a>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <a href={`mailto:${leader.email}`} className="text-sm text-blue-600 hover:underline break-all">
                    {leader.email}
                  </a>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">{leader.institute}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">{leader.designation}</span>
                </div>
              </div>
            </div>

            {/* Right Side - Message */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4">
                  Message from the BCNS {leader.position}
                </h4>
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                  <p className="whitespace-pre-line">{leader.message}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
