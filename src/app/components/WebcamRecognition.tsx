import { Camera, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface WebcamRecognitionProps {
  targetLetter?: string;
  isRecognizing?: boolean;
  onStartRecognition?: () => void;
  onStopRecognition?: () => void;
}

export function WebcamRecognition({ 
  targetLetter = 'A', 
  isRecognizing = false,
  onStartRecognition,
  onStopRecognition 
}: WebcamRecognitionProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Webcam Preview */}
        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-3">
              <Camera className="w-16 h-16 mx-auto text-gray-600" />
              <p className="text-gray-400">Webcam Preview</p>
              <p className="text-sm text-gray-500">Camera access required for hand recognition</p>
            </div>
          </div>
          
          {/* Recognition Overlay */}
          {isRecognizing && (
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <div className="bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg">
                <p className="text-white text-sm">Target: <span className="font-bold text-lg">{targetLetter}</span></p>
              </div>
              <div className="bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <p className="text-white text-sm">Recording</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recognition Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
              <span className="text-2xl font-bold text-gray-700">{targetLetter}</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Practice Letter {targetLetter}</p>
              <p className="text-sm text-gray-500">Position your hand in view</p>
            </div>
          </div>
          
          {isRecognizing ? (
            <Button variant="destructive" onClick={onStopRecognition}>
              Stop
            </Button>
          ) : (
            <Button onClick={onStartRecognition}>
              <Camera className="w-4 h-4 mr-2" />
              Start
            </Button>
          )}
        </div>

        {/* Mock Recognition Results */}
        {isRecognizing && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Recognition Results:</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">{targetLetter}</span>
                </div>
                <span className="text-green-700 font-medium">95%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">B</span>
                </div>
                <span className="text-gray-500">12%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
