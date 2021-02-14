import buildClient from "../api/build-client"

const Index = ({ currentUser }) => {
  return currentUser ? <h1>You are logged in</h1> : <h1>You are not logged in</h1>
}

/*
  Two scenarios where this is called

  1. Either typing the link in URL or refreshing the page, getInitialProps
  will execute on the server and then return the rendered page

  2. If navigating to the page within the app, getInitialProps will
  execute on the client side
*/
Index.getInitialProps = async (context) => {
  const { data } = await buildClient(context).get("/api/users/current")

  return data
}

export default Index