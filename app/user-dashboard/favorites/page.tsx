import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, BookOpen, Calendar, Users, ExternalLink, Trash2 } from "lucide-react"

const favoritesData = [
  {
    id: 1,
    title: "Advances in Pediatric Epilepsy Treatment",
    type: "Publication",
    category: "Research Paper",
    date: "2024-02-15",
    author: "Dr. Sarah Ahmed",
    description: "Latest research findings on treatment approaches for pediatric epilepsy patients.",
    url: "/activities/research"
  },
  {
    id: 2,
    title: "Annual Conference 2024",
    type: "Event",
    category: "Conference",
    date: "2024-03-15",
    author: "BCNS",
    description: "The biggest child neurology event of the year with international speakers.",
    url: "/activities/conference"
  },
  {
    id: 3,
    title: "Dr. Mohammad Rahman",
    type: "Member",
    category: "Professional",
    date: "2024-01-20",
    author: "Dhaka Medical College",
    description: "Senior Consultant in Pediatric Neurology with 15+ years experience.",
    url: "/members"
  },
  {
    id: 4,
    title: "Neurodevelopmental Disorders in Children",
    type: "Publication",
    category: "Journal Article",
    date: "2024-02-28",
    author: "Dr. Fatima Khan",
    description: "Comprehensive review of neurodevelopmental disorders and intervention strategies.",
    url: "/activities/research"
  },
  {
    id: 5,
    title: "Monthly Webinar Series",
    type: "Event",
    category: "Webinar",
    date: "2024-02-28",
    author: "BCNS",
    description: "Regular educational webinars on various topics in child neurology.",
    url: "/activities/conference"
  }
]

const getTypeIcon = (type: string) => {
  switch (type) {
    case "Publication":
      return <BookOpen className="h-5 w-5 text-blue-600" />
    case "Event":
      return <Calendar className="h-5 w-5 text-emerald-600" />
    case "Member":
      return <Users className="h-5 w-5 text-purple-600" />
    default:
      return <Heart className="h-5 w-5 text-red-600" />
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "Publication":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    case "Event":
      return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
    case "Member":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }
}

export default function UserFavoritesPage() {
  const handleRemoveFavorite = (_id: number) => {
    // TODO: Implement remove favorite functionality
  }

  return (
    <div className="space-y-8">
      <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight mb-4 text-gray-900">My Favorites</h1>
        <p className="text-gray-700">Keep track of your favorite publications, events, and members for quick access.</p>
      </div>
      
      {/* Favorites Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Favorites</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Publications</p>
                <p className="text-2xl font-bold text-gray-900">7</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Events</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Members</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Favorites List */}
      <div className="space-y-4">
        {favoritesData.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {item.title}
                      </h3>
                      <Badge className={getTypeColor(item.type)}>
                        {item.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{item.category}</span>
                      <span>•</span>
                      <span>{item.author}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button size="sm" variant="outline" asChild>
                    <a href={item.url}>
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </a>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleRemoveFavorite(item.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State (if no favorites) */}
      {favoritesData.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-4">
              Start adding publications, events, and members to your favorites for quick access.
            </p>
            <Button asChild>
              <a href="/activities/research">
                Browse Publications
              </a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
