"use client";

import { useState } from "react";
import { BookOpen, CheckCircle, Clock, Star } from "lucide-react";

interface Chapter {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  bookmarked: boolean;
  timeToComplete: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

const BTMMWorkbook = () => {
  const [chapters] = useState<Chapter[]>([
    {
      id: 1,
      title: "Introduction to BTMM",
      description: "Understanding the Beat The Market Makers methodology",
      completed: true,
      bookmarked: false,
      timeToComplete: "15 min",
      difficulty: "Beginner"
    },
    {
      id: 2,
      title: "EMA Food System",
      description: "Master the 5-13-50-200-800 EMA stack",
      completed: true,
      bookmarked: true,
      timeToComplete: "25 min",
      difficulty: "Beginner"
    },
    {
      id: 3,
      title: "8-Point Bias Algorithm",
      description: "Learn the bias calculation system",
      completed: false,
      bookmarked: true,
      timeToComplete: "30 min",
      difficulty: "Intermediate"
    },
    {
      id: 4,
      title: "Market Sessions Analysis",
      description: "Asian, London, and NY session dynamics",
      completed: false,
      bookmarked: false,
      timeToComplete: "35 min",
      difficulty: "Intermediate"
    },
    {
      id: 5,
      title: "OTE Zone Identification",
      description: "Optimal Trade Entry zones",
      completed: false,
      bookmarked: false,
      timeToComplete: "40 min",
      difficulty: "Advanced"
    },
    // Add more chapters to reach 44 total
    ...Array.from({ length: 39 }, (_, i) => ({
      id: i + 6,
      title: `Advanced BTMM Concept ${i + 1}`,
      description: `Learn advanced trading concepts and strategies`,
      completed: Math.random() > 0.7,
      bookmarked: Math.random() > 0.8,
      timeToComplete: `${20 + Math.floor(Math.random() * 40)} min`,
      difficulty: ["Beginner", "Intermediate", "Advanced"][Math.floor(Math.random() * 3)] as Chapter["difficulty"]
    }))
  ]);

  const completedChapters = chapters.filter(c => c.completed).length;
  const bookmarkedChapters = chapters.filter(c => c.bookmarked).length;
  const progressPercentage = (completedChapters / chapters.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            BTMM Trading Workbook
          </h1>
          <p className="text-gray-300 text-lg">
            Master Steve Mauro&apos;s Beat The Market Makers methodology through 44 comprehensive chapters
          </p>
        </div>

        {/* Progress Dashboard */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Progress</h3>
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completed</span>
                <span>{completedChapters}/{chapters.length}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="text-right text-sm text-gray-400">
                {progressPercentage.toFixed(1)}% Complete
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Bookmarks</h3>
              <Star className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {bookmarkedChapters}
            </div>
            <div className="text-sm text-gray-400">
              Chapters bookmarked for review
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Study Time</h3>
              <Clock className="h-6 w-6 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {Math.round(chapters.reduce((acc, ch) => acc + parseInt(ch.timeToComplete), 0) / 60)}h
            </div>
            <div className="text-sm text-gray-400">
              Total estimated time
            </div>
          </div>
        </div>

        {/* Chapter Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter) => (
            <div 
              key={chapter.id}
              className={`p-6 rounded-xl border transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
                chapter.completed 
                  ? 'bg-green-900/20 border-green-500/30 hover:border-green-400/50' 
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className={`h-5 w-5 ${chapter.completed ? 'text-green-400' : 'text-gray-400'}`} />
                  <span className="text-sm text-gray-400">Chapter {chapter.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  {chapter.completed && <CheckCircle className="h-5 w-5 text-green-400" />}
                  {chapter.bookmarked && <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />}
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2 text-white">
                {chapter.title}
              </h3>
              
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {chapter.description}
              </p>

              <div className="flex items-center justify-between text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  chapter.difficulty === 'Beginner' ? 'bg-green-900/30 text-green-400' :
                  chapter.difficulty === 'Intermediate' ? 'bg-yellow-900/30 text-yellow-400' :
                  'bg-red-900/30 text-red-400'
                }`}>
                  {chapter.difficulty}
                </span>
                <span className="text-gray-400 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {chapter.timeToComplete}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BTMMWorkbook;