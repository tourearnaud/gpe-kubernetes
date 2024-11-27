import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { RouterLink } from 'src/routes/components';
import Image from '../image';

// ----------------------------------------------------------------------

const Logo = forwardRef(
  (
    { disabledLink = false, sizeWidth, sizeHeight, maxSizeHeight, maxSizeWidth, sx, ...other },
    ref
  ) => {
    const logo = (
      <Box
        ref={ref}
        component="div"
        sx={{
          width: sizeWidth ?? 40,
          height: sizeHeight ?? 40,
          display: 'inline-flex',
          ...sx,
        }}
        {...other}
      >
        <Image
          disabledEffect
          visibleByDefault
          alt="overview"
          src="/favicon/logo.png"
          sx={{ maxWidth: maxSizeWidth ?? 200, maxHeight: maxSizeHeight ?? 200 }}
        />
      </Box>
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
  sizeWidth: PropTypes.number,
  sizeHeight: PropTypes.number,
  maxSizeWidth: PropTypes.number,
  maxSizeHeight: PropTypes.number,
};

export default Logo;
