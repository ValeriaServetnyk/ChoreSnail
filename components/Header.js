import { css } from '@emotion/react';
import { Button, Container } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

const headerStyles = css`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 1rem;
`;

const logoStyles = css`
  font-family: Indie Flower;
  color: rgba(156, 85, 20, 1);
  font-size: 30px;
  font-weight: bold;
`;

const logoContainer = css`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const buttonStyles = css`
  background-color: rgba(156, 85, 20, 1);
  border: none;
  font-size: 10px;
  color: white;
  margin-right: 5px;
  &:hover {
    background-color: rgba(156, 85, 20, 0.8);
  }
`;
const usernameStyles = css`
  font-family: Indie Flower;
  color: rgba(156, 85, 20, 1);
  font-size: 20px;
  font-weight: bold;
`;

const loginContainer = css`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`;

const emptyButtonStyles = css`
  border-color: rgba(156, 85, 20, 1);

  font-size: 10px;

  color: rgba(156, 85, 20, 1);

  &:hover {
    background-color: rgba(156, 85, 20, 0.3);
    border-color: rgba(156, 85, 20, 1);
  }
`;

export default function Header(props) {
  return (
    <Container>
      <header css={headerStyles}>
        <div css={logoContainer}>
          <div>
            <Image
              src="/logo.png"
              alt="Choresnail logo"
              width="80"
              height="80"
            />
          </div>
          <div>
            <Link href="/" cursor="pointer">
              <a css={logoStyles}>ChoreSnail</a>
            </Link>
          </div>
        </div>
        <div css={loginContainer}>
          <div css={usernameStyles}>
            {props.user && (
              <Link href="/users/private-profile">{props.user.username}</Link>
            )}
          </div>
          <div>
            {props.user ? (
              // using a instead of Link since we want to force a full refresh
              <Button css={emptyButtonStyles} variant="outlined" href="/logout">
                Logout
              </Button>
            ) : (
              <>
                <Button css={buttonStyles} href="/signup">
                  Signup
                </Button>

                <Button css={buttonStyles} href="/login">
                  Login
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
    </Container>
  );
}
