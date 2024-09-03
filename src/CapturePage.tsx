import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import FaceCapture from './components/FaceCapture';
import ImageModal from './components/ImageModal';

const CapturePage: React.FC = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCaptureComplete = (images: string[]) => {
    console.log(images)
    setCapturedImages(images);
    setIsCapturing(false);
    setIsModalOpen(true);
  };

  const startCapture = () => {
    setIsCapturing(true);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Typography variant="h4" gutterBottom>
        Face Recognition POC
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={startCapture} 
        disabled={isCapturing}
        sx={{ marginBottom: 2 }}
      >
        Iniciar Captura
      </Button>
      {isCapturing && <FaceCapture onCaptureComplete={handleCaptureComplete} />}
      <ImageModal isOpen={isModalOpen} images={capturedImages} onClose={() => setIsModalOpen(false)} />
    </Box>
  );
};

export default CapturePage;
