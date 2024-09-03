import React from 'react';
import { Box } from '@mui/material';

interface OverlayProps {
  isFaceDetected: boolean;
  isFaceWellFramed: boolean;
  isFaceCentralized: boolean;
}

const Overlay: React.FC<OverlayProps> = ({ isFaceDetected, isFaceWellFramed, isFaceCentralized }) => {
  let strokeColor = 'red';
  if (isFaceDetected && isFaceWellFramed && isFaceCentralized) {
    strokeColor = 'green';
  } else if (isFaceDetected) {
    strokeColor = 'yellow';
  }

  return (
    <Box position="absolute" top={0} left={0} width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="50" rx="25" ry="25" stroke={strokeColor} strokeWidth="2" fill="none" />
      </svg>
    </Box>
  );
};

export default Overlay;
