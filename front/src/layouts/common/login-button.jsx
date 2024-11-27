import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { useBoolean } from 'src/hooks/use-boolean';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { JwtLoginView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function LoginButton({ sx }) {
  const openLogin = useBoolean();
  return (
    <>
      <Button onClick={openLogin.onTrue} variant="outlined" sx={{ mr: 1, ...sx }}>
        Se connecter
      </Button>
      <Dialog fullWidth maxWidth="xs" open={openLogin.value} onClose={openLogin.onFalse}>
        <DialogTitle> Connectez-vous pour profiter pleinement de GPE </DialogTitle>
        <DialogContent sx={{ overflow: 'unset' }}>
          <JwtLoginView />
        </DialogContent>
      </Dialog>
    </>
  );
}

LoginButton.propTypes = {
  sx: PropTypes.object,
};
