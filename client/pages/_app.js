import 'bootstrap/dist/css/bootstrap.min.css';
import buildClient from '../api/build-client';
import Header from '../components/header';
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div className="container">
      <Header currentUser={currentUser} />
      <Component {...pageProps} currentUser={currentUser} />
    </div>
  );
};
AppComponent.getInitialProps = async (appContext) => {
  const client = await buildClient(appContext.ctx);
  try {
    const { data } = await client.get('/api/users/currentuser');

    let pageProps = {};
    if (appContext.Component.getInitialProps) {
      pageProps = appContext.Component.getInitialProps(appContext.ctx);
    }
    console.log(pageProps);
    console.log('User data:', data);
    return { pageProps, ...data }; // Ensure data is returned as an object
  } catch (error) {
    console.error(
      'Error fetching user data:',
      error.response ? error.response.data : error.message
    );
    return { pageProps: {}, currentUser: null }; // Return default value on failure
  }
};

export default AppComponent;
