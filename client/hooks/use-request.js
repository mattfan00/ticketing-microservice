import { useState } from "react"
import axios from "axios"

const useRequest = ({ url, method, body, onSuccess}) => {
  const [errors, setErrors] = useState(null)

  const doRequest = async () => {
    try {
      setErrors(null)
      const response = await axios[method](url, body)

      if (onSuccess) {
        onSuccess(response.data)
      }

    } catch(err) {
      console.log(err.response)
      setErrors(
        <div className="alert alert-danger">
          <ul className="m-0">
            {err.response.data.errors.map(err => (
              <li>{err.message}</li>
            ))}
          </ul>
        </div>
      )
    }
  }

  return { doRequest, errors }
}

export default useRequest