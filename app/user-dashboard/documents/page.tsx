import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye, Calendar, User } from "lucide-react"

const documentsData = [
  {
    id: 1,
    name: "Membership Certificate",
    type: "Certificate",
    date: "2024-01-15",
    size: "2.3 MB",
    status: "Active"
  },
  {
    id: 2,
    name: "Conference Attendance Certificate",
    type: "Certificate",
    date: "2024-02-20",
    size: "1.8 MB",
    status: "Completed"
  },
  {
    id: 3,
    name: "Research Paper Submission",
    type: "Document",
    date: "2024-03-01",
    size: "4.5 MB",
    status: "Under Review"
  },
  {
    id: 4,
    name: "Payment Receipt - Annual Fee",
    type: "Receipt",
    date: "2024-01-10",
    size: "0.8 MB",
    status: "Paid"
  },
  {
    id: 5,
    name: "CPD Points Summary",
    type: "Report",
    date: "2024-02-28",
    size: "1.2 MB",
    status: "Current"
  }
]

export default function UserDocumentsPage() {
  return (
    <div className="space-y-8">
      <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight mb-4 text-gray-900">My Documents</h1>
        <p className="text-gray-700">Access and manage your certificates, receipts, and important documents.</p>
      </div>
      
      {/* Document Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Download className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Downloads</p>
                <p className="text-2xl font-bold text-gray-900">28</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Certificates</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
          <CardDescription>
            Your latest documents and certificates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documentsData.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{doc.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>{doc.date}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant={
                      doc.status === "Active" || doc.status === "Completed" || doc.status === "Paid" || doc.status === "Current" 
                        ? "default" 
                        : "secondary"
                    }
                    className={
                      doc.status === "Active" || doc.status === "Completed" || doc.status === "Paid" || doc.status === "Current"
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        : ""
                    }
                  >
                    {doc.status}
                  </Badge>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
