import React from 'react';
import { Box, IconButton, Typography, Link } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  return (
    
    <Box sx={{ backgroundColor: 'primary.main', color: 'white', p: 3, mt: 11 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center',  }}>
        <IconButton color="inherit" component={Link} href="https://www.facebook.com" target="_blank">
          <FacebookIcon />
        </IconButton>
        <IconButton color="inherit" component={Link} href="https://www.twitter.com" target="_blank">
          <TwitterIcon />
        </IconButton>
        <IconButton color="inherit" component={Link} href="https://www.linkedin.com" target="_blank">
          <LinkedInIcon />
        </IconButton>
        <IconButton color="inherit" component={Link} href="https://www.instagram.com" target="_blank">
          <InstagramIcon />
        </IconButton>
      </Box>

      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        &copy; {new Date().getFullYear()} Online Meeting System. All rights reserved.
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 1 }}>
        <Link href="#" color="inherit" underline="none">Privacy Policy</Link>
        <Link href="#" color="inherit" underline="none">Terms & Conditions</Link>
      </Box>
    </Box>
  );
}

export default Footer;
