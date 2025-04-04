
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  FileText, 
  Video, 
  Mic, 
  Search,
  Calendar,
  Eye,
  Clock
} from "lucide-react";

const ModeratorDashboard: React.FC = () => {
  const { contents, moderateContent, moderationLogs } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [moderationNotes, setModerationNotes] = useState("");
  
  // Only show content that needs moderation (suspicious status)
  const contentToModerate = contents.filter(content => 
    content.status === "suspicious" &&
    (searchQuery === "" || content.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const reviewedContent = contents.filter(content => 
    (content.status === "safe" || content.status === "harmful") && 
    content.moderatedBy &&
    (searchQuery === "" || content.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
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
  
  const handleApprove = () => {
    if (selectedContent) {
      moderateContent(selectedContent, "approve", moderationNotes);
      setSelectedContent(null);
      setModerationNotes("");
    }
  };
  
  const handleEdit = () => {
    if (selectedContent) {
      moderateContent(selectedContent, "edit", moderationNotes);
      setSelectedContent(null);
      setModerationNotes("");
    }
  };
  
  const handleBlock = () => {
    if (selectedContent) {
      moderateContent(selectedContent, "block", moderationNotes);
      setSelectedContent(null);
      setModerationNotes("");
    }
  };
  
  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Moderator Dashboard</h1>
          <p className="text-muted-foreground">
            Review and moderate content flagged by our AI system
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="animate-fade-in [animation-delay:200ms]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pending Review</CardTitle>
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <CardDescription>
                Content awaiting moderation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {contentToModerate.length}
              </p>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in [animation-delay:400ms]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Approved</CardTitle>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <CardDescription>
                Content approved by moderators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {contents.filter(c => c.status === "safe" && c.moderatedBy).length}
              </p>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in [animation-delay:600ms]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Blocked</CardTitle>
                <ShieldAlert className="h-5 w-5 text-red-500" />
              </div>
              <CardDescription>
                Content blocked by moderators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {contents.filter(c => c.status === "harmful" && c.moderatedBy).length}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-6">
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
            
            <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="pending">Pending Review</TabsTrigger>
                <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending" className="mt-0">
                {contentToModerate.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No content awaiting moderation</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contentToModerate.map((content) => (
                      <div 
                        key={content.id} 
                        className="border rounded-lg p-4 hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row justify-between mb-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <div className="bg-secondary p-2 rounded-full">
                              {getContentTypeIcon(content.type)}
                            </div>
                            <div>
                              <div className="font-medium">
                                {content.type.charAt(0).toUpperCase() + content.type.slice(1)} Content
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(content.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(content.status)}
                          </div>
                        </div>
                        
                        <div className="my-4 p-3 bg-muted rounded-md">
                          <div className="text-sm">
                            {content.type === "text" ? (
                              <p className="whitespace-pre-wrap">{content.content}</p>
                            ) : (
                              <p>Filename: {content.content}</p>
                            )}
                          </div>
                        </div>
                        
                        {content.aiReport && (
                          <div className="mb-4 p-3 bg-secondary rounded-md">
                            <h4 className="text-sm font-semibold mb-1">AI Analysis Report</h4>
                            <p className="text-xs text-muted-foreground">{content.aiReport}</p>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2 justify-end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedContent(content.id)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[525px]">
                              <DialogHeader>
                                <DialogTitle>Review Content</DialogTitle>
                                <DialogDescription>
                                  Make a moderation decision on this content.
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="py-4">
                                <div className="mb-4">
                                  <Label className="text-sm font-medium">Content Type</Label>
                                  <div className="flex items-center mt-1">
                                    {getContentTypeIcon(content.type)}
                                    <span className="ml-2 text-sm">
                                      {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="mb-4">
                                  <Label className="text-sm font-medium">Content</Label>
                                  <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                                    {content.type === "text" ? (
                                      <p className="whitespace-pre-wrap">{content.content}</p>
                                    ) : (
                                      <p>Filename: {content.content}</p>
                                    )}
                                  </div>
                                </div>
                                
                                {content.aiReport && (
                                  <div className="mb-4">
                                    <Label className="text-sm font-medium">AI Analysis</Label>
                                    <div className="mt-1 p-3 bg-secondary rounded-md text-sm">
                                      <p className="text-muted-foreground">{content.aiReport}</p>
                                    </div>
                                  </div>
                                )}
                                
                                <div className="mb-4">
                                  <Label htmlFor="moderationNotes">Moderation Notes</Label>
                                  <Textarea
                                    id="moderationNotes"
                                    placeholder="Add your moderation notes here..."
                                    value={moderationNotes}
                                    onChange={(e) => setModerationNotes(e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                              
                              <DialogFooter className="flex justify-between">
                                <Button
                                  variant="destructive"
                                  onClick={handleBlock}
                                >
                                  <ShieldAlert className="h-4 w-4 mr-2" />
                                  Block
                                </Button>
                                <div className="space-x-2">
                                  <Button
                                    variant="outline"
                                    onClick={handleEdit}
                                  >
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    Request Edits
                                  </Button>
                                  <Button
                                    onClick={handleApprove}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                </div>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="reviewed" className="mt-0">
                {reviewedContent.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No reviewed content found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviewedContent.map((content) => (
                      <div 
                        key={content.id} 
                        className="border rounded-lg p-4"
                      >
                        <div className="flex flex-col md:flex-row justify-between mb-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <div className="bg-secondary p-2 rounded-full">
                              {getContentTypeIcon(content.type)}
                            </div>
                            <div>
                              <div className="font-medium">
                                {content.type.charAt(0).toUpperCase() + content.type.slice(1)} Content
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(content.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(content.status)}
                          </div>
                        </div>
                        
                        <div className="my-4 p-3 bg-muted rounded-md">
                          <div className="text-sm">
                            {content.type === "text" ? (
                              <p className="whitespace-pre-wrap">{content.content}</p>
                            ) : (
                              <p>Filename: {content.content}</p>
                            )}
                          </div>
                        </div>
                        
                        {content.moderationNotes && (
                          <div className="mb-4 p-3 bg-secondary rounded-md">
                            <h4 className="text-sm font-semibold mb-1">Moderation Notes</h4>
                            <p className="text-xs text-muted-foreground">{content.moderationNotes}</p>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-muted-foreground">
                            Moderated by: {content.moderatedBy}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {content.moderatedAt && new Date(content.moderatedAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Moderation Logs</CardTitle>
            <CardDescription>
              Recent moderation actions taken by your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            {moderationLogs.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No moderation activities yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {moderationLogs.slice(0, 5).map((log, index) => {
                  const content = contents.find(c => c.id === log.contentId);
                  return (
                    <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div className="flex items-center space-x-2">
                        {log.action === "approve" && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {log.action === "edit" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                        {log.action === "block" && <ShieldAlert className="h-4 w-4 text-red-500" />}
                        <div>
                          <div className="text-sm font-medium">
                            {log.action === "approve" && "Content Approved"}
                            {log.action === "edit" && "Edits Requested"}
                            {log.action === "block" && "Content Blocked"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {content?.type.charAt(0).toUpperCase() + content?.type.slice(1)} content
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModeratorDashboard;
