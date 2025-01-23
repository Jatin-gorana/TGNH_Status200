import React, { useState } from 'react';
import { 
  Users, 
  Upload, 
  Globe, 
  Trophy, 
  MessageSquare, 
  Blocks, 
  GraduationCap,
  Star,
  Award,
  Gem,
  Clock,
  CheckCircle2,
  Image as ImageIcon,
  Send,
  Heart,
  MessageCircle,
  Share2,
  Wallet,
  Coins,
  Box
} from 'lucide-react';

function Community() {
  const [selectedTab, setSelectedTab] = useState('collaboration');
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Mock user data
  const topContributors = [
    { name: "Alex Chen", points: 2500, contributions: 47, verified: true },
    { name: "Maria Garcia", points: 2100, contributions: 35, verified: true },
    { name: "John Smith", points: 1800, contributions: 29, verified: true }
  ];

  // Mock posts data
  const posts = [
    {
      id: 1,
      author: "Alex Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1",
      content: "Just finished 3D scanning the newly discovered Roman artifacts! Check out the preliminary results.",
      image: "https://images.unsplash.com/photo-1599940778173-e276d4acb2bb?ixlib=rb-4.0.3",
      likes: 24,
      comments: 8,
      timestamp: "2h ago",
      verified: true
    },
    {
      id: 2,
      author: "Maria Garcia",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1",
      content: "Working on the digital restoration of a 15th-century manuscript. The AI suggestions are incredibly helpful!",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3",
      likes: 18,
      comments: 5,
      timestamp: "4h ago",
      verified: true
    }
  ];

  // Mock NFT collections
  const nftCollections = [
    {
      id: 1,
      name: "Ancient Artifacts Series",
      image: "https://images.unsplash.com/photo-1618172193763-c511deb635ca?ixlib=rb-4.0.3",
      price: "0.5 ETH",
      items: 100,
      verified: true
    },
    {
      id: 2,
      name: "Digital Restorations",
      image: "https://images.unsplash.com/photo-1569778743811-d61078eb7c77?ixlib=rb-4.0.3",
      price: "0.3 ETH",
      items: 50,
      verified: true
    }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const renderCollaborationTools = () => (
    <div className="space-y-8">
      {/* Create Post Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-serif text-stone-800 mb-4">Create Post</h3>
        <div className="space-y-4">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your discoveries and insights..."
            className="w-full p-4 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            rows={3}
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-amber-700 hover:text-amber-800">
              <ImageIcon size={20} />
              <span>Add Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <button className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition-colors flex items-center gap-2">
              <Send size={18} />
              Post
            </button>
          </div>
          {selectedImage && (
            <div className="relative inline-block">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
                className="max-h-40 rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={post.avatar}
                alt={post.author}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{post.author}</h4>
                  {post.verified && (
                    <CheckCircle2 className="text-amber-700" size={16} />
                  )}
                </div>
                <p className="text-stone-500 text-sm">{post.timestamp}</p>
              </div>
            </div>
            <p className="mb-4">{post.content}</p>
            {post.image && (
              <img
                src={post.image}
                alt="Post content"
                className="w-full rounded-lg mb-4"
              />
            )}
            <div className="flex items-center gap-6 text-stone-600">
              <button className="flex items-center gap-2 hover:text-amber-700">
                <Heart size={20} />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 hover:text-amber-700">
                <MessageCircle size={20} />
                <span>{post.comments}</span>
              </button>
              <button className="flex items-center gap-2 hover:text-amber-700">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBlockchain = () => (
    <div className="space-y-8">
      {/* Wallet Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-serif text-stone-800 flex items-center gap-2">
            <Wallet className="text-amber-700" />
            Your Wallet
          </h3>
          <button className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition-colors">
            Connect Wallet
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-stone-50 p-4 rounded-lg">
            <h4 className="text-sm text-stone-600 mb-1">Balance</h4>
            <div className="flex items-center gap-2">
              <Coins className="text-amber-700" size={20} />
              <span className="font-semibold">2.5 ETH</span>
            </div>
          </div>
          <div className="bg-stone-50 p-4 rounded-lg">
            <h4 className="text-sm text-stone-600 mb-1">NFTs Owned</h4>
            <div className="flex items-center gap-2">
              <Box className="text-amber-700" size={20} />
              <span className="font-semibold">12</span>
            </div>
          </div>
          <div className="bg-stone-50 p-4 rounded-lg">
            <h4 className="text-sm text-stone-600 mb-1">Contributions</h4>
            <div className="flex items-center gap-2">
              <Star className="text-amber-700" size={20} />
              <span className="font-semibold">47</span>
            </div>
          </div>
        </div>
      </div>

      {/* NFT Collections */}
      <div className="space-y-4">
        <h3 className="text-xl font-serif text-stone-800 mb-6">Featured Collections</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {nftCollections.map((collection) => (
            <div key={collection.id} className="bg-white rounded-lg shadow-lg overflow-hidden group">
              <div className="relative">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {collection.verified && (
                  <div className="absolute top-4 right-4 bg-amber-700 text-white text-sm px-3 py-1 rounded-full">
                    Verified
                  </div>
                )}
              </div>
              <div className="p-6">
                <h4 className="font-serif text-lg mb-2">{collection.name}</h4>
                <div className="flex justify-between items-center text-stone-600 mb-4">
                  <span>Floor: {collection.price}</span>
                  <span>{collection.items} items</span>
                </div>
                <button className="w-full bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition-colors">
                  View Collection
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-stone-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif mb-6">Join Our Community</h1>
            <p className="text-xl text-stone-300 mb-12 max-w-2xl mx-auto">
              Collaborate, learn, and contribute to cultural preservation through blockchain-verified participation
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-lg border border-stone-200 p-1 bg-white shadow-md">
              {[
                { id: 'collaboration', icon: <Users size={20} />, label: 'Collaboration' },
                { id: 'blockchain', icon: <Blocks size={20} />, label: 'Blockchain' },
                { id: 'gamification', icon: <Trophy size={20} />, label: 'Rewards' },
                { id: 'mentorship', icon: <GraduationCap size={20} />, label: 'Mentorship' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-md transition-colors ${
                    selectedTab === tab.id
                      ? 'bg-amber-700 text-white'
                      : 'text-stone-600 hover:text-amber-700'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {selectedTab === 'collaboration' && renderCollaborationTools()}
            {selectedTab === 'blockchain' && renderBlockchain()}
            {selectedTab === 'gamification' && renderGamification()}
            {selectedTab === 'mentorship' && renderMentorship()}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Community;