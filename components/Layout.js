import Footer from './Footer';
import Header from './Header';

export default function Layout(props) {
  return (
    <div>
      <Header user={props.user} refreshUserProfile={props.refreshUserProfile} />
      <div>{props.children}</div>
      <Footer />
    </div>
  );
}

// content of every page incl header and footer. Props.children goes in between footer and header of every page
