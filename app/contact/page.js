export default function Contact() {
  return (
    <main>
      <section className="hero">
        <h1>Kontakt</h1>
        <p>Masz pytania? Jesteśmy do dyspozycji!</p>

        <div className="info-grid">
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
            <p style={{marginTop: '8px', fontSize: '13px', color: '#606070'}}>Pon-Czw: 15:00 - 00:00</p>
            <p style={{fontSize: '13px', color: '#606070'}}>Pt-Nd: 13:00 - 00:00</p>
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

        {/* Special reservations notice */}
        <div className="special-notice">
          <h2>🎉 Większe rezerwacje i imprezy okolicznościowe</h2>
          <p>
            Rezerwacje grupowe, imprezy okolicznościowe, spotkania firmowe oraz wszelkie
            specjalne życzenia (np. kilka torów na kilka godzin) wymagają wcześniejszego
            uzgodnienia z personelem lub managerem klubu.
          </p>
          <p style={{marginTop: '16px'}}>
            W takich przypadkach prosimy o kontakt telefoniczny:
          </p>
          <a href="tel:537523207" className="btn" style={{marginTop: '16px', display: 'inline-block'}}>
            📞 537 523 207
          </a>
          <p style={{marginTop: '16px', color: '#606070', fontSize: '14px'}}>
            Mniejsze rezerwacje (pojedyncze tory i stoły bilardowe) można składać
            bezpośrednio przez naszą stronę w zakładce Rezerwacje.
          </p>
        </div>
      </section>
    </main>
  )
}