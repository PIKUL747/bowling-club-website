export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">🎳 Bowling Club</div>
      <div className="nav-links">
        <a href="/">Strona główna</a>
        <a href="/about">O nas</a>
        <a href="/reservations">Rezerwacje</a>
        <a href="/contact">Kontakt</a>
      </div>
    </nav>
  )
}