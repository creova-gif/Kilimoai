import { X, Play, Pause, Volume2, VolumeX, Maximize, Download } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

interface VideoPlayerProps {
  title: string;
  description: string;
  duration: string;
  language: string;
  onClose: () => void;
}

export function VideoPlayer({ title, description, duration, language, onClose }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  // Simulate video playback
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 100);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex-1">
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-sm text-gray-600">{duration} • {language}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative bg-gray-900 aspect-video">
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={handlePlayPause}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-green-600 hover:bg-green-700 transition-colors"
              >
                <Play className="h-10 w-10 text-white ml-1" />
              </button>
            </div>
          )}
          
          {/* Video placeholder/thumbnail */}
          <div className="w-full h-full flex items-center justify-center text-white">
            <div className="text-center">
              <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg opacity-75">Educational Video Content</p>
              <p className="text-sm opacity-50 mt-2">{description}</p>
            </div>
          </div>

          {/* Progress bar */}
          {isPlaying && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <div className="w-full bg-gray-600 rounded-full h-1 mb-3">
                <div 
                  className="bg-green-600 h-1 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePlayPause}
                    className="hover:text-green-400 transition-colors"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </button>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="hover:text-green-400 transition-colors"
                  >
                    {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                  </button>
                  <span className="text-sm">
                    {Math.floor((progress / 100) * parseInt(duration))}:{String(Math.floor(((progress / 100) * parseInt(duration) % 1) * 60)).padStart(2, '0')} / {duration}
                  </span>
                </div>
                <button className="hover:text-green-400 transition-colors">
                  <Maximize className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="p-4 space-y-4">
          <div>
            <h4 className="font-medium mb-2">About this video</h4>
            <p className="text-sm text-gray-700">{description}</p>
          </div>

          {/* Key Takeaways */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-4">
              <h4 className="font-medium text-green-900 mb-3">Key Takeaways:</h4>
              <ul className="space-y-2 text-sm text-green-800">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Proper fertilizer application increases yields by 30-40%</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Apply fertilizer 10cm away from plant base to prevent burning</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Best time is early morning or after light rain</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Always wear protective gloves when handling chemicals</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Download for Offline
            </Button>
            <Button variant="outline" className="flex-1">
              Share Video
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
