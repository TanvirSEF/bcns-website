import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, Download, Eye, Calendar, CheckCircle } from "lucide-react"

const certificatesData = [
  {
    id: 1,
    name: "BCNS Membership Certificate",
    type: "Membership",
    issueDate: "2024-01-15",
    validUntil: "2025-01-15",
    status: "Active",
    description: "Official membership certificate for Bangladesh Child Neurology Society"
  },
  {
    id: 2,
    name: "Annual Conference 2024 - Attendance",
    type: "Conference",
    issueDate: "2024-02-20",
    validUntil: "Lifetime",
    status: "Issued",
    description: "Certificate of attendance for BCNS Annual Conference 2024"
  },
  {
    id: 3,
    name: "CPD Points Certificate - 2024",
    type: "CPD",
    issueDate: "2024-03-01",
    validUntil: "2024-12-31",
    status: "Current",
    description: "Continuing Professional Development points certificate"
  },
  {
    id: 4,
    name: "Research Publication Certificate",
    type: "Research",
    issueDate: "2024-01-30",
    validUntil: "Lifetime",
    status: "Issued",
    description: "Certificate for published research in pediatric neurology"
  },
  {
    id: 5,
    name: "Workshop Completion - Pediatric Epilepsy",
    type: "Workshop",
    issueDate: "2024-02-15",
    validUntil: "Lifetime",
    status: "Completed",
    description: "Certificate of completion for Pediatric Epilepsy Workshop"
  }
]

export default function UserCertificatesPage() {
  return (
    <div className="space-y-8">
      <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight mb-4 text-gray-900">My Certificates</h1>
        <p className="text-gray-700">View and download your professional certificates and achievements.</p>
      </div>
      
      {/* Certificate Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Certificates</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">This Year</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Download className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Downloads</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificatesData.map((cert) => (
          <Card key={cert.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-emerald-600" />
                </div>
                <Badge 
                  variant={
                    cert.status === "Active" || cert.status === "Current" || cert.status === "Issued" || cert.status === "Completed"
                      ? "default" 
                      : "secondary"
                  }
                  className={
                    cert.status === "Active" || cert.status === "Current" || cert.status === "Issued" || cert.status === "Completed"
                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      : ""
                  }
                >
                  {cert.status}
                </Badge>
              </div>
              <CardTitle className="text-lg leading-tight">{cert.name}</CardTitle>
              <CardDescription className="text-sm">
                {cert.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{cert.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Issued:</span>
                  <span className="font-medium">{cert.issueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valid Until:</span>
                  <span className="font-medium">{cert.validUntil}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Request New Certificate */}
      <Card>
        <CardHeader>
          <CardTitle>Request New Certificate</CardTitle>
          <CardDescription>
            Need a replacement or additional certificate? Contact our support team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            Request Certificate
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
