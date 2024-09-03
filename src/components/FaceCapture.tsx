import React, { useRef, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import * as faceapi from 'face-api.js';
import Overlay from './Overlay';

interface FaceCaptureProps {
  onCaptureComplete: (images: string[]) => void;
  captureDelay?: number;
}

const FaceCapture: React.FC<FaceCaptureProps> = ({ onCaptureComplete, captureDelay = 2000 }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [isFaceWellFramed, setIsFaceWellFramed] = useState(false);
  const [isFaceCentralized, setIsFaceCentralized] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const MIN_FACE_SIZE_PERCENT = 10;
  const MAX_FACE_SIZE_PERCENT = 50;
  const CENTRALIZATION_TOLERANCE_PERCENT = 10;

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    };

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setTimeout(handleVideoPlay, captureDelay);
          };
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    loadModels().then(startVideo);

    const captureImage = (): string => {
      if (videoRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          return canvas.toDataURL('image/jpeg');
        }
      }
      return '';
    };

    const captureImages = async () => {
      const capturedImages: string[] = [];
      for (let i = 0; i < 4; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const image = captureImage();
        if (image) {
          capturedImages.push(image);
        }
      }
      onCaptureComplete(capturedImages);
      setIsCapturing(false); // Finaliza a captura
    };

    const isFaceCentralized = (faceBox: faceapi.Box, videoWidth: number, videoHeight: number): boolean => {
      const centerX = faceBox.x + (faceBox.width / 2);
      const centerY = faceBox.y + (faceBox.height / 2);

      const frameCenterX = videoWidth / 2;
      const frameCenterY = videoHeight / 2;

      const toleranceX = (videoWidth * CENTRALIZATION_TOLERANCE_PERCENT) / 100;
      const toleranceY = (videoHeight * CENTRALIZATION_TOLERANCE_PERCENT) / 100;

      const isCenteredX = Math.abs(centerX - frameCenterX) <= toleranceX;
      const isCenteredY = Math.abs(centerY - frameCenterY) <= toleranceY;

      return isCenteredX && isCenteredY;
    };

    const handleVideoPlay = () => {
      const interval = window.setInterval(async () => {
        if (videoRef.current) {
          const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks();

          if (detections.length === 1) {
            const videoWidth = videoRef.current?.videoWidth || 0;
            const videoHeight = videoRef.current?.videoHeight || 0;

            const faceBox = detections[0].detection.box;
            const faceWidthPercent = (faceBox.width / videoWidth) * 100;
            const faceHeightPercent = (faceBox.height / videoHeight) * 100;

            const isWellFramed = faceWidthPercent >= MIN_FACE_SIZE_PERCENT && faceWidthPercent <= MAX_FACE_SIZE_PERCENT &&
                                 faceHeightPercent >= MIN_FACE_SIZE_PERCENT && faceHeightPercent <= MAX_FACE_SIZE_PERCENT;

            const isCentralized = isFaceCentralized(faceBox, videoWidth, videoHeight);

            setIsFaceDetected(true);
            setIsFaceWellFramed(isWellFramed);
            setIsFaceCentralized(isCentralized);

            if (isWellFramed && isCentralized && !isCapturing) {
              setIsCapturing(true);
              captureImages();
            }

            // Se o rosto não for mais bem enquadrado ou centralizado, interrompe a captura
            if (!isWellFramed || !isCentralized) {
              clearInterval(interval);
              setIsCapturing(false);
            }

          } else {
            // Se o rosto deixar de ser detectado, interrompe a captura
            setIsFaceDetected(false);
            setIsFaceWellFramed(false);
            setIsFaceCentralized(false);
            clearInterval(interval);
            setIsCapturing(false);
          }
        }
      }, 100);
    };

    return () => {
      if (isCapturing) {
        setIsCapturing(false);
      }
    };
  }, [onCaptureComplete, captureDelay]);

  return (
    <Box position="relative" display="flex" justifyContent="center" sx={{ aspectRatio: '1 / 1' }}> {/* Proporção 1:1 */}
      <video ref={videoRef} autoPlay muted style={{ width: '100%', height: 'auto' }} />
      <Overlay 
        isFaceDetected={isFaceDetected} 
        isFaceWellFramed={isFaceWellFramed} 
        isFaceCentralized={isFaceCentralized} 
      />
    </Box>
  );
};

export default FaceCapture;
