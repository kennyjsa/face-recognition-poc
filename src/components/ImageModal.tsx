import React from 'react';
import { Modal, Box, Stack, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ImageModalProps {
  isOpen: boolean;
  images: string[];
  onClose: () => void;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};


const ImageModal: React.FC<ImageModalProps> = ({ isOpen, images, onClose }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      
      <Box sx={{ ...style, width: 400 }}
        borderRadius={2}
        boxShadow={24}
      >
        <IconButton 
          aria-label="close" 
          onClick={onClose} 
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Stack flexDirection='row'>
          {images.map((image, index) => (
            <Box key={index} width="100%" margin={2}>
              <img src={image} alt={`Captured ${index + 1}`} style={{ width: '100%' }} />
            </Box>
          ))}
        </Stack>
      </Box>
    </Modal>
  );
};

export default ImageModal;
