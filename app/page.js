export default function Home() {
  return (
    <main>
      <section className="hero">
        <h1>Witamy w Bowling Club!</h1>
        <p>6 torów bowlingowych • 4 stoły bilardowe</p>
        <p>Czynne codziennie 10:00 - 22:00</p>
        <a href="/reservations">
          <button className="btn">Zarezerwuj tor</button>
        </a>
      </section>
    </main>
  )
}