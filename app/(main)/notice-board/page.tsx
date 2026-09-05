"use client";

import { Bell, Calendar, AlertCircle, ExternalLink } from "lucide-react";
import { useState } from "react";
import { NavbarClient } from "@/components/navbarclient";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function NoticeBoardPage() {
  // Notice board data
  const noticeData = [
    {
      id: "cme-paediatric-neurology-2026",
      title: "CME on Paediatric Neurology Advances: Genetic Epilepsy, Neuro-immunology & Epilepsy Surgery",
      type: "event",
      priority: "high",
      date: "2026-09-21",
      isNew: true,
      registrationUrl: "https://docs.google.com/forms/d/e/1FAIpQLSdVEQme-8NpsdmL0RPPPeEqXPth3KTZ8O1niuegdd5mgPkVgA/viewform",
      description: "We are pleased to announce the CME on \"Paediatric Neurology Advances: Genetic Epilepsy, Neuro-immunology & Epilepsy Surgery\" organized by Bangladesh Child Neurology Society (BCNS).\n\n📅 Date: 21 September 2026\n⏰ Time: 08.00 AM\n🏥 Venue: Room no. 507, Lecturer Hall, Super Specialized Hospital, BMU, Dhaka-1100\n\nOnline Registration Link: https://docs.google.com/forms/d/e/1FAIpQLSdVEQme-8NpsdmL0RPPPeEqXPth3KTZ8O1niuegdd5mgPkVgA/viewform"
    },
    {
      id: "epilepsy-seminar-2026",
      title: "Scientific Seminar on \"Management of Childhood Epilepsy: An Evidence Based Approach\"",
      type: "event",
      priority: "high",
      date: "2026-06-17",
      isNew: false,
      description: "We are pleased to announce a scientific seminar on \"Management of Childhood Epilepsy: An Evidence Based Approach\". This educational program will focus on the latest evaluation techniques, diagnostic guidelines, and updated management strategies for childhood epilepsy in pediatric patients. The program aims to enhance clinical knowledge and evidence-based practice. Date: 17th June 2026, Wednesday | Time: 10:00 AM | Venue: Seminar Room, Department of Paediatrics, Rangpur Medical College Hospital."
    },
    {
      id: "0",
      title: "Brain Malformation, Congenital Myopathy and Neuroinfection: Evaluation & Updated Management",
      type: "event",
      priority: "high",
      date: "2026-01-17",
      isNew: false,
      description: "We are pleased to announce a comprehensive program on Brain Malformation, Congenital Myopathy and Neuroinfection: Evaluation & Updated Management. This educational program will focus on the latest evaluation techniques and updated management strategies for brain malformations, congenital myopathies, and neuroinfections in pediatric patients. The program aims to enhance the knowledge and clinical skills of child neurologists, pediatricians, and allied healthcare professionals in diagnosing and managing these complex neurological conditions. Date: 17 January 2026 | Time: 9:00 AM to 2:00 PM | Venue: Conference Hall, National Institute of Neuro Sciences & Hospital (NINS&H), Dhaka-1207. Registration link: https://shorturl.at/8sk4s"
    },
    {
      id: "1",
      title: "BCNS Annual Conference 2025 Registration Open",
      type: "announcement",
      priority: "high",
      date: "2024-12-15",
      isNew: false,
      description: "We are pleased to announce that registration for the BCNS Annual Conference 2025 is now open. This year's conference will feature keynote speakers, research presentations, and networking opportunities. Early bird registration discounts are available until January 15, 2025. All members are encouraged to register early to secure their spot."
    },
    {
      id: "2",
      title: "CME Program: Pediatric Movement Disorders",
      type: "event",
      priority: "medium",
      date: "2024-12-10",
      description: "Join us for an exclusive CME program focusing on Pediatric Movement Disorders. This comprehensive program will cover diagnosis, treatment approaches, and recent advances in the field. The program is scheduled for June 2025 and will include hands-on workshops, case discussions, and expert presentations. Registration details will be shared soon."
    },
    {
      id: "3",
      title: "Member Directory Update Required",
      type: "urgent",
      priority: "high",
      date: "2024-12-08",
      description: "All members are urgently requested to update their information in the member directory. Please verify your contact details, professional affiliations, and areas of specialization. This update is essential for maintaining accurate records and facilitating better communication within the BCNS community. Please complete the update by December 31, 2024."
    },
    {
      id: "4",
      title: "Research Grant Applications Open",
      type: "announcement",
      priority: "medium",
      date: "2024-12-05",
      description: "BCNS is now accepting applications for research grants in pediatric neurology. Grants are available for both clinical and basic science research projects. The application deadline is February 28, 2025. For eligibility criteria and application guidelines, please contact the research committee. We encourage all eligible members to apply."
    },
    {
      id: "5",
      title: "New Publication: Pediatric Neurology Guidelines",
      type: "update",
      priority: "low",
      date: "2024-12-01",
      description: "We are excited to announce the publication of the latest Pediatric Neurology Guidelines. This comprehensive document includes updated protocols for diagnosis and treatment of various pediatric neurological conditions. The guidelines are now available in the publications section of our website. All members are encouraged to review and implement these updated protocols in their practice."
    },
    {
      id: "6",
      title: "Workshop: SMA Rehabilitation Approach",
      type: "workshop",
      priority: "medium",
      date: "2024-11-28",
      description: "A specialized workshop on Spinal Muscular Atrophy (SMA) Rehabilitation Approach will be conducted in August 2025. This workshop will provide in-depth training on rehabilitation strategies, multidisciplinary care approaches, and recent therapeutic advances. The workshop is designed for healthcare professionals working with SMA patients. Limited seats available."
    },
    {
      id: "7",
      title: "Website Maintenance Scheduled",
      type: "update",
      priority: "low",
      date: "2024-12-20",
      description: "Scheduled website maintenance will be performed on December 25, 2024, from 2:00 AM to 6:00 AM (BST). During this time, the website may be temporarily unavailable. We apologize for any inconvenience this may cause. All services will resume normally after the maintenance window."
    }
  ];

  const [selectedNotice, setSelectedNotice] = useState<typeof noticeData[0] | null>(null);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "urgent":
        return { label: "Urgent", className: "bg-red-100 text-red-700 border-red-200" };
      case "announcement":
        return { label: "Announcement", className: "bg-blue-100 text-blue-700 border-blue-200" };
      case "event":
        return { label: "Event", className: "bg-purple-100 text-purple-700 border-purple-200" };
      case "workshop":
        return { label: "Workshop", className: "bg-orange-100 text-orange-700 border-orange-200" };
      default:
        return { label: "Update", className: "bg-gray-100 text-gray-700 border-gray-200" };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavbarClient />
      <main className="flex-1">
        {/* Header */}
        <section className="w-full bg-blue-600 text-white py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Bell className="h-6 w-6" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  Notice Board
                </h1>
              </div>
              <p className="text-blue-100 text-base">
                Latest announcements and updates from BCNS
              </p>
            </div>
          </div>
        </section>

        {/* Notices List */}
        <section className="w-full py-8 md:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-3">
              {noticeData.map((notice) => {
                const typeBadge = getTypeBadge(notice.type);
                
                return (
                  <Card
                    key={notice.id}
                    className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group cursor-pointer"
                    onClick={() => setSelectedNotice(notice)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {notice.priority === "high" && (
                          <div className="shrink-0 mt-0.5">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            {notice.isNew && (
                              <Badge className="bg-green-500 text-white text-xs px-1.5 py-0">
                                New
                              </Badge>
                            )}
                            <Badge
                              variant="outline"
                              className={`text-xs px-1.5 py-0 ${typeBadge.className}`}
                            >
                              {typeBadge.label}
                            </Badge>
                          </div>
                          
                          <h3 className="text-base font-semibold text-gray-900 mb-1.5 group-hover:text-blue-600 transition-colors leading-snug">
                            {notice.title}
                          </h3>
                          
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {notice.description}
                          </p>
                          
                          <div className="flex items-center justify-between gap-2 flex-wrap text-xs text-gray-600 mt-2">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-blue-600" />
                              <span>
                                {new Date(notice.date).toLocaleDateString('en-US', { 
                                  year: 'numeric',
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </div>
                            {notice.registrationUrl && (
                              <a
                                href={notice.registrationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline px-2 py-0.5 rounded-sm bg-blue-50"
                              >
                                <span>Enroll Now</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Notice Details Dialog */}
      <Dialog open={!!selectedNotice} onOpenChange={(open) => !open && setSelectedNotice(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedNotice && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  {selectedNotice.isNew && (
                    <Badge className="bg-green-500 text-white text-xs">
                      New
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={`text-xs ${getTypeBadge(selectedNotice.type).className}`}
                  >
                    {getTypeBadge(selectedNotice.type).label}
                  </Badge>
                  {selectedNotice.priority === "high" && (
                    <Badge className="bg-red-500 text-white text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      High Priority
                    </Badge>
                  )}
                </div>
                <DialogTitle className="text-xl font-bold text-left">
                  {selectedNotice.title}
                </DialogTitle>
                <DialogDescription className="text-left" asChild>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(selectedNotice.date).toLocaleDateString('en-US', { 
                        year: 'numeric',
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4 space-y-4">
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {selectedNotice.description}
                  </p>
                </div>
                {selectedNotice.registrationUrl && (
                  <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
                    <a
                      href={selectedNotice.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm cursor-pointer"
                    >
                      <span>Enroll Now</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

