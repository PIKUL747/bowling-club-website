import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="navbar">
      <a href="/" className="navbar-logo">
        <Image
          src="/logo.png"
          alt="Kwazar Bowling Club"
          width={80}
          height={80}
          style={{objectFit: 'contain'}}
        />
      </a>
      <div className="nav-links">
        <a href="/">Strona główna</a>
        <a href="/about">O nas</a>
        <a href="/reservations">Rezerwacje</a>
        <a href="/contact">Kontakt</a>
      </div>
    </nav>
  )
}