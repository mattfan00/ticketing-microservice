import { useEffect } from "react"
import Router from "next/router"
import useRequest from "../../hooks/use-request"

const Logout = () => {
  const { doRequest } = useRequest({
    url: "/api/users/logout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/")
  })

  useEffect(() => {
    doRequest()
  }, [])

  return <div>Logging you out...</div>
}

export default Logout