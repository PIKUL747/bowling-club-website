'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export default function Admin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [session, setSession] = useState(null)
  const [reservations, setReservations] = useState([])
  const [resources, setResources] = useState([])
  const [message, setMessage] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [lanes, setLanes] = useState([])
  const [view, setView] = useState('grid')
  const [showAddForm, setShowAddForm] = useState(false)
  const [addMessage, setAddMessage] = useState('')
  const [newReservation, setNewReservation] = useState({
    resource_id: '',
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    date: '',
    start_time: '',
    end_time: '',
    opis: '',
  })

  const timeSlots = [
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
    '22:00', '22:30', '23:00', '23:30'
  ]

  const allTimeOptions = [
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
    '22:00', '22:30', '23:00', '23:30', '00:00'
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
        loadAllResources()
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

  async function loadAllResources() {
    const { data } = await supabase
      .from('resources')
      .select('*')
      .order('type')
    setResources(data || [])
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
      loadAllResources()
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

  async function handleAddReservation(e) {
    e.preventDefault()
    setAddMessage('')

    if (!newReservation.resource_id) { setAddMessage('Wybierz tor lub stół.'); return }
    if (!newReservation.customer_name) { setAddMessage('Podaj imię klienta.'); return }
    if (!newReservation.date) { setAddMessage('Wybierz datę.'); return }
    if (!newReservation.start_time) { setAddMessage('Wybierz godzinę rozpoczęcia.'); return }
    if (!newReservation.end_time) { setAddMessage('Wybierz godzinę zakończenia.'); return }

    const { data: conflicts } = await supabase
      .from('reservations')
      .select('*')
      .eq('resource_id', newReservation.resource_id)
      .eq('date', newReservation.date)
      .lt('start_time', newReservation.end_time)
      .gt('end_time', newReservation.start_time)

    if (conflicts && conflicts.length > 0) {
      setAddMessage('Ten tor jest już zajęty w tym czasie!')
      return
    }

    const { error } = await supabase
      .from('reservations')
      .insert([{
        resource_id: newReservation.resource_id,
        customer_name: newReservation.customer_name,
        customer_phone: newReservation.customer_phone,
        customer_email: newReservation.customer_email,
        date: newReservation.date,
        start_time: newReservation.start_time,
        end_time: newReservation.end_time,
        opis: newReservation.opis,
      }])

    if (error) {
      setAddMessage('Błąd: ' + error.message)
    } else {
      setAddMessage('✓ Rezerwacja dodana pomyślnie!')
      setNewReservation({
        resource_id: '',
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        date: '',
        start_time: '',
        end_time: '',
        opis: '',
      })
      loadReservations(selectedDate)
    }
  }

  function handleNewChange(e) {
    setNewReservation({ ...newReservation, [e.target.name]: e.target.value })
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

        {/* Add reservation button */}
        <div style={{marginBottom: '24px'}}>
          <button
            className={showAddForm ? 'btn' : 'type-btn'}
            style={{borderColor: showAddForm ? '' : '#00c96e', color: showAddForm ? '' : '#00c96e'}}
            onClick={() => { setShowAddForm(!showAddForm); setAddMessage('') }}
          >
            {showAddForm ? '✕ Zamknij formularz' : '+ Dodaj rezerwację'}
          </button>
        </div>

        {/* Manual add form */}
        {showAddForm && (
          <div style={{backgroundColor: '#0f172a', border: '1px solid #1e3a5f', borderRadius: '12px', padding: '30px', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px'}}>
            <h2 style={{color: '#0ea5e9', marginBottom: '20px', fontSize: '20px'}}>Nowa rezerwacja</h2>
            <form className="booking-form" onSubmit={handleAddReservation}>

              <select
                name="resource_id"
                value={newReservation.resource_id}
                onChange={handleNewChange}
              >
                <option value="">Wybierz tor lub stół</option>
                {resources.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.type === 'bowling' ? 'Kręgle' : 'Bilard'})
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="customer_name"
                placeholder="Imię i nazwisko klienta"
                value={newReservation.customer_name}
                onChange={handleNewChange}
                maxLength={30}
              />

              <input
                type="tel"
                name="customer_phone"
                placeholder="Telefon klienta"
                value={newReservation.customer_phone}
                onChange={handleNewChange}
                maxLength={25}
              />

              <input
                type="email"
                name="customer_email"
                placeholder="Email klienta (opcjonalnie)"
                value={newReservation.customer_email}
                onChange={handleNewChange}
              />

              <input
                type="date"
                name="date"
                value={newReservation.date}
                onChange={handleNewChange}
              />

              <div className="time-row">
                <select
                  name="start_time"
                  value={newReservation.start_time}
                  onChange={handleNewChange}
                >
                  <option value="">Godzina start</option>
                  {allTimeOptions.slice(0, -1).map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
                <span>do</span>
                <select
                  name="end_time"
                  value={newReservation.end_time}
                  onChange={handleNewChange}
                >
                  <option value="">Godzina koniec</option>
                  {allTimeOptions.slice(1).map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <textarea
                name="opis"
                placeholder="Opis / uwagi (opcjonalnie) — np. impreza firmowa, specjalne życzenia"
                value={newReservation.opis}
                onChange={handleNewChange}
                rows={3}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  padding: '14px 16px',
                  backgroundColor: '#0a0a0f',
                  border: '1px solid #1e3a5f',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                  resize: 'vertical',
                }}
              />

              <button type="submit" className="btn" style={{backgroundColor: '#00c96e'}}>
                Dodaj rezerwację
              </button>
            </form>
            {addMessage && (
              <p style={{marginTop: '16px', color: addMessage.startsWith('✓') ? '#00c96e' : '#e63946', fontSize: '16px'}}>
                {addMessage}
              </p>
            )}
          </div>
        )}

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
                              {reservation.opis && (
                                <span style={{fontSize: '11px', color: '#a0a0b0', fontStyle: 'italic'}}>{reservation.opis}</span>
                              )}
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
                      <th>Telefon</th>
                      <th>Opis</th>
                      <th>Akcja</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map(r => (
                      <tr key={r.id}>
                        <td>{normalizeTime(r.start_time)} - {normalizeTime(r.end_time)}</td>
                        <td>{r.resources?.name}</td>
                        <td>{r.customer_name}</td>
                        <td>{r.customer_phone}</td>
                        <td>{r.opis || '-'}</td>
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