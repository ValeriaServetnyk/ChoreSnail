import { css } from '@emotion/react';
import Image from 'next/image';
import Link from 'next/link';

const logoStyles = css`
  font-family: Indie Flower;
  color: rgba(156, 85, 20, 1);
  font-size: 30px;
  font-weight: bold;
`;

const logoContainer = css`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const buttonStyles = css`
  background-color: rgba(156, 85, 20, 1);
  border: none;
  font-size: 15px;

  &:hover {
    background-color: rgba(156, 85, 20, 1);
  }
`;
const usernameStyles = css`
  font-family: Indie Flower;
  color: rgba(156, 85, 20, 1);
  font-size: 20px;
  font-weight: bold;
  padding-right: 10px;
`;

export default function Header(props) {
  return (
    <header>
      <div css={logoContainer}>
        <div>
          <Image src="/logo.png" alt="app logo" width="80" height="80" />
        </div>
        <div>
          <Link href="/">
            <a css={logoStyles}>ChoreSnail</a>
          </Link>
        </div>
      </div>

      <div css={usernameStyles}>
        {props.user && (
          <Link href="/users/private-profile">{props.user.username}</Link>
        )}
      </div>
      {props.user ? (
        // using a instead of Link since we want to force a full refresh
        <button css={buttonStyles}>
          <a href="/logout">Logout</a>
        </button>
      ) : (
        <>
          <div>
            <button css={buttonStyles}>
              <Link href="/signup">Signup</Link>
            </button>
          </div>
          <div className="bg-light border">
            <button css={buttonStyles}>
              <Link href="/login">Login</Link>
            </button>
          </div>
        </>
      )}
    </header>
  );
}
