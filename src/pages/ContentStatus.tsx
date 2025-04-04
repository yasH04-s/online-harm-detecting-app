
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock, FileText, Video, Mic, ArrowLeft, ShieldAlert } from "lucide-react";

const ContentStatus: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getContent } = useAppContext();
  
  const content = id ? getContent(id) : undefined;
  
  if (!content) {
    return (
      <div className="container mx-auto py-6 animate-fade-in">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Content Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The content you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/dashboard">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const getStatusIcon = () => {
    switch (content.status) {
      case "analyzing":
        return <Clock className="h-10 w-10 text-amber-500" />;
      case "safe":
        return <CheckCircle className="h-10 w-10 text-green-500" />;
      case "suspicious":
        return <AlertTriangle className="h-10 w-10 text-amber-500" />;
      case "harmful":
        return <ShieldAlert className="h-10 w-10 text-red-500" />;
      default:
        return <Clock className="h-10 w-10 text-amber-500" />;
    }
  };
  
  const getContentTypeIcon = () => {
    switch (content.type) {
      case "text":
        return <FileText className="h-6 w-6" />;
      case "video":
        return <Video className="h-6 w-6" />;
      case "audio":
        return <Mic className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };
  
  const getStatusBadge = () => {
    switch (content.status) {
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
  
  const getStatusMessage = () => {
    switch (content.status) {
      case "analyzing":
        return "Your content is currently being analyzed by our AI system.";
      case "safe":
        return "Your content has been approved and is now published.";
      case "suspicious":
        return "Your content has been flagged for manual review by our moderation team.";
      case "harmful":
        return "Your content has been identified as potentially harmful and cannot be published.";
      default:
        return "Status unknown";
    }
  };

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center text-sm text-muted-foreground mb-6 underline-animation">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Link>
        
        <Card className="animate-scale-in">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                {getContentTypeIcon()}
                <CardTitle className="ml-2">{content.type.charAt(0).toUpperCase() + content.type.slice(1)} Content Status</CardTitle>
              </div>
              <CardDescription>
                Submitted on {content.timestamp.toLocaleString()}
              </CardDescription>
            </div>
            {getStatusBadge()}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center py-6">
              {getStatusIcon()}
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                Status: {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
              </h3>
              <p className="text-muted-foreground">{getStatusMessage()}</p>
            </div>
            
            {content.aiReport && (
              <div className="mt-6 p-4 bg-secondary rounded-md">
                <h4 className="font-semibold mb-2">AI Analysis Report</h4>
                <p className="text-sm text-muted-foreground">{content.aiReport}</p>
              </div>
            )}
            
            {content.moderationNotes && (
              <div className="mt-6 p-4 bg-secondary rounded-md">
                <h4 className="font-semibold mb-2">Moderation Notes</h4>
                <p className="text-sm text-muted-foreground">{content.moderationNotes}</p>
              </div>
            )}
            
            <div className="mt-6 p-4 bg-muted rounded-md">
              <h4 className="font-semibold mb-2">Content Preview</h4>
              <div className="text-sm text-muted-foreground">
                {content.type === "text" ? (
                  <p className="whitespace-pre-wrap">{content.content}</p>
                ) : (
                  <p>Filename: {content.content}</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Link to="/submit">
              <Button variant="outline">Submit Another</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ContentStatus;
