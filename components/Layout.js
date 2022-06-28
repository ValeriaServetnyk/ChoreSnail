import Image from 'next/image';
import Link from 'next/link';
import Header from './Header';

export default function Layout(props) {
  return (
    <div>
      <Header />
      <div>{props.children}</div>
      <footer>All rights reserved</footer>
    </div>
  );
}

// content of every page incl header and footer. Props.children goes in between footer and header of every page
