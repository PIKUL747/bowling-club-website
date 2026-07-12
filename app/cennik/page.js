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
                  <span>Poniedziałek - Czwartek</span>
                  <span className="price">75 zł / h</span>
                </div>
                <div className="price-row">
                  <span>Piątek - Sobota</span>
                  <span className="price">120 zł / h</span>
                </div>
                <div className="price-row">
                  <span>Niedziela</span>
                  <span className="price">100 zł / h</span>
                </div>
              </div>
              <div style={{marginTop: '20px', padding: '14px', backgroundColor: '#0a0a0f', borderRadius: '8px', border: '1px solid #1e3a5f'}}>
                <p style={{fontSize: '14px', color: '#a0a0b0', lineHeight: '1.7'}}>
                  ✅ Cena obejmuje <strong style={{color: 'white'}}>do 4 osób</strong> na torze.<br/>
                  👟 Za 5. i 6. osobę doliczana jest jednorazowa opłata za wynajem butów.
                </p>
              </div>
            </div>

            {/* Bilard */}
            <div className="info-card" style={{width: '380px'}}>
              <h2>🎱 Bilard</h2>
              <div className="price-table">
                <div className="price-row">
                  <span>Poniedziałek - Czwartek</span>
                  <span className="price">40 zł / h</span>
                </div>
                <div className="price-row">
                  <span>Piątek - Niedziela</span>
                  <span className="price">45 zł / h</span>
                </div>
              </div>
              <p style={{fontSize: '13px', color: '#606070', marginTop: '16px'}}>
                Cena za stół bilardowy.
              </p>
            </div>

          </div>

          {/* Notice */}
          <div className="special-notice" style={{marginTop: '50px'}}>
            <h2>💡 Rezerwacje grupowe i imprezy</h2>
            <p>Rezerwacje grupowe, imprezy firmowe i okolicznościowe wyceniane są indywidualnie. Skontaktuj się z nami w celu uzyskania oferty.</p>
            <a href="tel:537523207" className="btn" style={{marginTop: '20px', display: 'inline-block'}}>
              <span style={{color: '#0ea5e9'}}>📞</span> 537 523 207
            </a>
          </div>

        </section>
      </main>
    </PageTransition>
  )
}