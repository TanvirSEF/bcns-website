import { UserSectionCards } from "@/components/dashboard/UserSectionCards"
import { DataTable } from "@/components/data-table"

const activitiesData = [
  {
    id: 1,
    header: "Child Neurology Conference 2024",
    type: "Conference",
    status: "Registered",
    target: "March 15-17",
    limit: "Dhaka",
    reviewer: "BCNS"
  },
  {
    id: 2,
    header: "Monthly Webinar Series",
    type: "Webinar",
    status: "Attended",
    target: "February 28",
    limit: "Online",
    reviewer: "BCNS"
  },
  {
    id: 3,
    header: "Research Paper Review",
    type: "Publication",
    status: "In Progress",
    target: "March 10",
    limit: "Peer Review",
    reviewer: "Editorial Board"
  },
  {
    id: 4,
    header: "Pediatric Epilepsy Workshop",
    type: "Workshop",
    status: "Completed",
    target: "February 15",
    limit: "Chittagong",
    reviewer: "BCNS"
  }
]

export default function UserActivitiesPage() {
  return (
    <div className="space-y-8">
      <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight mb-4 text-gray-900">My Activities</h1>
        <p className="text-gray-700">Track your participation in BCNS events, conferences, and professional development activities.</p>
      </div>
      
      <UserSectionCards />
      
      <div className="bg-white rounded-lg border shadow-sm">
        <DataTable data={activitiesData} />
      </div>
    </div>
  )
}
