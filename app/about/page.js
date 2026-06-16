export default function About() {
  return (
    <main>
      <section className="hero">
        <h1>O nas</h1>
        <p>Jesteśmy rodzinnym klubem bowlingowym z wieloletnią tradycją.</p>

        <div className="info-grid">
          <div className="info-card">
            <h2>🎳 Tory bowlingowe</h2>
            <p>6 profesjonalnych torów dostępnych dla graczy w każdym wieku.</p>
          </div>
          <div className="info-card">
            <h2>🎱 Bilard</h2>
            <p>4 stoły bilardowe dla miłośników tej klasycznej gry.</p>
          </div>
          <div className="info-card">
            <h2>🕐 Godziny otwarcia</h2>
            <p>Czynne codziennie od 10:00 do 22:00.</p>
          </div>
        </div>
      </section>
    </main>
  )
}