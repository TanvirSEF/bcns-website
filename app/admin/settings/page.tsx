import { SectionCards } from "@/components/section-cards"
import { DataTable } from "@/components/data-table"

const settingsData = [
  {
    id: 1,
    header: "System Configuration",
    type: "Configuration",
    status: "Done",
    target: "100",
    limit: "100",
    reviewer: "Admin Team"
  },
  {
    id: 2,
    header: "Security Settings",
    type: "Security",
    status: "In Progress",
    target: "85",
    limit: "100",
    reviewer: "Security Team"
  },
  {
    id: 3,
    header: "Email Configuration",
    type: "Communication",
    status: "Done",
    target: "100",
    limit: "100",
    reviewer: "Technical Team"
  },
  {
    id: 4,
    header: "Backup & Recovery",
    type: "Maintenance",
    status: "Under Review",
    target: "90",
    limit: "100",
    reviewer: "Technical Team"
  }
]

export default function SettingsPage() {
  return (
    <>
      <SectionCards />
      <DataTable data={settingsData} />
    </>
  )
}