import PageTransition from './components/PageTransition'

export default function Home() {
  return (
    <PageTransition>
      <main>
        <section className="hero">
          <h1 className="neon-title">Witamy w Kwazar Bowling Club!</h1>
          <p className="neon-subtitle">6 torów bowlingowych • 4 stoły bilardowe</p>
          <p className="neon-subtitle">
            Pon-Pt: <span style={{color: '#0ea5e9'}}>15:00 - 00:00</span> &nbsp;|&nbsp; Sob-Nd: <span style={{color: '#0ea5e9'}}>13:00 - 00:00</span>
          </p>
          <a href="/reservations">
            <button className="btn" style={{marginTop: '30px'}}>Zrób rezerwację</button>
          </a>

          <div className="gallery-section">
            <h2 style={{color: '#a0a0b0', fontSize: '18px', marginBottom: '24px'}}>Galeria</h2>
            <div className="gallery-grid">
              <div className="gallery-placeholder">
                <span style={{color: '#a0a0b0', fontSize: '14px'}}>Zdjęcie 1</span>
              </div>
              <div className="gallery-placeholder">
                <span style={{color: '#a0a0b0', fontSize: '14px'}}>Zdjęcie 2</span>
              </div>
              <div className="gallery-placeholder">
                <span style={{color: '#a0a0b0', fontSize: '14px'}}>Zdjęcie 3</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  )
}