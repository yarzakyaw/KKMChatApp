import '@/styles/globals.css'

//INTERNAL IMPORT
import { KKMChatAppProvider } from '@/Context/KKMChatAppContext';
import { NavBar } from '@/Components/index';

const MyApp = ({ Component, pageProps }) => (
  <div>
    <KKMChatAppProvider>
      <NavBar />
      <Component {...pageProps} />
    </KKMChatAppProvider>
  </div>
);

export default MyApp;