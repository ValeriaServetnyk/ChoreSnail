import { css } from '@emotion/react';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const footerStyles = css`
  display: flex;
  justify-content: center;
`;
export default function StickyFooter() {
  return (
    <Container maxWidth="sm" css={footerStyles}>
      <Typography variant="body2" color="text.secondary">
        Copyright ©{' '}
        <Link color="inherit" href="hhttp://localhost:3000/">
          Choresnail
        </Link>{' '}
        {new Date().getFullYear()}
      </Typography>
    </Container>
  );
}
