export default function Contact() {
  return (
    <main>
      <section className="hero">
        <h1 className="neon-title">Kontakt</h1>
        <p className="neon-subtitle">Masz pytania? Jesteśmy do dyspozycji!</p>

        <div className="info-grid" style={{marginTop: '40px'}}>
          <div className="info-card">
            <h2>📍 Adres</h2>
            <p>Al. Tarnowskich 61</p>
            <p>33-100 Tarnów</p>
            <p style={{marginTop: '8px', fontSize: '13px', color: '#606070'}}>U stóp Góry św. Marcina</p>
          </div>
          <div className="info-card">
            <h2>📞 Telefon</h2>
            <p>
              <a href="tel:537523207" style={{color: '#0ea5e9', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold'}}>
                537 523 207
              </a>
            </p>
            <p style={{marginTop: '8px', fontSize: '13px', color: '#606070'}}>Pon-Pt: 15:00 - 00:00</p>
            <p style={{fontSize: '13px', color: '#606070'}}>Sob-Nd: 13:00 - 00:00</p>
          </div>
          <div className="info-card">
            <h2>📧 Email</h2>
            <p>
              <a href="mailto:kwazarbowling@gmail.com" style={{color: '#0ea5e9', textDecoration: 'none'}}>
                kwazarbowling@gmail.com
              </a>
            </p>
          </div>
        </div>

        <div className="special-notice">
          <h2>📞 Rezerwacje</h2>
          <p>
            Wszystkie rezerwacje — zarówno indywidualne jak i grupowe, imprezy okolicznościowe
            oraz imprezy firmowe — są przyjmowane wyłącznie telefonicznie.
            Nasz personel wprowadzi rezerwację do systemu po uzgodnieniu szczegółów.
          </p>
          <p style={{marginTop: '16px'}}>
            Zadzwoń do nas:
          </p>
          <a href="tel:537523207" className="btn" style={{marginTop: '16px', display: 'inline-block'}}>
            <span style={{color: '#0ea5e9'}}>📞</span> 537 523 207
          </a>
        </div>
      </section>
    </main>
  )
}