'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export default function Admin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [session, setSession] = useState(null)
  const [reservations, setReservations] = useState([])
  const [message, setMessage] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [lanes, setLanes] = useState([])
  const [view, setView] = useState('grid')

  const timeSlots = [
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
    '22:00', '22:30', '23:00', '23:30'
  ]

  function getTodayPoland() {
    const now = new Date()
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Warsaw',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now)
  }

  function normalizeTime(time) {
    if (!time) return ''
    return time.substring(0, 5)
  }

  function timeToMinutes(time) {
    const t = normalizeTime(time)
    if (t === '00:00') return 24 * 60
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        const today = getTodayPoland()
        setSelectedDate(today)
        loadLanes()
      }
    })
  }, [])

  useEffect(() => {
    if (session && selectedDate) {
      loadReservations(selectedDate)
    }
  }, [session, selectedDate])

  async function loadLanes() {
    const { data } = await supabase
      .from('resources')
      .select('*')
      .eq('type', 'bowling')
      .order('id')
    setLanes(data || [])
  }

  async function loadReservations(date) {
    const { data } = await supabase
      .from('reservations')
      .select('*, resources(name, type)')
      .eq('date', date)
      .order('start_time')
    setReservations(data || [])
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
      const today = getTodayPoland()
      setSelectedDate(today)
      loadLanes()
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setSession(null)
    setReservations([])
    setLanes([])
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Czy na pewno chcesz usunąć tę rezerwację?')
    if (!confirmed) return
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id)
    if (!error) {
      loadReservations(selectedDate)
    }
  }

  function getReservationForSlot(laneId, timeSlot) {
    return reservations.find(r => {
      if (r.resource_id !== laneId) return false
      const slotMinutes = timeToMinutes(timeSlot)
      const startMinutes = timeToMinutes(r.start_time)
      const endMinutes = timeToMinutes(r.end_time)
      return slotMinutes >= startMinutes && slotMinutes < endMinutes
    })
  }

  function isFirstSlotOfReservation(laneId, timeSlot) {
    const r = getReservationForSlot(laneId, timeSlot)
    if (!r) return false
    return normalizeTime(r.start_time) === timeSlot
  }

  function getReservationRowSpan(reservation) {
    const start = timeSlots.indexOf(normalizeTime(reservation.start_time))
    const endTime = normalizeTime(reservation.end_time)
    let end = endTime === '00:00' ? timeSlots.length : timeSlots.indexOf(endTime)
    if (end === -1) end = timeSlots.length
    return end - start
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
          {message && <p className="booking-message" style={{color: '#e63946'}}>{message}</p>}
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

        {/* Date picker and view toggle */}
        <div style={{display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap'}}>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="admin-filter-input"
          />
          <button
            className="type-btn"
            style={{borderColor: selectedDate === getTodayPoland() ? '#0ea5e9' : ''}}
            onClick={() => setSelectedDate(getTodayPoland())}
          >
            Dzisiaj
          </button>
          <div style={{display: 'flex', gap: '8px'}}>
            <button
              className={view === 'grid' ? 'type-btn active' : 'type-btn'}
              onClick={() => setView('grid')}
            >
              📅 Siatka
            </button>
            <button
              className={view === 'list' ? 'type-btn active' : 'type-btn'}
              onClick={() => setView('list')}
            >
              📋 Lista
            </button>
          </div>
        </div>

        <p style={{marginBottom: '20px', color: '#a0a0b0'}}>
          Rezerwacje na: <strong style={{color: 'white'}}>{selectedDate}</strong> — łącznie: {reservations.length}
        </p>

        {/* GRID VIEW */}
        {view === 'grid' && (
          <div className="schedule-wrapper">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th className="schedule-time-header">Godzina</th>
                  {lanes.map(lane => (
                    <th key={lane.id} className="schedule-lane-header">{lane.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(timeSlot => (
                  <tr key={timeSlot}>
                    <td className="schedule-time-cell">{timeSlot}</td>
                    {lanes.map(lane => {
                      const reservation = getReservationForSlot(lane.id, timeSlot)
                      const isFirst = isFirstSlotOfReservation(lane.id, timeSlot)

                      if (reservation && !isFirst) return null

                      if (reservation && isFirst) {
                        const rowSpan = getReservationRowSpan(reservation)
                        return (
                          <td
                            key={lane.id}
                            rowSpan={rowSpan}
                            className="schedule-booked-cell"
                          >
                            <div className="schedule-booking-info">
                              <strong>{reservation.customer_name}</strong>
                              <span>{normalizeTime(reservation.start_time)} - {normalizeTime(reservation.end_time)}</span>
                              <span style={{fontSize: '11px', color: '#ffaaaa'}}>{reservation.customer_phone}</span>
                              <button
                                className="delete-btn"
                                style={{marginTop: '6px', fontSize: '11px', padding: '4px 10px'}}
                                onClick={() => handleDelete(reservation.id)}
                              >
                                Usuń
                              </button>
                            </div>
                          </td>
                        )
                      }

                      return <td key={lane.id} className="schedule-empty-cell"></td>
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* LIST VIEW */}
        {view === 'list' && (
          <>
            {reservations.length === 0 ? (
              <p style={{color: '#a0a0b0'}}>Brak rezerwacji na ten dzień</p>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
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
                        <td>{normalizeTime(r.start_time)} - {normalizeTime(r.end_time)}</td>
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
          </>
        )}
      </section>
    </main>
  )
}