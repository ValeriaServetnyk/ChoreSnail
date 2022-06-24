import Image from 'next/image';
import Link from 'next/link';

export default function Layout(props) {
  return (
<div>
<header>
<div>
  <Image src="/logo.png" alt="app logo"
  width="80"
  height="80"
  />
  <Link href="/home">ChoreSnail</Link></div>
</header>
<div>
{props.children}
</div>
<footer>
        All rights reserved
      </footer>
</div>
  )
}

// content of every page incl header and footer. Props.children goes in between footer and header of every page