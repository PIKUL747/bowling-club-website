

export default function About() {
  return (
  
      <main>
        <section className="hero">
          <h1 className="neon-title">O nas</h1>
          <p className="neon-subtitle">Jesteśmy największym klubem rozrywkowym w Tarnowie!</p>

          <div className="info-grid" style={{marginTop: '60px'}}>
            <div className="info-card">
              <h2>🎳 Tory bowlingowe</h2>
              <p>6 profesjonalnych, w pełni zautomatyzowanych torów bowlingowych dostępnych dla graczy w każdym wieku.</p>
            </div>
            <div className="info-card">
              <h2>🎱 Bilard</h2>
              <p>4 profesjonalne stoły bilardowe dla miłośników tej klasycznej gry.</p>
            </div>
            <div className="info-card">
              <h2>🕐 Godziny otwarcia</h2>
              <p>Poniedziałek - Piątek: 15:00 - 00:00</p>
              <p>Sobota - Niedziela: 13:00 - 00:00</p>
            </div>
            <div className="info-card">
              <h2>🎰 Atrakcje</h2>
              <p>Gry symulacyjne, flipery, dart oraz obszerna kawiarnia i bar.</p>
            </div>
            <div className="info-card">
              <h2>🎉 Imprezy</h2>
              <p>Organizujemy imprezy okolicznościowe i imprezy firmowe. Skontaktuj się z nami!</p>
            </div>
            <div className="info-card">
              <h2>📍 Lokalizacja</h2>
              <p>Al. Tarnowskich 61</p>
              <p>33-100 Tarnów</p>
              <p style={{marginTop: '8px', fontSize: '13px', color: '#606070'}}>U stóp Góry św. Marcina</p>
            </div>
          </div>
        </section>
      </main>
   
  )
}