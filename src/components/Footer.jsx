import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{
      bgcolor: 'background.paper',
      borderTop: '1px solid',
      borderColor: 'divider',
      py: 3
    }}>
      <Container maxWidth="xl" sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        flexWrap: 'wrap'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            component="img"
            src="/Logo-BPS.png"
            alt="Logo BPS"
            sx={{ 
              width: 32,
              height: 32,
              objectFit: 'contain'
            }}
          />
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
            Badan Pusat Statistik Kota Batu
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          PODES 2024 • Data untuk Pembangunan Desa
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
