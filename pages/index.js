import 'bootstrap/dist/css/bootstrap.min.css';
import { css, keyframes } from '@emotion/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';

const buttonStyles = css`
  background-color: rgba(156, 85, 20, 1);
  border: none;
  font-size: 15px;
  margin-top: 60px;

  &:hover {
    background-color: rgba(156, 85, 20, 1);
  }
`;

const titleStyles = css`
  color: rgba(156, 85, 20, 1);
  font-size: 50px;
  font-weight: medium;
  margin-top: 60px;
`;

const listContainerStyles = css`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 60px;

  li {
    font-size: 20px;
    font-weight: medium;
    width: 400px;
    height: 40px;
    background: rgba(233, 233, 233, 0.8);
    color: rgba(75, 75, 75, 1);
    border-radius: 30px;
    text-align: left;
    padding: 5px 0px 5px 8px;
  }
`;

const fade = keyframes`
  0%    { opacity: 0; }
  100%  { opacity: 1; }

  li {
  animation-timing-function: ease-in-out;
    animation-iteration-count: 1;
}
`;

const listButtonContainer = css`
  display: flex;
  flex-direction: column;
`;

const heroContainerStyles = css`
  display: flex;
  flex-direction: row;
`;

const blobStyles = css`
  color: rgba(229, 208, 153, 0.38);
`;

export default function Home(props) {
  useEffect(() => {
    props
      .refreshUserProfile()
      .catch(() => console.log('refresh user profile failed'));
  }, [props]);

  return (
    <div>
      <Head>
        <title>Home page</title>

        <meta
          name="home page"
          content="intro to the app and brief description"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-apple-touch.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <Container>
        <main>
          <h1 css={titleStyles}>End inequality</h1>
          <h2>when it comes to house chores</h2>
          <div css={heroContainerStyles}>
            <div css={listButtonContainer}>
              <div>
                <ul css={listContainerStyles}>
                  <li
                    css={css`
                      animation: ${fade} 3s;
                    `}
                  >
                    Create your house project
                  </li>

                  <li
                    css={css`
                      animation: ${fade} 5s;
                    `}
                  >
                    Assign participants to your project
                  </li>

                  <li
                    css={css`
                      animation: ${fade} 7s;
                    `}
                  >
                    Add chores to the list
                  </li>

                  <li
                    css={css`
                      animation: ${fade} 9s;
                    `}
                  >
                    Divide chores equally among participants
                  </li>
                </ul>
              </div>
              <div>
                <Button css={buttonStyles}>
                  <Link href="/signup" css={buttonStyles}>
                    <a>Let`s get started!</a>
                  </Link>
                </Button>
              </div>
            </div>

            <div>
              <Image
                css={blobStyles}
                src="/blob1.svg"
                alt="random blob"
                width="800"
                height="500"
              />
            </div>
          </div>
        </main>
      </Container>
    </div>
  );
}
