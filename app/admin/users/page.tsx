import { SectionCards } from "@/components/section-cards"
import { DataTable } from "@/components/data-table"

const userData = [
  {
    id: 1,
    header: "User Registration System",
    type: "Authentication",
    status: "Done",
    target: "1247",
    limit: "1500",
    reviewer: "Admin Team"
  },
  {
    id: 2,
    header: "User Profile Management",
    type: "System",
    status: "In Progress",
    target: "890",
    limit: "1000",
    reviewer: "Development Team"
  },
  {
    id: 3,
    header: "Role-Based Access Control",
    type: "Security",
    status: "Done",
    target: "100",
    limit: "100",
    reviewer: "Security Team"
  },
  {
    id: 4,
    header: "User Activity Monitoring",
    type: "Analytics",
    status: "Under Review",
    target: "75",
    limit: "100",
    reviewer: "Analytics Team"
  }
]

export default function UsersPage() {
  return (
    <>
      <SectionCards />
      <DataTable data={userData} />
    </>
  )
}