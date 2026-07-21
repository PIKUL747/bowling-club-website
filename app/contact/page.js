

export default function Contact() {
  return (
    <PageTransition>
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

          {/* Google Maps */}
          <div style={{marginTop: '50px', borderRadius: '16px', overflow: 'hidden', border: '2px solid #1e3a5f', maxWidth: '900px', margin: '50px auto 0'}}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2564.913138832567!2d20.99811057516227!3d49.99423793903015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473d9b45a533fb31%3A0x73967f08a0265685!2sKwazar%20Bowling%20Club!5e0!3m2!1spl!2spl!4v1783878802643!5m2!1spl!2spl"
              width="100%"
              height="450"
              style={{border: 0, display: 'block'}}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

          <div className="special-notice" style={{marginTop: '50px'}}>
            <h2>📞 Rezerwacje</h2>
            <p>
              Wszystkie rezerwacje — zarówno indywidualne jak i grupowe, imprezy okolicznościowe
              oraz imprezy firmowe — są przyjmowane wyłącznie telefonicznie.
              Nasz personel wprowadzi rezerwację do systemu po uzgodnieniu szczegółów.
            </p>
            <p style={{marginTop: '16px'}}>Zadzwoń do nas:</p>
            <a href="tel:537523207" className="btn" style={{marginTop: '16px', display: 'inline-block'}}>
              <span style={{color: '#0ea5e9'}}>📞</span> 537 523 207
            </a>
          </div>
        </section>
      </main>
    </PageTransition>
  )
}