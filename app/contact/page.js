export default function Contact() {
  return (
    <main>
      <section className="hero">
        <h1>Kontakt</h1>
        <p>Masz pytania? Skontaktuj się z nami!</p>

        <div className="info-grid">
          <div className="info-card">
            <h2>📍 Adres</h2>
            <p>ul. Przykładowa 1<br/>41-500 Chorzów</p>
          </div>
          <div className="info-card">
            <h2>📞 Telefon</h2>
            <p>+48 123 456 789</p>
          </div>
          <div className="info-card">
            <h2>📧 Email</h2>
            <p>kontakt@bowlingclub.pl</p>
          </div>
        </div>
      </section>
    </main>
  )
}