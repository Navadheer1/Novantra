"use client";

import React, { useState } from "react";
import { BookOpen, Trophy, Play, CheckCircle, Circle, Award, ArrowLeft, Hourglass, BarChart } from "lucide-react";
import { LearningPath, LearningLesson } from "./types";
import { mockLearningPaths } from "./mockDiscoveryData";

interface LearningPathsProps {
  onSelectVideo: (videoId: string) => void;
}

export default function LearningPaths({ onSelectVideo }: LearningPathsProps) {
  const [paths, setPaths] = useState<LearningPath[]>(mockLearningPaths);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);

  const toggleLessonComplete = (pathId: string, lessonId: string) => {
    setPaths((prev) =>
      prev.map((path) => {
        if (path.id !== pathId) return path;

        const updatedLessons = path.lessons.map((les) => {
          if (les.id !== lessonId) return les;
          return { ...les, completed: !les.completed };
        });

        const completedCount = updatedLessons.filter((l) => l.completed).length;
        const progress = Math.round((completedCount / updatedLessons.length) * 100);

        return {
          ...path,
          lessons: updatedLessons,
          progress,
          completed: progress === 100
        };
      })
    );

    // Update local state if viewing details
    if (selectedPath && selectedPath.id === pathId) {
      setSelectedPath((prev) => {
        if (!prev) return null;
        const updatedLessons = prev.lessons.map((les) => {
          if (les.id !== lessonId) return les;
          return { ...les, completed: !les.completed };
        });
        const completedCount = updatedLessons.filter((l) => l.completed).length;
        const progress = Math.round((completedCount / updatedLessons.length) * 100);
        return {
          ...prev,
          lessons: updatedLessons,
          progress,
          completed: progress === 100
        };
      });
    }
  };

  const handleStartLesson = (lesson: LearningLesson) => {
    onSelectVideo(lesson.videoId);
  };

  // Detailed syllabus view
  if (selectedPath) {
    return (
      <div className="space-y-6 w-full pb-10">
        
        {/* Back Button */}
        <button
          onClick={() => setSelectedPath(null)}
          className="text-xs font-bold text-neutral-450 hover:text-neutral-900 dark:hover:text-white transition flex items-center space-x-1"
        >
          ← Back to Learning Tracks
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Syllabus Outline */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl space-y-4 shadow-xs">
              <div>
                <span className="text-[10px] bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  {selectedPath.difficulty} Path
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-3">{selectedPath.title}</h1>
                <p className="text-xs sm:text-sm text-neutral-500 font-semibold mt-1">{selectedPath.description}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 border-t border-neutral-100 dark:border-neutral-850 pt-4">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-neutral-500">Track Progress</span>
                  <span className="text-neutral-900 dark:text-white">{selectedPath.progress}% Complete</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-850 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-neutral-900 dark:bg-white transition-all duration-500"
                    style={{ width: `${selectedPath.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Syllabus Lessons list */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Course Curriculum</h3>
              <div className="space-y-3.5">
                {selectedPath.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-4 rounded-2xl hover:border-neutral-350 dark:hover:border-neutral-700 transition"
                  >
                    <div className="flex items-center space-x-3.5">
                      {/* Checkbox trigger */}
                      <button
                        onClick={() => toggleLessonComplete(selectedPath.id, lesson.id)}
                        className="focus:outline-none text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition"
                      >
                        {lesson.completed ? (
                          <CheckCircle className="w-5.5 h-5.5 text-neutral-900 dark:text-white fill-current" />
                        ) : (
                          <Circle className="w-5.5 h-5.5" />
                        )}
                      </button>
                      <div>
                        <h4 className={`text-xs sm:text-sm font-bold text-neutral-900 dark:text-white ${
                          lesson.completed ? "line-through text-neutral-400 dark:text-neutral-500" : ""
                        }`}>
                          {lesson.position}. {lesson.title}
                        </h4>
                        <span className="text-[10px] sm:text-xs text-neutral-450 font-bold">
                          {Math.floor(lesson.duration / 60)} min watch
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartLesson(lesson)}
                      className="bg-neutral-105 dark:bg-neutral-800 text-neutral-800 dark:text-white p-2 rounded-xl hover:bg-neutral-200 transition focus:outline-none"
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Instructor & Certificate Preview */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Instructor Details Card */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-3xl shadow-xs space-y-4">
              <h3 className="text-xs uppercase tracking-wider font-bold text-neutral-400">Track Instructor</h3>
              <div className="flex items-center space-x-3">
                <img src={selectedPath.instructor.avatar} alt="Instructor" className="w-11 h-11 rounded-full object-cover border" />
                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-white text-xs sm:text-sm">{selectedPath.instructor.name}</h4>
                  <p className="text-[10px] sm:text-xs text-neutral-500 font-semibold">{selectedPath.instructor.title}</p>
                </div>
              </div>
            </div>

            {/* Certificate Widget */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-3xl shadow-xs space-y-4 text-center">
              <div className="flex justify-center">
                <Award className={`w-12 h-12 ${
                  selectedPath.completed ? "text-emerald-500" : "text-neutral-300"
                }`} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Credentials Certificate</h3>
                <p className="text-[10px] sm:text-xs text-neutral-450 leading-relaxed font-semibold">
                  Complete 100% of this learning path to generate your credential certification.
                </p>
              </div>
              
              {selectedPath.completed ? (
                <div className="border border-emerald-100 bg-emerald-50/20 rounded-xl p-3 text-[10px] text-emerald-650 font-bold flex items-center justify-center space-x-2">
                  <Trophy className="w-4 h-4" />
                  <span>Certificate Ready to Download</span>
                </div>
              ) : (
                <button disabled className="w-full bg-neutral-100 dark:bg-neutral-850 text-neutral-400 py-2.5 rounded-xl text-xs font-bold transition">
                  Locked
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Browse List view
  return (
    <div className="space-y-6 w-full pb-10 animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paths.map((path) => (
          <div
            key={path.id}
            onClick={() => setSelectedPath(path)}
            className="group cursor-pointer bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-2xl shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition flex flex-col justify-between h-72"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] bg-neutral-100 dark:bg-neutral-850 text-neutral-500 font-bold px-2.5 py-0.5 rounded-full">
                  {path.lessons.length} Lessons
                </span>
                <span className="text-[10px] text-neutral-450 font-semibold">{path.difficulty}</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition leading-snug">
                {path.title}
              </h3>
              <p className="text-xs text-neutral-455 line-clamp-3 leading-relaxed font-semibold">
                {path.description}
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-850">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-neutral-505">Syllabus Completed</span>
                <span className="text-neutral-900 dark:text-white">{path.progress}%</span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-neutral-900 dark:bg-white" style={{ width: `${path.progress}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
