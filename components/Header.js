import Image from 'next/image';
// import { css } from '@emotion/react';
import Link from 'next/link';

export default function Header(props) {
  return (
    <header>
      <div>
        <Image src="/logo.png" alt="app logo" width="80" height="80" />
        <Link href="/">ChoreSnail</Link>
      </div>
      {props.user && (
        <Link href="/users/private-profile">{props.user.username}</Link>
      )}
      {/* {props.user ? (
        // using a instead of Link since we want to force a full refresh
        <a href="/logout">Logout</a>
      ) : (
        <>
          <Link href="/signup">Signup</Link>
          <Link href="/login">Login</Link>
        </>
      )} */}
    </header>
  );
}
