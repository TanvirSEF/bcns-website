import { SectionCards } from "@/components/section-cards"
import { DataTable } from "@/components/data-table"

const contentData = [
  {
    id: 1,
    header: "Content Management System",
    type: "CMS",
    status: "Done",
    target: "45",
    limit: "50",
    reviewer: "Content Team"
  },
  {
    id: 2,
    header: "Research Paper Repository",
    type: "Database",
    status: "In Progress",
    target: "120",
    limit: "150",
    reviewer: "Content Team"
  },
  {
    id: 3,
    header: "Article Publishing Workflow",
    type: "Workflow",
    status: "Under Review",
    target: "25",
    limit: "30",
    reviewer: "Editorial Team"
  },
  {
    id: 4,
    header: "Media Asset Management",
    type: "Storage",
    status: "Done",
    target: "500",
    limit: "1000",
    reviewer: "Technical Team"
  }
]

export default function ContentPage() {
  return (
    <>
      <SectionCards />
      <DataTable data={contentData} />
    </>
  )
}