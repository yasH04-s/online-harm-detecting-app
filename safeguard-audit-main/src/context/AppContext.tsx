import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { analyzeImage, analyzeVideo, analyzeAudio } from "@/utils/contentAnalysis";

type ContentType = "text" | "video" | "audio" | "image";
type ContentStatus = "analyzing" | "safe" | "suspicious" | "harmful";

interface Content {
  id: string;
  type: ContentType;
  content: string;
  status: ContentStatus;
  timestamp: Date;
  aiReport?: string;
  moderationNotes?: string;
  moderatedBy?: string;
  moderatedAt?: Date;
  fileUrl?: string;
  fileData?: Blob;
  analysisConfidence?: number;
}

interface ModeratorAction {
  contentId: string;
  action: "approve" | "edit" | "block";
  notes?: string;
  timestamp: Date;
  moderator: string;
}

interface AppContextType {
  contents: Content[];
  addContent: (type: ContentType, content: string, file?: File) => Promise<string>;
  getContent: (id: string) => Content | undefined;
  updateContentStatus: (id: string, status: ContentStatus) => void;
  moderateContent: (contentId: string, action: "approve" | "edit" | "block", notes?: string) => void;
  moderationLogs: ModeratorAction[];
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

interface ContextProviderProps {
  children: React.ReactNode;
}

export const ContextProvider = ({ children }: ContextProviderProps) => {
  const [contents, setContents] = useState<Content[]>([]);
  const [moderationLogs, setModerationLogs] = useState<ModeratorAction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedContents = localStorage.getItem("contents");
    const savedLogs = localStorage.getItem("moderationLogs");

    if (savedContents) {
      try {
        const parsedContents = JSON.parse(savedContents);
        setContents(parsedContents.map((content: any) => ({
          ...content,
          timestamp: new Date(content.timestamp),
          moderatedAt: content.moderatedAt ? new Date(content.moderatedAt) : undefined
        })));
      } catch (error) {
        console.error("Failed to parse saved contents", error);
      }
    }

    if (savedLogs) {
      try {
        const parsedLogs = JSON.parse(savedLogs);
        setModerationLogs(parsedLogs.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        })));
      } catch (error) {
        console.error("Failed to parse saved logs", error);
      }
    }
  }, []);

  useEffect(() => {
    const contentsToSave = contents.map(({ fileData, ...rest }) => rest);
    localStorage.setItem("contents", JSON.stringify(contentsToSave));
  }, [contents]);

  useEffect(() => {
    localStorage.setItem("moderationLogs", JSON.stringify(moderationLogs));
  }, [moderationLogs]);

  const addContent = async (type: ContentType, content: string, file?: File): Promise<string> => {
    setIsLoading(true);
    
    try {
      const id = Date.now().toString();
      
      let status: ContentStatus = "analyzing";
      let aiReport = "";
      let fileUrl = "";
      let analysisConfidence = 0;
      
      if (type === "text") {
        const lowerContent = content.toLowerCase();
        
        const harmfulPatterns = [
          /\b(kill|murder|hurt|harm|attack|beat|assault|threaten|shoot|stab|punch|violate|torture)\b/,
          /\b(hate|racist|sexist|homophobic|transphobic|nazi|terrorism|bigot|disgusting)\b/,
          /\b(suicide|self-harm|cutting|overdose|self-injury|end my life)\b/,
          /\b(porn|explicit|nude|naked|obscene|lewd|masturbate)\b/,
          /\b(steal|robbery|hack|fraud|illegal|weapon|bomb|drugs|cocaine|heroin)\b/,
          /\b(harass|bully|stalk|dox|expose|humiliate)\b/,
          /\b(fuck|shit|ass|bitch|cunt|dick|cock|pussy|whore|bastard|asshole|motherfucker|damn|bullshit|crap)\b/,
          /\b(jerk|idiot|stupid|dumb|moron|retard|imbecile|fool|loser|slut|wanker|twat|piss|tits|boobs)\b/,
          /\b(rape|molest|grope|fondle|sexual assault|inappropriately touch)\b/,
          /\b(send nudes|sexy pics|sex chat|sext|masturbate|cyber sex|get naked|show me your|strip for me)\b/,
          /\b(want to fuck|want to bang|sleep with me|sleep together|hook up|get laid|blow job|go down on)\b/,
          /\b(nice body|sexy body|hot body|beautiful body|nice ass|nice tits|nice boobs|sexy legs)\b/,
          /\b(what are you wearing|take off your|remove your clothes|are you naked|are you horny|turn me on)\b/,
          /\b(nigger|nigga|kike|chink|spic|wetback|raghead|towelhead|fag|faggot|dyke|tranny|retard)\b/,
          /\b(child porn|kiddie porn|underage sex|minor sex|pedo|pedophile|young girl|young boy|trafficking)\b/,
          /\b(bhenchod|madar(chod)?|behen ke laude|bsdk|chutiya|lund|lauda|randi|gandu|behenchod|chut|lode|jhatu)\b/,
          /\b(panchod|pencho|gadha|khotey|kuttey|khota|harami|paji|kanjara|tatti|patti|gaddi)\b/,
          /\b(bokachoda|khanki|shala|kutta|sutki|magi|chudi|bara|gud|dhon|voda|pod)\b/,
          /\b(otha|baadu|pundai|sunni|thevdiya|myir|enna|naaye|loosu|koodhi|ommala|kaai|thayoli)\b/,
          /\b(dengey|gudda|modda|lanja|pookulu|pooku|sulli|lanja|gadida|erripook|pichi|puka|dengu)\b/,
          /\b(zhavadya|bhikaar|chinal|randi|zavadya|radu|chand|bhosadya|manya|aayi(chi)?(zavli|gand))\b/,
          /\b(myru|pundachi|thayoli|poori|thendi|maire|poorr|kundi|thevidiya|achante|poore|kunna)\b/,
          /\b(keydimaga|sule|thika|boli|shata|ninna|huduga|hendati|gandu|nayi|mayamaga|byavarsi)\b/,
          /\b(chodu|gaand|lund|behenchod|bhosdina|land|maa-bhen|dhandho|maari|lulli|goti|bosadi)\b/,
          /\b(harami|kanjari|kameena|chussa|gaandu|kutta|kamina|phudi|choot|sharmindah|chuss|yaar|kutti)\b/,
          /\b(fodri|fodem|rando|chikli|chood|fodi|zadap|baylo|bhikari|ghand|yedu|futti|zatalo)\b/,
          /\b(bahenchod|gahori|kela|khanki|lora|banda|magi|voda|kuttar|koni|bilai|guu|xuwali)\b/,
          /\b(maghia|banda|randi|chodri|mogiare|podi|dhipa|panji|bedhya|ghusi|thuku|chuda|magi)\b/,
          /\b(puta|cojones|coño|follar|joder|mierda|putain|merde|salope|connard|fick|scheiße|fotze|cazzo|stronzo|puttana|cyka|blyat|khuy|pizda|yebat)\b/,
          /\b(他妈的|肏|屁眼|傻逼|妓女|屄|��そ|ファック|淫売|おしり|씨발|좆|개자식|지랄|걸레)\b/
        ];
        
        const suspiciousPatterns = [
          /\b(suspicious|weird|strange|odd|creepy|sketchy|concerning)\b/,
          /\b(angry|upset|annoyed|frustrated|mad|pissed)\b/,
          /\b(scared|afraid|worried|anxious|nervous|concerned)\b/,
          /\b(pain|hurt|suffering|misery|agony|anguish)\b/,
          /\b(drug|drink|alcohol|weed|marijuana|high|drunk)\b/,
          /\b(fight|argument|conflict|dispute|disagree|debate)\b/,
          /\b(hell|darn|sucks|freaking|heck|gosh|shut up|screw|frickin)\b/,
          /\b(date me|go out with me|attracted to you|find you attractive|cute|hot|sexy|dating|relationship)\b/,
          /\b(flirt|love you|miss you|thinking about you|dreaming of you|fantasize|crush on you)\b/,
          /\b(can i have your|give me your number|meet up|meet in person|alone together|private chat|dm me)\b/,
          /\b(that's what she said|in bed|between the sheets|getting it on|doing it|netflix and chill)\b/
        ];
        
        const harmfulMatch = harmfulPatterns.some(pattern => pattern.test(lowerContent));
        
        const suspiciousMatch = suspiciousPatterns.some(pattern => pattern.test(lowerContent));
        
        const contextualAnalysis = analyzeTextContext(content);
        
        if (harmfulMatch || contextualAnalysis.harmful) {
          status = "harmful";
          aiReport = "Content contains potentially harmful language or themes related to " + 
                     (contextualAnalysis.harmful ? contextualAnalysis.harmfulType : "violence, hate speech, self-harm, sexual harassment, or unparliamentary language") + 
                     ". This content violates our community guidelines.";
          analysisConfidence = 0.85;
        } else if (suspiciousMatch || contextualAnalysis.suspicious) {
          status = "suspicious";
          aiReport = "Content contains potentially concerning language or themes that require further review by our moderation team. " +
                     (contextualAnalysis.suspicious ? contextualAnalysis.suspiciousReason : "The content may not be clearly harmful but requires additional context assessment.");
          analysisConfidence = 0.65;
        } else {
          if (content.length < 5) {
            status = "suspicious";
            aiReport = "Content is too short to perform a reliable analysis. Requires human review.";
            analysisConfidence = 0.5;
          } else {
            status = "safe";
            aiReport = "Content appears to be safe based on our comprehensive textual analysis. No harmful patterns detected.";
            analysisConfidence = 0.9;
          }
        }
      } else if (type === "image" && file) {
        try {
          fileUrl = URL.createObjectURL(file);
          
          const analysisResult = await analyzeImage(file);
          
          status = analysisResult.status;
          aiReport = analysisResult.details;
          analysisConfidence = analysisResult.confidence;
        } catch (error) {
          console.error("Error analyzing image:", error);
          status = "suspicious";
          aiReport = "Error analyzing image. Manual review required.";
          analysisConfidence = 0.5;
        }
      } else if (type === "video" && file) {
        try {
          fileUrl = URL.createObjectURL(file);
          
          const analysisResult = await analyzeVideo(file);
          
          status = analysisResult.status;
          aiReport = analysisResult.details;
          analysisConfidence = analysisResult.confidence;
        } catch (error) {
          console.error("Error analyzing video:", error);
          status = "suspicious";
          aiReport = "Error analyzing video. Manual review required.";
          analysisConfidence = 0.5;
        }
      } else if (type === "audio" && file) {
        try {
          fileUrl = URL.createObjectURL(file);
          
          const analysisResult = await analyzeAudio(file);
          
          status = analysisResult.status;
          aiReport = analysisResult.details;
          analysisConfidence = analysisResult.confidence;
        } catch (error) {
          console.error("Error analyzing audio:", error);
          status = "suspicious";
          aiReport = "Error analyzing audio. Manual review required.";
          analysisConfidence = 0.5;
        }
      } else {
        throw new Error("Invalid content type or missing file for media content");
      }
      
      const newContent: Content = {
        id,
        type,
        content: type === "text" ? content : file?.name || "",
        status,
        timestamp: new Date(),
        aiReport,
        fileUrl,
        fileData: file ? file : undefined,
        analysisConfidence
      };
      
      setContents(prev => [...prev, newContent]);
      
      if (status === "safe") {
        toast({
          title: "Content Approved",
          description: "Your content has been automatically approved and published.",
          variant: "default",
        });
      } else if (status === "suspicious") {
        toast({
          title: "Under Review",
          description: "Your content has been flagged for manual review by our moderation team.",
          variant: "default",
        });
      } else if (status === "harmful") {
        toast({
          title: "Content Blocked",
          description: "Your content has been detected as potentially harmful and cannot be published.",
          variant: "destructive",
        });
      }
      
      return id;
    } catch (error) {
      console.error("Error processing content", error);
      toast({
        title: "Processing Error",
        description: "There was an error processing your content. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeTextContext = (content: string): { 
    harmful: boolean; 
    harmfulType?: string; 
    suspicious: boolean; 
    suspiciousReason?: string 
  } => {
    const text = content.toLowerCase();
    
    if (/i (\w+ )?(\w+ )?kill|i (\w+ )?(\w+ )?hurt|i (\w+ )?(\w+ )?attack|going to (\w+ )?kill|planning to (\w+ )?attack/.test(text) ||
        /main tumhe marunga|main tumhe khatam|tujhe khatm kar dunga|tujhe maar dunga|tujhe jaan se/.test(text) ||
        /naan unnai kolluvene|naanum unnayum konnu|tula marein|tumala marin|tumko mein marega/.test(text)) {
      return { harmful: true, harmfulType: "threats of violence or harm in multiple languages", suspicious: false };
    }
    
    if ((/all (\w+ )?(are|should)|they deserve to|we should (\w+ )?them/.test(text) &&
        /\b(hate|die|eliminate|get rid of|inferior|stupid|worthless)\b/.test(text)) ||
        /sab log (\w+ )?ko marna chahiye|har ek (\w+ )?ko (\w+ )?marna chahiye|sab (\w+ )?mar jaye/.test(text) ||
        /avargal ellam marikka|yellaru (\w+ )?sakbeku|andaru (\w+ )?chavali/.test(text)) {
      return { harmful: true, harmfulType: "hate speech or discrimination in multiple languages", suspicious: false };
    }
    
    if (/i (\w+ )?(\w+ )?want to die|i (\w+ )?(\w+ )?end my life|i (\w+ )?(\w+ )?hurt myself|i (\w+ )?(\w+ )?can'?t go on/.test(text) ||
        /main marna chahta hu|mujhe jeena nahi|mein apne aap ko|khudkhushi karna chahta|jeene ka mann nahi/.test(text) ||
        /naan saaga virumbugireen|naanum saaganum|enakku vaazhkai venda|enakku endrum uyir venam/.test(text)) {
      return { harmful: true, harmfulType: "self-harm or suicide indications in multiple languages", suspicious: false };
    }
    
    if ((/(\bi\b|\bwe\b) (\w+ )?(\w+ )?want to (\w+ )?you|(\bi\b|\bwe\b) (\w+ )?(\w+ )?like to (\w+ )?you/.test(text) &&
        /\b(sex|fuck|sexually|naked|body|nudes|touch|feel)\b/.test(text)) ||
        /main tumhare saath sex|mujhe tumhare saath|tumhara badan|tumhari photo bhejo|tumhe nangi/.test(text) ||
        /naan unnodu sex|unakku sexai|un udambai|nee mulai|un maarbagam|thevadia magan|unnoda body/.test(text)) {
      return { harmful: true, harmfulType: "sexual harassment or unwanted advances in multiple languages", suspicious: false };
    }
    
    if (/i (\w+ )?(\w+ )?kill|i (\w+ )?(\w+ )?hurt|i (\w+ )?(\w+ )?attack|going to (\w+ )?kill|planning to (\w+ )?attack/.test(text)) {
      return { harmful: true, harmfulType: "threats of violence or harm", suspicious: false };
    }
    
    if (/all (\w+ )?(are|should)|they deserve to|we should (\w+ )?them/.test(text) &&
        /\b(hate|die|eliminate|get rid of|inferior|stupid|worthless)\b/.test(text)) {
      return { harmful: true, harmfulType: "hate speech or discrimination", suspicious: false };
    }
    
    if (/i (\w+ )?(\w+ )?want to die|i (\w+ )?(\w+ )?end my life|i (\w+ )?(\w+ )?hurt myself|i (\w+ )?(\w+ )?can'?t go on/.test(text)) {
      return { harmful: true, harmfulType: "self-harm or suicide", suspicious: false };
    }
    
    if (/how to (\w+ )?make|steps to (\w+ )?create|instructions for/.test(text) &&
        /\b(bomb|explosive|weapon|poison|hack|steal)\b/.test(text)) {
      return { harmful: true, harmfulType: "instructions for harmful or illegal activities", suspicious: false };
    }
    
    if (/(\bi\b|\bwe\b) (\w+ )?(\w+ )?want to (\w+ )?you|(\bi\b|\bwe\b) (\w+ )?(\w+ )?like to (\w+ )?you/.test(text) &&
        /\b(sex|fuck|sexually|naked|body|nudes|touch|feel)\b/.test(text)) {
      return { harmful: true, harmfulType: "sexual harassment or unwanted advances", suspicious: false };
    }
    
    if (/your (\w+ )?(\w+ )?(body|appearance|looks)|you (\w+ )?(\w+ )?(hot|sexy|beautiful)/.test(text) &&
        /\b(want|like|love|desire|wish|hope|imagine)\b/.test(text)) {
      return { harmful: true, harmfulType: "unwelcome sexualized attention", suspicious: false };
    }
    
    if (/(you are|you're|you) (\w+ )?(\w+ )?a/.test(text) &&
        /\b(bitch|asshole|cunt|idiot|moron|stupid|retard|motherfucker)\b/.test(text)) {
      return { harmful: true, harmfulType: "directed profanity and personal attacks", suspicious: false };
    }
    
    if (/(\bplease\b|\bcome on\b|\bjust\b) (\w+ )?(\w+ )?(once|try|consider|think about)/.test(text) &&
        /\b(sex|date|meet|go out|hang out|see you|talk to you|message me)\b/.test(text)) {
      return { harmful: true, harmfulType: "persistent unwanted advances", suspicious: false };
    }

    if (/feel like (\w+ )?(\w+ )?end|don'?t know what to do|can'?t handle|need help with/.test(text)) {
      return { harmful: false, suspicious: true, suspiciousReason: "potential emotional distress that requires human judgment" };
    }
    
    if (/they will (\w+ )?(\w+ )?pay|you'?ll (\w+ )?(\w+ )?regret|wait until|what happens when|wait and see/.test(text)) {
      return { harmful: false, suspicious: true, suspiciousReason: "potential indirect threats that require human judgment" };
    }
    
    if (/\b(depression|anxiety|mental health|trauma|addiction|gun|knife|police)\b/.test(text)) {
      return { harmful: false, suspicious: true, suspiciousReason: "discussion of sensitive topics that require context evaluation" };
    }
    
    if (/\b(attractive|gorgeous|pretty|handsome|cute|beautiful|hot)\b/.test(text) && 
        /\b(you are|you look|you seem|you're)\b/.test(text)) {
      return { harmful: false, suspicious: true, suspiciousReason: "potentially inappropriate comments about appearance" };
    }
    
    return { harmful: false, suspicious: false };
  };

  const getContent = (id: string) => {
    return contents.find(content => content.id === id);
  };

  const updateContentStatus = (id: string, status: ContentStatus) => {
    setContents(prev => 
      prev.map(content => 
        content.id === id ? { ...content, status } : content
      )
    );
  };

  const moderateContent = (
    contentId: string, 
    action: "approve" | "edit" | "block", 
    notes?: string
  ) => {
    const content = getContent(contentId);
    if (!content) return;

    const now = new Date();
    
    let newStatus: ContentStatus;
    if (action === "approve") {
      newStatus = "safe";
    } else if (action === "edit") {
      newStatus = "suspicious";
    } else {
      newStatus = "harmful";
    }

    setContents(prev => 
      prev.map(content => 
        content.id === contentId 
          ? { 
              ...content, 
              status: newStatus, 
              moderationNotes: notes, 
              moderatedBy: "Moderator",
              moderatedAt: now 
            } 
          : content
      )
    );

    const newLog: ModeratorAction = {
      contentId,
      action,
      notes,
      timestamp: now,
      moderator: "Moderator"
    };
    
    setModerationLogs(prev => [...prev, newLog]);
    
    toast({
      title: "Content Moderated",
      description: `Content has been ${action === "approve" ? "approved" : action === "edit" ? "sent back for editing" : "blocked"}`,
      variant: "default",
    });
  };

  return (
    <AppContext.Provider value={{ 
      contents, 
      addContent, 
      getContent, 
      updateContentStatus, 
      moderateContent, 
      moderationLogs,
      isLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};
