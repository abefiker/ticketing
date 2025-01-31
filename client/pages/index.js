import buildClient from '../api/build-client';

const LandingPage = ({currentUser}) => {
  console.log(currentUser)
  return currentUser? <h1>You are signed in</h1> : <h1>You are not signed in</h1>;
};

// LandingPage.getInitialProps = async (context) => {
//   console.log('Landing Page');
//   try {
//     const client = await buildClient(context);
//     const { data } = await client.get('/api/users/currentuser');
//     console.log('Raw API Response:', data);

//     return data ;
//     // Ensure we return an object with the `current` key
//     // return {data};
//   } catch (error) {
//     console.error(
//       'Error fetching currentUser:',
//       error.response ? error.response.data : error.message
//     );
//     return { current: null }; // Always return an object
//   }
// };

export default LandingPage;
