import Link from "next/link"

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Register", href: "/auth/register"},
    !currentUser && { label: "Login", href: "/auth/login"},
    currentUser && { label: "Logout", href: "/auth/logout"},
  ]
    .filter(linkConfig => linkConfig) // filters out all the ones that are false
    .map(({ label, href}) => {
      return (
        <li key={label} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      )
    })

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {links}
        </ul>
      </div>
    </nav>
  )
}

export default Header