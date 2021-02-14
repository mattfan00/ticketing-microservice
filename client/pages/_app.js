import "bootstrap/dist/css/bootstrap.css"
import buildClient from "../api/build-client"

import Header from "../components/header"

const MyApp = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  )
}

MyApp.getInitialProps = async (appContext) => {
  const { data } = await buildClient(appContext.ctx).get("/api/users/current")

  // Execute getInitialProps for the page you are on as well
  let pageProps = {}
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx)
  }

  return {
    pageProps,
    ...data
  }
}

export default MyApp