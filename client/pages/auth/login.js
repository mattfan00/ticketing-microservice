import { useState } from "react"
import Router from "next/router"

import useRequest from "../../hooks/use-request"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { doRequest, errors} = useRequest({
    url: "/api/users/login",
    method: "post",
    body: {
      email, password
    },
    onSuccess: () => Router.push("/")
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    doRequest()
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      <div className="form-group">
        <label>Email</label>
        <input
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {errors}

      <button className="btn btn-primary">Login</button>
    </form>
  )
}

export default Login