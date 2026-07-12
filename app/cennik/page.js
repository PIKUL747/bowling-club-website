import PageTransition from '../components/PageTransition'

export default function Cennik() {
  return (
    <PageTransition>
      <main>
        <section className="hero">
          <h1 className="neon-title">Cennik</h1>
          <p className="neon-subtitle">Przejrzyste ceny dla każdego!</p>

          <div className="info-grid" style={{marginTop: '50px'}}>

            {/* Bowling */}
            <div className="info-card" style={{width: '380px'}}>
              <h2>🎳 Bowling</h2>
              <div className="price-table">
                <div className="price-row">
                  <span>Pon - Czw (za godzinę)</span>
                  <span className="price">100 zł</span>
                </div>
                <div className="price-row">
                  <span>Pt - Nd i święta (za godzinę)</span>
                  <span className="price">120 zł</span>
                </div>
                <div className="price-row highlight">
                  <span>Wypożyczenie butów</span>
                  <span className="price">10 zł</span>
                </div>
              </div>
              <p style={{fontSize: '13px', color: '#606070', marginTop: '16px'}}>
                Cena za cały tor, niezależnie od liczby graczy (max 6 osób).
              </p>
            </div>

            {/* Bilard */}
            <div className="info-card" style={{width: '380px'}}>
              <h2>🎱 Bilard</h2>
              <div className="price-table">
                <div className="price-row">
                  <span>Pon - Czw (za godzinę)</span>
                  <span className="price">40 zł</span>
                </div>
                <div className="price-row">
                  <span>Pt - Nd i święta (za godzinę)</span>
                  <span className="price">50 zł</span>
                </div>
              </div>
              <p style={{fontSize: '13px', color: '#606070', marginTop: '16px'}}>
                Cena za stół bilardowy.
              </p>
            </div>

          </div>

          {/* Notice */}
          <div className="special-notice" style={{marginTop: '50px'}}>
            <h2>💡 Informacje dodatkowe</h2>
            <p>Rezerwacje grupowe, imprezy firmowe i okolicznościowe wyceniane są indywidualnie.</p>
            <p style={{marginTop: '12px'}}>Skontaktuj się z nami w celu uzyskania oferty:</p>
            <a href="tel:537523207" className="btn" style={{marginTop: '16px', display: 'inline-block'}}>
              <span style={{color: '#0ea5e9'}}>📞</span> 537 523 207
            </a>
          </div>

        </section>
      </main>
    </PageTransition>
  )
}