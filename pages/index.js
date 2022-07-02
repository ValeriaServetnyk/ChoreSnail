import { css, keyframes } from '@emotion/react';
import { Button, Container } from '@mui/material';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect } from 'react';

const buttonStyles = css`
  background-color: rgba(156, 85, 20, 1);
  border: none;
  font-size: 15px;
  margin-top: 60px;

  color: white;

  a {
    font-family: Nunito;
  }
  &:hover {
    background-color: rgba(156, 85, 20, 0.8);
  }
`;

const titleStyles = css`
  color: rgba(156, 85, 20, 1);
  font-size: 50px;
  font-weight: medium;
  margin-top: 80px;
  margin-bottom: 0px;
`;

const listContainerStyles = css`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 60px;
  li {
    font-size: 15px;
    font-weight: medium;
    width: 300px;
    height: 45px;
    background: rgba(233, 233, 233, 0.8);
    color: rgba(75, 75, 75, 1);
    border-radius: 30px;
    text-align: left;
    padding: 12px 0px 12px 10px;
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
  gap: 100px;
  margin: 0px;
  padding: 0px;
`;

const blobStyles = css`
  margin: -20px 0px 0px -50px;
`;

const pageLayout = css`
  min-height: 100vh;
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
        <main css={pageLayout}>
          <div>
            <h1 css={titleStyles}>END INEQUALITY</h1>
            <h1>when it comes to house chores!</h1>
          </div>

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
                <Button css={buttonStyles} href="/signup">
                  <a>Let`s get started!</a>
                </Button>
              </div>
            </div>
            <div>
              <Image
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
