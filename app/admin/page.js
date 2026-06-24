'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export default function Admin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [session, setSession] = useState(null)
  const [reservations, setReservations] = useState([])
  const [filtered, setFiltered] = useState([])
  const [message, setMessage] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterName, setFilterName] = useState('')
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) loadReservations()
    })
  }, [])

  useEffect(() => {
    applyFilters()
  }, [reservations, filterDate, filterType, filterName, showAll])

  function getTodayPoland() {
    const now = new Date()
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Warsaw',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now)
  }

  function applyFilters() {
    let result = [...reservations]
    const today = getTodayPoland()

    if (!showAll) {
      result = result.filter(r => r.date >= today)
    }

    if (filterDate) {
      result = result.filter(r => r.date === filterDate)
    }

    if (filterType !== 'all') {
      result = result.filter(r => r.resources?.type === filterType)
    }

    if (filterName) {
      result = result.filter(r =>
        r.customer_name.toLowerCase().includes(filterName.toLowerCase())
      )
    }

    setFiltered(result)
  }

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
    setFiltered([])
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
      const updated = reservations.filter(r => r.id !== id)
      setReservations(updated)
    }
  }

  function clearFilters() {
    setFilterDate('')
    setFilterType('all')
    setFilterName('')
    setShowAll(false)
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
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
          <h1>Panel admina</h1>
          <button className="btn" onClick={handleLogout}>Wyloguj</button>
        </div>

        {/* Filters */}
        <div className="admin-filters">
          <input
            type="text"
            placeholder="Szukaj po imieniu..."
            value={filterName}
            onChange={e => setFilterName(e.target.value)}
            className="admin-filter-input"
          />

          <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            className="admin-filter-input"
          />

          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="admin-filter-input"
          >
            <option value="all">Wszystkie</option>
            <option value="bowling">Bowling</option>
            <option value="billiards">Bilard</option>
          </select>

          <button
            className="type-btn"
            onClick={() => setShowAll(!showAll)}
            style={{borderColor: showAll ? '#e94560' : ''}}
          >
            {showAll ? 'Pokaż nadchodzące' : 'Pokaż wszystkie'}
          </button>

          <button className="type-btn" onClick={clearFilters}>
            Wyczyść filtry
          </button>
        </div>

        <p style={{marginBottom: '20px', color: '#a0a0b0'}}>
          Wyświetlane rezerwacje: {filtered.length} / Wszystkie: {reservations.length}
        </p>

        {filtered.length === 0 ? (
          <p style={{color: '#a0a0b0'}}>Brak rezerwacji spełniających kryteria</p>
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
                {filtered.map(r => (
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