
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowRight, 
  FileText, 
  Video, 
  Mic, 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  Search,
  Plus
} from "lucide-react";

const Dashboard: React.FC = () => {
  const { contents } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredContents = contents.filter(content => {
    // Filter by search query
    const matchesSearch = searchQuery.trim() === "" || 
      content.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "text") return content.type === "text" && matchesSearch;
    if (activeTab === "video") return content.type === "video" && matchesSearch;
    if (activeTab === "audio") return content.type === "audio" && matchesSearch;
    if (activeTab === "safe") return content.status === "safe" && matchesSearch;
    if (activeTab === "suspicious") return content.status === "suspicious" && matchesSearch;
    if (activeTab === "harmful") return content.status === "harmful" && matchesSearch;
    
    return matchesSearch;
  });
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "analyzing":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "safe":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "suspicious":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "harmful":
        return <ShieldAlert className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };
  
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "text":
        return <FileText className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "audio":
        return <Mic className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "analyzing":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Analyzing</Badge>;
      case "safe":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Safe</Badge>;
      case "suspicious":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Suspicious</Badge>;
      case "harmful":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Harmful</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="flex flex-col space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your Content Dashboard</h1>
            <p className="text-muted-foreground">
              Track and manage all your submitted content
            </p>
          </div>
          <Link to="/submit">
            <Button className="animate-fade-in">
              <Plus className="mr-2 h-4 w-4" />
              Submit New Content
            </Button>
          </Link>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search content..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="text" className="hidden md:flex">Text</TabsTrigger>
                <TabsTrigger value="video" className="hidden md:flex">Video</TabsTrigger>
                <TabsTrigger value="audio" className="hidden md:flex">Audio</TabsTrigger>
                <TabsTrigger value="safe">Safe</TabsTrigger>
                <TabsTrigger value="suspicious">Suspicious</TabsTrigger>
                <TabsTrigger value="harmful">Harmful</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                {filteredContents.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No content found</p>
                    <Link to="/submit" className="mt-4 inline-block">
                      <Button variant="outline">Submit New Content</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredContents.map((content) => (
                      <Link to={`/status/${content.id}`} key={content.id}>
                        <div className="border rounded-lg p-4 hover:bg-secondary/50 transition-colors flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <div className="bg-secondary p-2 rounded-full">
                              {getContentTypeIcon(content.type)}
                            </div>
                            <div>
                              <div className="font-medium truncate max-w-[200px] md:max-w-md">
                                {content.content.length > 50 
                                  ? content.content.substring(0, 50) + "..." 
                                  : content.content}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(content.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="hidden md:block">
                              {getStatusBadge(content.status)}
                            </div>
                            <div className="flex md:hidden">
                              {getStatusIcon(content.status)}
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="text" className="mt-0">
                {/* Content filtered by text type */}
                {/* Same rendering pattern as "all" tab */}
              </TabsContent>
              
              <TabsContent value="video" className="mt-0">
                {/* Content filtered by video type */}
                {/* Same rendering pattern as "all" tab */}
              </TabsContent>
              
              <TabsContent value="audio" className="mt-0">
                {/* Content filtered by audio type */}
                {/* Same rendering pattern as "all" tab */}
              </TabsContent>
              
              <TabsContent value="safe" className="mt-0">
                {/* Content filtered by safe status */}
                {/* Same rendering pattern as "all" tab */}
              </TabsContent>
              
              <TabsContent value="suspicious" className="mt-0">
                {/* Content filtered by suspicious status */}
                {/* Same rendering pattern as "all" tab */}
              </TabsContent>
              
              <TabsContent value="harmful" className="mt-0">
                {/* Content filtered by harmful status */}
                {/* Same rendering pattern as "all" tab */}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Card className="animate-fade-in [animation-delay:200ms]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Safe Content</CardTitle>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <CardDescription>
                Content that has been approved
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {contents.filter(c => c.status === "safe").length}
              </p>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in [animation-delay:400ms]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Suspicious Content</CardTitle>
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <CardDescription>
                Content requiring moderation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {contents.filter(c => c.status === "suspicious").length}
              </p>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in [animation-delay:600ms]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Harmful Content</CardTitle>
                <ShieldAlert className="h-5 w-5 text-red-500" />
              </div>
              <CardDescription>
                Content that has been blocked
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {contents.filter(c => c.status === "harmful").length}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
