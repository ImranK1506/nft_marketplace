import { ThemeProvider } from 'next-themes';
import Script from 'next/script';

// Internal imports
import '../styles/globals.css';
import { Navbar, Footer } from '../components';

const App = ({ Component, pageProps }) => (
  <ThemeProvider attribute="class">
    <div className="dark:bg-nft-dark bg-white min-h-screen">
      <Navbar />
      <div className="pt-65">
        <Component {...pageProps} />
      </div>
      <Footer />
    </div>
    <Script src="https://kit.fontawesome.com/15618391b7.js" crossOrigin="anonymous" />
  </ThemeProvider>
);

export default App;
