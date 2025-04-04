
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { FileText, Video, Mic, Image, Upload, Loader2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const SubmitContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("text");
  const [textContent, setTextContent] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [contentCategory, setContentCategory] = useState("general");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);

  const { addContent, isLoading } = useAppContext();
  const navigate = useNavigate();

  // Simulate progress for visual feedback during analysis
  const simulateProgress = () => {
    setProgress(0);
    setAnalyzing(true);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 200);
    
    return () => clearInterval(interval);
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textContent.trim()) {
      toast({
        title: "Empty Content",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      });
      return;
    }

    try {
      const cleanupProgress = simulateProgress();
      const contentId = await addContent("text", textContent);
      cleanupProgress();
      setAnalyzing(false);
      navigate(`/status/${contentId}`);
    } catch (error) {
      setAnalyzing(false);
      console.error("Error submitting text content", error);
    }
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) {
      toast({
        title: "No Video Selected",
        description: "Please select a video file to upload.",
        variant: "destructive",
      });
      return;
    }

    try {
      const cleanupProgress = simulateProgress();
      const contentId = await addContent("video", videoFile.name, videoFile);
      cleanupProgress();
      setAnalyzing(false);
      navigate(`/status/${contentId}`);
    } catch (error) {
      setAnalyzing(false);
      console.error("Error submitting video content", error);
    }
  };

  const handleAudioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile) {
      toast({
        title: "No Audio Selected",
        description: "Please select an audio file to upload.",
        variant: "destructive",
      });
      return;
    }

    try {
      const cleanupProgress = simulateProgress();
      const contentId = await addContent("audio", audioFile.name, audioFile);
      cleanupProgress();
      setAnalyzing(false);
      navigate(`/status/${contentId}`);
    } catch (error) {
      setAnalyzing(false);
      console.error("Error submitting audio content", error);
    }
  };

  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      toast({
        title: "No Image Selected",
        description: "Please select an image file to upload.",
        variant: "destructive",
      });
      return;
    }

    try {
      const cleanupProgress = simulateProgress();
      const contentId = await addContent("image", imageFile.name, imageFile);
      cleanupProgress();
      setAnalyzing(false);
      navigate(`/status/${contentId}`);
    } catch (error) {
      setAnalyzing(false);
      console.error("Error submitting image content", error);
    }
  };

  // File handlers with preview support
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      
      // Create a preview URL for video
      if (filePreview) URL.revokeObjectURL(filePreview);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFile(file);
      
      // We don't show previews for audio, just clear any existing preview
      if (filePreview) URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create a preview URL for image
      if (filePreview) URL.revokeObjectURL(filePreview);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  // Cleanup preview URLs when component unmounts
  React.useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Submit Content for Analysis</h1>
        <p className="text-muted-foreground mb-8 text-center">
          Choose the type of content you'd like to submit for AI analysis and moderation.
        </p>

        <Tabs 
          defaultValue="text" 
          value={activeTab} 
          onValueChange={(value) => {
            setActiveTab(value);
            // Clear preview when switching tabs
            if (filePreview) {
              URL.revokeObjectURL(filePreview);
              setFilePreview(null);
            }
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Text</span>
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span>Image</span>
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span>Video</span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              <span>Audio</span>
            </TabsTrigger>
          </TabsList>

          {/* Progress indicator for all tabs */}
          {analyzing && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Analyzing content...</span>
                <span className="text-sm">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          <TabsContent value="text">
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle>Text Analysis</CardTitle>
                <CardDescription>
                  Submit text content for AI-powered harm detection analysis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTextSubmit}>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="content-category">Content Category</Label>
                      <RadioGroup 
                        defaultValue="general" 
                        value={contentCategory} 
                        onValueChange={setContentCategory}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="general" id="general" />
                          <Label htmlFor="general">General</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="educational" id="educational" />
                          <Label htmlFor="educational">Educational</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="commercial" id="commercial" />
                          <Label htmlFor="commercial">Commercial</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="text-content">Your Content</Label>
                      <Textarea
                        id="text-content"
                        placeholder="Enter the text you want to analyze..."
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        className="min-h-[200px]"
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleTextSubmit} disabled={isLoading || analyzing || !textContent.trim()}>
                  {isLoading || analyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Submit for Analysis
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="image">
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle>Image Analysis</CardTitle>
                <CardDescription>
                  Upload image content for AI-powered harm detection analysis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleImageSubmit}>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="content-category-image">Content Category</Label>
                      <RadioGroup 
                        defaultValue="general" 
                        value={contentCategory} 
                        onValueChange={setContentCategory}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="general" id="general-image" />
                          <Label htmlFor="general-image">General</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="educational" id="educational-image" />
                          <Label htmlFor="educational-image">Educational</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="commercial" id="commercial-image" />
                          <Label htmlFor="commercial-image">Commercial</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="image-upload">Upload Image</Label>
                      <div 
                        className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-secondary/50 transition-colors flex flex-col items-center justify-center"
                        onClick={() => document.getElementById('image-file')?.click()}
                      >
                        <input
                          type="file"
                          id="image-file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageFileChange}
                        />
                        
                        {filePreview ? (
                          <div className="space-y-4">
                            <div className="relative mx-auto max-w-xs overflow-hidden rounded-md">
                              <img 
                                src={filePreview} 
                                alt="Preview" 
                                className="max-h-48 mx-auto object-contain" 
                              />
                            </div>
                            <p>{imageFile?.name}</p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setImageFile(null);
                                if (filePreview) {
                                  URL.revokeObjectURL(filePreview);
                                  setFilePreview(null);
                                }
                              }}
                            >
                              Change Image
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Image className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                            <div className="text-muted-foreground">
                              <p className="font-medium">Drag and drop your image here</p>
                              <p className="text-xs mt-1">Supports: JPG, PNG, GIF, WEBP</p>
                            </div>
                            <Button className="mt-4" variant="secondary" size="sm">
                              Browse Files
                            </Button>
                          </>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Images will be analyzed for unsafe content including explicit material, violence, or other policy violations.
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleImageSubmit} disabled={isLoading || analyzing || !imageFile}>
                  {isLoading || analyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Submit for Analysis
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="video">
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle>Video Analysis</CardTitle>
                <CardDescription>
                  Upload video content for AI-powered harm detection analysis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVideoSubmit}>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="content-category-video">Content Category</Label>
                      <RadioGroup 
                        defaultValue="general" 
                        value={contentCategory} 
                        onValueChange={setContentCategory}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="general" id="general-video" />
                          <Label htmlFor="general-video">General</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="educational" id="educational-video" />
                          <Label htmlFor="educational-video">Educational</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="commercial" id="commercial-video" />
                          <Label htmlFor="commercial-video">Commercial</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="video-upload">Upload Video</Label>
                      <div 
                        className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-secondary/50 transition-colors flex flex-col items-center justify-center"
                        onClick={() => document.getElementById('video-file')?.click()}
                      >
                        <input
                          type="file"
                          id="video-file"
                          accept="video/*"
                          className="hidden"
                          onChange={handleVideoFileChange}
                        />
                        
                        {filePreview && videoFile ? (
                          <div className="space-y-4">
                            <div className="relative mx-auto max-w-sm overflow-hidden rounded-md">
                              <video 
                                src={filePreview} 
                                controls 
                                className="max-h-48 mx-auto" 
                              />
                            </div>
                            <p>{videoFile.name}</p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setVideoFile(null);
                                if (filePreview) {
                                  URL.revokeObjectURL(filePreview);
                                  setFilePreview(null);
                                }
                              }}
                            >
                              Change Video
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Video className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                            <div className="text-muted-foreground">
                              <p className="font-medium">Drag and drop your video here</p>
                              <p className="text-xs mt-1">Supports: MP4, MOV, AVI, WEBM</p>
                            </div>
                            <Button className="mt-4" variant="secondary" size="sm">
                              Browse Files
                            </Button>
                          </>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Videos will be analyzed for unsafe content including explicit material, violence, or other policy violations.
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleVideoSubmit} disabled={isLoading || analyzing || !videoFile}>
                  {isLoading || analyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Submit for Analysis
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="audio">
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle>Audio Analysis</CardTitle>
                <CardDescription>
                  Upload audio content for AI-powered harm detection analysis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAudioSubmit}>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="content-category-audio">Content Category</Label>
                      <RadioGroup 
                        defaultValue="general" 
                        value={contentCategory} 
                        onValueChange={setContentCategory}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="general" id="general-audio" />
                          <Label htmlFor="general-audio">General</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="educational" id="educational-audio" />
                          <Label htmlFor="educational-audio">Educational</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="commercial" id="commercial-audio" />
                          <Label htmlFor="commercial-audio">Commercial</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="audio-upload">Upload Audio</Label>
                      <div 
                        className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-secondary/50 transition-colors flex flex-col items-center justify-center"
                        onClick={() => document.getElementById('audio-file')?.click()}
                      >
                        <input
                          type="file"
                          id="audio-file"
                          accept="audio/*"
                          className="hidden"
                          onChange={handleAudioFileChange}
                        />
                        
                        {audioFile ? (
                          <div className="space-y-4">
                            <div className="relative mx-auto max-w-sm overflow-hidden rounded-md p-4 bg-secondary/30">
                              <Mic className="h-16 w-16 mx-auto mb-2 text-primary" />
                              {audioFile && (
                                <audio controls className="w-full mt-4">
                                  <source src={filePreview || ""} type={audioFile.type} />
                                  Your browser does not support the audio element.
                                </audio>
                              )}
                            </div>
                            <p>{audioFile.name}</p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAudioFile(null);
                                if (filePreview) {
                                  URL.revokeObjectURL(filePreview);
                                  setFilePreview(null);
                                }
                              }}
                            >
                              Change Audio
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Mic className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                            <div className="text-muted-foreground">
                              <p className="font-medium">Drag and drop your audio here</p>
                              <p className="text-xs mt-1">Supports: MP3, WAV, AAC, OGG</p>
                            </div>
                            <Button className="mt-4" variant="secondary" size="sm">
                              Browse Files
                            </Button>
                          </>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Audio will be analyzed for unsafe content including explicit language, hate speech, or other policy violations.
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleAudioSubmit} disabled={isLoading || analyzing || !audioFile}>
                  {isLoading || analyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Submit for Analysis
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SubmitContent;
