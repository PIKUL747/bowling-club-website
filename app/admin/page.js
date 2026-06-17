'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export default function Admin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [session, setSession] = useState(null)
  const [reservations, setReservations] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) loadReservations()
    })
  }, [])

  async function handleLogin(e) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setMessage('Błędny email lub hasło')
    } else {
      setMessage('')
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      loadReservations()
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setSession(null)
    setReservations([])
  }

  async function loadReservations() {
    const { data } = await supabase
      .from('reservations')
      .select('*, resources(name, type)')
      .order('date', { ascending: true })
    setReservations(data || [])
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Czy na pewno chcesz usunąć tę rezerwację?')
    if (!confirmed) return

    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id)
    if (!error) {
      setReservations(reservations.filter(r => r.id !== id))
    }
  }

  if (!session) {
    return (
      <main>
        <section className="hero">
          <h1>Panel admina</h1>
          <p>Zaloguj się aby zobaczyć rezerwacje</p>

          <form className="booking-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Hasło"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn">Zaloguj się</button>
          </form>

          {message && <p className="booking-message" style={{color: '#e94560'}}>{message}</p>}
        </section>
      </main>
    )
  }

  return (
    <main>
      <section className="hero">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px'}}>
          <h1>Panel admina</h1>
          <button className="btn" onClick={handleLogout}>Wyloguj</button>
        </div>

        <p style={{marginBottom: '30px', color: '#a0a0b0'}}>
          Wszystkie rezerwacje: {reservations.length}
        </p>

        {reservations.length === 0 ? (
          <p>Brak rezerwacji</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Godzina</th>
                  <th>Tor/Stół</th>
                  <th>Imię</th>
                  <th>Email</th>
                  <th>Telefon</th>
                  <th>Akcja</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(r => (
                  <tr key={r.id}>
                    <td>{r.date}</td>
                    <td>{r.start_time} - {r.end_time}</td>
                    <td>{r.resources?.name}</td>
                    <td>{r.customer_name}</td>
                    <td>{r.customer_email}</td>
                    <td>{r.customer_phone}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(r.id)}
                      >
                        Usuń
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}