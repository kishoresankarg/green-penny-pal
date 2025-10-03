import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Users, Trophy, Share2, Heart, MessageCircle, Target, Globe, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CommunityHubProps {
  userId: string;
}

interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  goal: number;
  currentProgress: number;
  participants: number;
  endDate: Date;
  reward: string;
  category: string;
}

interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatar: string;
  score: number;
  level: number;
  co2Saved: number;
  streak: number;
  badge: string;
}

interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  content: string;
  achievement?: any;
  activity?: any;
  likes: number;
  comments: number;
  timestamp: Date;
  liked: boolean;
}

export const CommunityHub = ({ userId }: CommunityHubProps) => {
  const [activeTab, setActiveTab] = useState("leaderboard");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [challenges, setChallenges] = useState<CommunityChallenge[]>([]);
  const [socialFeed, setSocialFeed] = useState<SocialPost[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [newPostContent, setNewPostContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchCommunityData();
  }, [userId]);

  const fetchCommunityData = async () => {
    await Promise.all([
      fetchLeaderboard(),
      fetchChallenges(),
      fetchSocialFeed(),
      fetchUserStats()
    ]);
  };

  const fetchLeaderboard = async () => {
    try {
      // In a real implementation, this would be a complex query
      // aggregating user statistics and calculating scores
      const mockLeaderboard: LeaderboardEntry[] = [
        {
          userId: "1",
          userName: "EcoChampion_Mumbai",
          avatar: "/avatars/user1.png",
          score: 2450,
          level: 8,
          co2Saved: 125.5,
          streak: 23,
          badge: "🌟 Eco Master"
        },
        {
          userId: "2", 
          userName: "GreenWarrior_Delhi",
          avatar: "/avatars/user2.png",
          score: 2320,
          level: 7,
          co2Saved: 98.2,
          streak: 18,
          badge: "🚲 Transport Hero"
        },
        {
          userId: userId,
          userName: "You",
          avatar: "/avatars/current-user.png",
          score: 1890,
          level: 6,
          co2Saved: 78.9,
          streak: 12,
          badge: "🌱 Rising Star"
        }
      ];
      
      setLeaderboard(mockLeaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const fetchChallenges = async () => {
    const mockChallenges: CommunityChallenge[] = [
      {
        id: "1",
        title: "Plant-Based January",
        description: "Community goal: 1000 plant-based meals this month",
        goal: 1000,
        currentProgress: 687,
        participants: 156,
        endDate: new Date('2025-01-31'),
        reward: "Tree Planting Certificate + 500 XP",
        category: "Food"
      },
      {
        id: "2",
        title: "Car-Free Week Challenge",
        description: "Avoid using cars for one week. Use eco-friendly transport!",
        goal: 500,
        currentProgress: 342,
        participants: 89,
        endDate: new Date('2025-10-15'),
        reward: "Cycling Champion Badge + 300 XP",
        category: "Transport"
      },
      {
        id: "3",
        title: "Zero Waste Weekend",
        description: "Minimize waste generation and choose reusable alternatives",
        goal: 200,
        currentProgress: 78,
        participants: 45,
        endDate: new Date('2025-10-07'),
        reward: "Waste Warrior Badge + 200 XP",
        category: "Lifestyle"
      }
    ];
    
    setChallenges(mockChallenges);
  };

  const fetchSocialFeed = async () => {
    const mockFeed: SocialPost[] = [
      {
        id: "1",
        userId: "user1",
        userName: "EcoChampion_Mumbai",
        avatar: "/avatars/user1.png",
        content: "Just completed my 30-day cycling streak! 🚲 Saved 15kg CO₂ and ₹450 this month!",
        achievement: { title: "Cycling Master", icon: "🚴‍♀️" },
        likes: 24,
        comments: 8,
        timestamp: new Date('2025-10-02'),
        liked: false
      },
      {
        id: "2",
        userId: "user2",
        userName: "GreenWarrior_Delhi",
        avatar: "/avatars/user2.png",
        content: "Switched to solar power for my home! Initial investment but huge long-term savings 💡",
        activity: { type: "Solar Power", impact: "8.5kg CO₂ saved" },
        likes: 18,
        comments: 5,
        timestamp: new Date('2025-10-01'),
        liked: true
      },
      {
        id: "3",
        userId: "user3",
        userName: "PlantBasedPro",
        avatar: "/avatars/user3.png",
        content: "Week 4 of my plant-based journey! Feeling healthier and helping the planet 🌱",
        likes: 31,
        comments: 12,
        timestamp: new Date('2025-09-30'),
        liked: false
      }
    ];
    
    setSocialFeed(mockFeed);
  };

  const fetchUserStats = async () => {
    // Fetch user's community stats
    setUserStats({
      globalRank: 1247,
      localRank: 23,
      challengesJoined: 5,
      challengesCompleted: 2,
      friendsCount: 12,
      impactShared: 8
    });
  };

  const joinChallenge = async (challengeId: string) => {
    try {
      // In real implementation, add user to challenge participants
      toast({
        title: "Challenge Joined!",
        description: "You're now part of this community challenge. Good luck!",
      });
      
      // Update local state
      setChallenges(prev => prev.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, participants: challenge.participants + 1 }
          : challenge
      ));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join challenge. Please try again.",
        variant: "destructive"
      });
    }
  };

  const shareAchievement = async (achievement: any) => {
    try {
      const post: SocialPost = {
        id: Date.now().toString(),
        userId,
        userName: "You",
        avatar: "/avatars/current-user.png",
        content: `Just unlocked: ${achievement.title}! 🎉`,
        achievement,
        likes: 0,
        comments: 0,
        timestamp: new Date(),
        liked: false
      };
      
      setSocialFeed(prev => [post, ...prev]);
      
      toast({
        title: "Achievement Shared!",
        description: "Your achievement has been shared with the community!",
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to share achievement.",
        variant: "destructive"
      });
    }
  };

  const createPost = async () => {
    if (!newPostContent.trim()) return;
    
    try {
      const post: SocialPost = {
        id: Date.now().toString(),
        userId,
        userName: "You",
        avatar: "/avatars/current-user.png",
        content: newPostContent,
        likes: 0,
        comments: 0,
        timestamp: new Date(),
        liked: false
      };
      
      setSocialFeed(prev => [post, ...prev]);
      setNewPostContent("");
      
      toast({
        title: "Post Created!",
        description: "Your post has been shared with the community!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post.",
        variant: "destructive"
      });
    }
  };

  const toggleLike = async (postId: string) => {
    setSocialFeed(prev => prev.map(post =>
      post.id === postId
        ? {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  return (
    <div className="space-y-6">
      {/* Community Stats Header */}
      <Card className="p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6" />
            Community Hub
          </h2>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            Global Rank #{userStats?.globalRank || "Loading..."}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{userStats?.localRank || 0}</div>
            <div className="text-sm text-muted-foreground">Local Rank</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">{userStats?.challengesCompleted || 0}</div>
            <div className="text-sm text-muted-foreground">Challenges Won</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{userStats?.friendsCount || 0}</div>
            <div className="text-sm text-muted-foreground">Eco Friends</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{userStats?.impactShared || 0}</div>
            <div className="text-sm text-muted-foreground">Achievements Shared</div>
          </div>
        </div>
      </Card>

      {/* Main Community Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="leaderboard">
            <Trophy className="h-4 w-4 mr-2" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="challenges">
            <Target className="h-4 w-4 mr-2" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="social">
            <Share2 className="h-4 w-4 mr-2" />
            Social Feed
          </TabsTrigger>
          <TabsTrigger value="impact">
            <Globe className="h-4 w-4 mr-2" />
            Global Impact
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Eco Champions</h3>
            <div className="space-y-4">
              {leaderboard.map((entry, index) => (
                <div key={entry.userId} className={`flex items-center gap-4 p-4 rounded-lg ${
                  entry.userId === userId ? 'bg-primary/10 border-2 border-primary/20' : 'bg-accent/5'
                }`}>
                  <div className="text-2xl font-bold text-muted-foreground w-8">
                    #{index + 1}
                  </div>
                  
                  <Avatar>
                    <AvatarImage src={entry.avatar} />
                    <AvatarFallback>{entry.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground">{entry.userName}</h4>
                      <Badge variant="outline">{entry.badge}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Level {entry.level} • {entry.co2Saved}kg CO₂ saved • {entry.streak} day streak
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{entry.score.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Eco Points</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="mt-6">
          <div className="space-y-6">
            {challenges.map(challenge => (
              <Card key={challenge.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
                  </div>
                  <Badge variant="secondary">{challenge.category}</Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progress: {challenge.currentProgress}/{challenge.goal}</span>
                    <span>{Math.round((challenge.currentProgress / challenge.goal) * 100)}%</span>
                  </div>
                  <Progress value={(challenge.currentProgress / challenge.goal) * 100} className="h-2" />
                  
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {challenge.participants} participants
                      </span>
                      <span>Ends: {challenge.endDate.toLocaleDateString()}</span>
                    </div>
                    <Button onClick={() => joinChallenge(challenge.id)} size="sm">
                      Join Challenge
                    </Button>
                  </div>
                  
                  <div className="text-sm">
                    <strong>Reward:</strong> {challenge.reward}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="social" className="mt-6">
          <div className="space-y-6">
            {/* Create Post */}
            <Card className="p-4">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Input
                    placeholder="Share your eco journey..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button onClick={createPost} disabled={!newPostContent.trim()}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Social Feed */}
            {socialFeed.map(post => (
              <Card key={post.id} className="p-4">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarImage src={post.avatar} />
                    <AvatarFallback>{post.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground">{post.userName}</h4>
                        <span className="text-xs text-muted-foreground">
                          {post.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-foreground">{post.content}</p>
                    </div>
                    
                    {post.achievement && (
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{post.achievement.icon}</span>
                          <span className="font-medium text-yellow-800">
                            Achievement: {post.achievement.title}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {post.activity && (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-green-800">{post.activity.type}</span>
                          <span className="text-sm text-green-600">{post.activity.impact}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 pt-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleLike(post.id)}
                        className={post.liked ? 'text-red-500' : ''}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${post.liked ? 'fill-current' : ''}`} />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="impact" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-500" />
              Collective Global Impact
            </h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-700">Total CO₂ Reduced</span>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-800">2,847 tons</div>
                  <div className="text-xs text-green-600">By 15,432 community members</div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">Money Saved</span>
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-800">₹8.2 Cr</div>
                  <div className="text-xs text-blue-600">Community total savings</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">This Month's Achievements</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 1,234 car trips replaced with eco transport</li>
                    <li>• 5,678 plant-based meals chosen</li>
                    <li>• 890 energy-efficient upgrades made</li>
                    <li>• 456 second-hand purchases over new</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">Environmental Equivalents</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>🌳 130,540 trees planted equivalent</li>
                    <li>🏠 5,694 homes powered for a year</li>
                    <li>🚗 7.1M km of car travel avoided</li>
                    <li>💧 2.3M liters of water saved</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};