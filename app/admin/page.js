'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export default function Admin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [session, setSession] = useState(null)
  const [reservations, setReservations] = useState([])
  const [weekReservations, setWeekReservations] = useState([])
  const [bowlingResources, setBowlingResources] = useState([])
  const [billardsResources, setBillardsResources] = useState([])
  const [allResources, setAllResources] = useState([])
  const [closures, setClosures] = useState([])
  const [message, setMessage] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [view, setView] = useState('grid')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showClosureForm, setShowClosureForm] = useState(false)
  const [addMessage, setAddMessage] = useState('')
  const [closureMessage, setClosureMessage] = useState('')
  const [selectedLanes, setSelectedLanes] = useState([])
  const [newReservation, setNewReservation] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    date: '',
    start_time: '',
    end_time: '',
    opis: '',
    osoby: '',
  })
  const [newClosure, setNewClosure] = useState({
    resource_id: '',
    date: '',
    reason: '',
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

  const dayNames = ['Nd', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob']

  function getTodayPoland() {
    const now = new Date()
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Warsaw',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now)
  }

  function getWeekDates(dateString) {
    const date = new Date(dateString + 'T12:00:00')
    const day = date.getDay()
    const monday = new Date(date)
    monday.setDate(date.getDate() - (day === 0 ? 6 : day - 1))
    const dates = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      dates.push(new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Warsaw',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(d))
    }
    return dates
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

  function formatDate(dateString) {
    const [y, m, d] = dateString.split('-')
    return `${d}.${m}`
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        const today = getTodayPoland()
        setSelectedDate(today)
        loadResources()
      }
    })
  }, [])

  useEffect(() => {
    if (session && selectedDate) {
      loadReservations(selectedDate)
      loadClosures(selectedDate)
      if (view === 'week') loadWeekReservations(selectedDate)
    }
  }, [session, selectedDate])

  useEffect(() => {
    if (session && selectedDate && view === 'week') {
      loadWeekReservations(selectedDate)
    }
  }, [view])

  async function loadResources() {
    const { data } = await supabase.from('resources').select('*').order('id')
    const all = data || []
    setAllResources(all)
    setBowlingResources(all.filter(r => r.type === 'bowling'))
    setBillardsResources(all.filter(r => r.type === 'billiards'))
  }

  async function loadReservations(date) {
    const { data } = await supabase
      .from('reservations')
      .select('*, resources(name, type)')
      .eq('date', date)
      .order('start_time')
    setReservations(data || [])
  }

  async function loadWeekReservations(date) {
    const dates = getWeekDates(date)
    const { data } = await supabase
      .from('reservations')
      .select('*, resources(name, type)')
      .gte('date', dates[0])
      .lte('date', dates[6])
      .order('date')
      .order('start_time')
    setWeekReservations(data || [])
  }

  async function loadClosures(date) {
    const { data } = await supabase
      .from('closures')
      .select('*, resources(name, type)')
      .eq('date', date)
      .order('start_time')
    setClosures(data || [])
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
      loadResources()
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setSession(null)
    setReservations([])
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Czy na pewno chcesz usunąć tę rezerwację?')
    if (!confirmed) return
    const { error } = await supabase.from('reservations').delete().eq('id', id)
    if (!error) {
      loadReservations(selectedDate)
      if (view === 'week') loadWeekReservations(selectedDate)
    }
  }

  async function handleDeleteClosure(id) {
    const confirmed = window.confirm('Czy na pewno chcesz przywrócić ten tor/stół?')
    if (!confirmed) return
    const { error } = await supabase.from('closures').delete().eq('id', id)
    if (!error) loadClosures(selectedDate)
  }

  async function handleAddReservation(e) {
    e.preventDefault()
    setAddMessage('')
    if (selectedLanes.length === 0) { setAddMessage('Wybierz co najmniej jeden tor lub stół.'); return }
    if (!newReservation.customer_name) { setAddMessage('Podaj imię klienta.'); return }
    if (!newReservation.date) { setAddMessage('Wybierz datę.'); return }
    if (!newReservation.start_time) { setAddMessage('Wybierz godzinę rozpoczęcia.'); return }
    if (!newReservation.end_time) { setAddMessage('Wybierz godzinę zakończenia.'); return }

    let hasConflict = false
    for (const laneId of selectedLanes) {
      const { data: conflicts } = await supabase
        .from('reservations')
        .select('*')
        .eq('resource_id', laneId)
        .eq('date', newReservation.date)
        .lt('start_time', newReservation.end_time)
        .gt('end_time', newReservation.start_time)
      if (conflicts && conflicts.length > 0) {
        const lane = allResources.find(r => r.id === parseInt(laneId))
        setAddMessage(`Konflikt! ${lane?.name} jest już zajęty w tym czasie.`)
        hasConflict = true
        break
      }
    }
    if (hasConflict) return

    const inserts = selectedLanes.map(laneId => ({
      resource_id: parseInt(laneId),
      customer_name: newReservation.customer_name,
      customer_phone: newReservation.customer_phone,
      customer_email: newReservation.customer_email,
      date: newReservation.date,
      start_time: newReservation.start_time,
      end_time: newReservation.end_time,
      opis: newReservation.opis,
      osoby: newReservation.osoby ? parseInt(newReservation.osoby) : null,
    }))

    const { error } = await supabase.from('reservations').insert(inserts)
    if (error) {
      setAddMessage('Błąd: ' + error.message)
    } else {
      setAddMessage(`✓ Dodano rezerwację na ${selectedLanes.length} tor(y/ów)!`)
      setSelectedLanes([])
      setNewReservation({ customer_name: '', customer_phone: '', customer_email: '', date: '', start_time: '', end_time: '', opis: '', osoby: '' })
      loadReservations(selectedDate)
      if (view === 'week') loadWeekReservations(selectedDate)
    }
  }

  async function handleAddClosure(e) {
    e.preventDefault()
    setClosureMessage('')
    if (!newClosure.resource_id) { setClosureMessage('Wybierz tor lub stół.'); return }
    if (!newClosure.date) { setClosureMessage('Wybierz datę.'); return }

    const { error } = await supabase.from('closures').insert([{
      resource_id: newClosure.resource_id,
      date: newClosure.date,
      start_time: '13:00',
      end_time: '00:00',
      reason: newClosure.reason,
    }])

    if (error) {
      setClosureMessage('Błąd: ' + error.message)
    } else {
      setClosureMessage('✓ Tor/stół wyłączony na cały dzień!')
      setNewClosure({ resource_id: '', date: '', reason: '' })
      loadClosures(selectedDate)
    }
  }

  function handleNewChange(e) {
    setNewReservation({ ...newReservation, [e.target.name]: e.target.value })
  }

  function handleClosureChange(e) {
    setNewClosure({ ...newClosure, [e.target.name]: e.target.value })
  }

  function toggleLane(id) {
    const strId = String(id)
    if (selectedLanes.includes(strId)) {
      setSelectedLanes(selectedLanes.filter(l => l !== strId))
    } else {
      setSelectedLanes([...selectedLanes, strId])
    }
  }

  function getEntryForSlot(laneId, timeSlot) {
    const reservation = reservations.find(r => {
      if (r.resource_id !== laneId) return false
      const slotMinutes = timeToMinutes(timeSlot)
      return slotMinutes >= timeToMinutes(r.start_time) && slotMinutes < timeToMinutes(r.end_time)
    })
    if (reservation) return { ...reservation, isClosure: false }

    const closure = closures.find(c => {
      if (c.resource_id !== laneId) return false
      const slotMinutes = timeToMinutes(timeSlot)
      return slotMinutes >= timeToMinutes(c.start_time) && slotMinutes < timeToMinutes(c.end_time)
    })
    if (closure) return { ...closure, isClosure: true }
    return null
  }

  function isFirstSlot(laneId, timeSlot) {
    const entry = getEntryForSlot(laneId, timeSlot)
    if (!entry) return false
    return normalizeTime(entry.start_time) === timeSlot
  }

  function getRowSpan(entry) {
    const start = timeSlots.indexOf(normalizeTime(entry.start_time))
    const endTime = normalizeTime(entry.end_time)
    let end = endTime === '00:00' ? timeSlots.length : timeSlots.indexOf(endTime)
    if (end === -1) end = timeSlots.length
    return end - start
  }

  function renderGrid(resourceList) {
    return (
      <div className="schedule-wrapper">
        <table className="schedule-table">
          <thead>
            <tr>
              <th className="schedule-time-header">Godzina</th>
              {resourceList.map(lane => (
                <th key={lane.id} className="schedule-lane-header">{lane.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(timeSlot => (
              <tr key={timeSlot}>
                <td className="schedule-time-cell">{timeSlot}</td>
                {resourceList.map(lane => {
                  const entry = getEntryForSlot(lane.id, timeSlot)
                  const isFirst = isFirstSlot(lane.id, timeSlot)
                  if (entry && !isFirst) return null
                  if (entry && isFirst) {
                    const rowSpan = getRowSpan(entry)
                    return (
                      <td key={lane.id} rowSpan={rowSpan} className={entry.isClosure ? 'schedule-closure-cell' : 'schedule-booked-cell'}>
                        <div className="schedule-booking-info">
                          {entry.isClosure ? (
                            <>
                              <strong style={{color: '#e63946'}}>🔒 WYŁĄCZONY</strong>
                              {entry.reason && <span style={{fontSize: '11px', color: '#a0a0b0'}}>{entry.reason}</span>}
                              <button className="delete-btn" style={{marginTop: '6px', fontSize: '11px', padding: '4px 10px'}} onClick={() => handleDeleteClosure(entry.id)}>Przywróć</button>
                            </>
                          ) : (
                            <>
                              <strong style={{fontSize: '13px'}}>{entry.customer_name}</strong>
                              <span style={{fontSize: '12px', color: '#0ea5e9'}}>{normalizeTime(entry.start_time)} - {normalizeTime(entry.end_time)}</span>
                              {entry.osoby && <span style={{fontSize: '11px', color: '#00c96e'}}>👥 {entry.osoby} os.</span>}
                              <span style={{fontSize: '11px', color: '#ffaaaa'}}>{entry.customer_phone}</span>
                              {entry.opis && (
                                <div style={{marginTop: '4px', padding: '4px 6px', backgroundColor: '#0a0a0f', borderRadius: '4px', border: '1px solid #1e3a5f'}}>
                                  <span style={{fontSize: '11px', color: '#e0c070', fontStyle: 'italic'}}>📝 {entry.opis}</span>
                                </div>
                              )}
                              <button className="delete-btn" style={{marginTop: '6px', fontSize: '11px', padding: '4px 10px'}} onClick={() => handleDelete(entry.id)}>Usuń</button>
                            </>
                          )}
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
    )
  }

  function renderWeekView() {
    const weekDates = getWeekDates(selectedDate)
    const today = getTodayPoland()

    return (
      <div>
        <h2 style={{color: '#0ea5e9', marginBottom: '16px', fontSize: '20px'}}>🎳 Kręgle — widok tygodniowy</h2>
        <div className="schedule-wrapper">
          <table className="schedule-table">
            <thead>
              <tr>
                <th className="schedule-time-header">Tor</th>
                {weekDates.map(date => {
                  const d = new Date(date + 'T12:00:00')
                  const isToday = date === today
                  return (
                    <th key={date} className="schedule-lane-header" style={{borderColor: isToday ? '#0ea5e9' : '', backgroundColor: isToday ? '#0f2a4a' : ''}}>
                      <div>{dayNames[d.getDay()]}</div>
                      <div style={{fontSize: '12px', color: '#a0a0b0'}}>{formatDate(date)}</div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {bowlingResources.map(lane => (
                <tr key={lane.id}>
                  <td className="schedule-time-cell">{lane.name}</td>
                  {weekDates.map(date => {
                    const dayReservations = weekReservations.filter(r =>
                      r.resource_id === lane.id && r.date === date
                    )
                    return (
                      <td key={date} className="schedule-empty-cell" style={{verticalAlign: 'top', padding: '4px', minWidth: '120px'}}>
                        {dayReservations.length === 0 ? (
                          <span style={{color: '#2a2a4a', fontSize: '12px'}}>wolny</span>
                        ) : (
                          dayReservations.map(r => (
                            <div key={r.id} style={{backgroundColor: '#0f172a', border: '1px solid #0ea5e9', borderRadius: '6px', padding: '6px', marginBottom: '4px'}}>
                              <div style={{fontSize: '12px', color: '#0ea5e9', fontWeight: 'bold'}}>{normalizeTime(r.start_time)} - {normalizeTime(r.end_time)}</div>
                              <div style={{fontSize: '11px', color: 'white'}}>{r.customer_name}</div>
                              {r.osoby && <div style={{fontSize: '11px', color: '#00c96e'}}>👥 {r.osoby} os.</div>}
                              {r.opis && <div style={{fontSize: '11px', color: '#e0c070', fontStyle: 'italic'}}>📝 {r.opis}</div>}
                              <button className="delete-btn" style={{marginTop: '4px', fontSize: '10px', padding: '2px 8px'}} onClick={() => handleDelete(r.id)}>Usuń</button>
                            </div>
                          ))
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={{color: '#0ea5e9', margin: '40px 0 16px', fontSize: '20px'}}>🎱 Bilard — widok tygodniowy</h2>
        <div className="schedule-wrapper">
          <table className="schedule-table">
            <thead>
              <tr>
                <th className="schedule-time-header">Stół</th>
                {weekDates.map(date => {
                  const d = new Date(date + 'T12:00:00')
                  const isToday = date === today
                  return (
                    <th key={date} className="schedule-lane-header" style={{borderColor: isToday ? '#0ea5e9' : '', backgroundColor: isToday ? '#0f2a4a' : ''}}>
                      <div>{dayNames[d.getDay()]}</div>
                      <div style={{fontSize: '12px', color: '#a0a0b0'}}>{formatDate(date)}</div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {billardsResources.map(table => (
                <tr key={table.id}>
                  <td className="schedule-time-cell">{table.name}</td>
                  {weekDates.map(date => {
                    const dayReservations = weekReservations.filter(r =>
                      r.resource_id === table.id && r.date === date
                    )
                    return (
                      <td key={date} className="schedule-empty-cell" style={{verticalAlign: 'top', padding: '4px', minWidth: '120px'}}>
                        {dayReservations.length === 0 ? (
                          <span style={{color: '#2a2a4a', fontSize: '12px'}}>wolny</span>
                        ) : (
                          dayReservations.map(r => (
                            <div key={r.id} style={{backgroundColor: '#0f172a', border: '1px solid #0ea5e9', borderRadius: '6px', padding: '6px', marginBottom: '4px'}}>
                              <div style={{fontSize: '12px', color: '#0ea5e9', fontWeight: 'bold'}}>{normalizeTime(r.start_time)} - {normalizeTime(r.end_time)}</div>
                              <div style={{fontSize: '11px', color: 'white'}}>{r.customer_name}</div>
                              {r.opis && <div style={{fontSize: '11px', color: '#e0c070', fontStyle: 'italic'}}>📝 {r.opis}</div>}
                              <button className="delete-btn" style={{marginTop: '4px', fontSize: '10px', padding: '2px 8px'}} onClick={() => handleDelete(r.id)}>Usuń</button>
                            </div>
                          ))
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <main>
        <section className="hero">
          <h1>Panel admina</h1>
          <p>Zaloguj się aby zobaczyć rezerwacje</p>
          <form className="booking-form" onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Hasło" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" className="btn">Zaloguj się</button>
          </form>
          {message && <p style={{color: '#e63946', marginTop: '16px'}}>{message}</p>}
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

        {/* Action buttons */}
        <div style={{display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap'}}>
          <button
            className="type-btn"
            style={{borderColor: '#00c96e', color: showAddForm ? 'white' : '#00c96e', backgroundColor: showAddForm ? '#00c96e' : ''}}
            onClick={() => { setShowAddForm(!showAddForm); setShowClosureForm(false) }}
          >
            + Dodaj rezerwację
          </button>
          <button
            className="type-btn"
            style={{borderColor: '#e63946', color: showClosureForm ? 'white' : '#e63946', backgroundColor: showClosureForm ? '#e63946' : ''}}
            onClick={() => { setShowClosureForm(!showClosureForm); setShowAddForm(false) }}
          >
            🔒 Wyłącz tor / stół
          </button>
        </div>

        {/* Add reservation form */}
        {showAddForm && (
          <div style={{backgroundColor: '#0f172a', border: '1px solid #1e3a5f', borderRadius: '12px', padding: '30px', marginBottom: '30px', maxWidth: '620px', margin: '0 auto 30px'}}>
            <h2 style={{color: '#00c96e', marginBottom: '20px', fontSize: '20px'}}>Nowa rezerwacja</h2>
            <p style={{color: '#a0a0b0', fontSize: '14px', marginBottom: '12px'}}>Wybierz tory / stoły (możesz zaznaczyć kilka):</p>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px', justifyContent: 'center'}}>
              {allResources.map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => toggleLane(r.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '2px solid',
                    borderColor: selectedLanes.includes(String(r.id)) ? '#00c96e' : '#1e3a5f',
                    backgroundColor: selectedLanes.includes(String(r.id)) ? '#003a20' : '#0a0a0f',
                    color: selectedLanes.includes(String(r.id)) ? '#00c96e' : '#a0a0b0',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  {r.name}
                </button>
              ))}
            </div>
            <form className="booking-form" onSubmit={handleAddReservation}>
              <input type="text" name="customer_name" placeholder="Imię i nazwisko klienta" value={newReservation.customer_name} onChange={handleNewChange} maxLength={30} />
              <input type="tel" name="customer_phone" placeholder="Telefon klienta" value={newReservation.customer_phone} onChange={handleNewChange} maxLength={25} />
              <input type="email" name="customer_email" placeholder="Email klienta (opcjonalnie)" value={newReservation.customer_email} onChange={handleNewChange} />
              <input type="date" name="date" value={newReservation.date} onChange={handleNewChange} />
              <div className="time-row">
                <select name="start_time" value={newReservation.start_time} onChange={handleNewChange}>
                  <option value="">Godzina start</option>
                  {allTimeOptions.slice(0, -1).map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
                <span>do</span>
                <select name="end_time" value={newReservation.end_time} onChange={handleNewChange}>
                  <option value="">Godzina koniec</option>
                  {allTimeOptions.slice(1).map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
              <select name="osoby" value={newReservation.osoby} onChange={handleNewChange}>
                <option value="">Liczba osób (opcjonalnie)</option>
                {[1,2,3,4,5,6].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'osoba' : n < 5 ? 'osoby' : 'osób'} na tor</option>
                ))}
              </select>
              <textarea
                name="opis"
                placeholder="Opis / uwagi / dane do faktury (opcjonalnie)"
                value={newReservation.opis}
                onChange={handleNewChange}
                rows={3}
                style={{width: '100%', maxWidth: '400px', padding: '14px 16px', backgroundColor: '#0a0a0f', border: '1px solid #1e3a5f', borderRadius: '8px', color: 'white', fontSize: '16px', resize: 'vertical'}}
              />
              <button type="submit" className="btn" style={{backgroundColor: '#00c96e'}}>
                Dodaj rezerwację {selectedLanes.length > 1 ? `(${selectedLanes.length} tory/stoły)` : ''}
              </button>
            </form>
            {addMessage && <p style={{marginTop: '16px', color: addMessage.startsWith('✓') ? '#00c96e' : '#e63946', fontSize: '16px'}}>{addMessage}</p>}
          </div>
        )}

        {/* Closure form */}
        {showClosureForm && (
          <div style={{backgroundColor: '#0f172a', border: '1px solid #e63946', borderRadius: '12px', padding: '30px', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px'}}>
            <h2 style={{color: '#e63946', marginBottom: '8px', fontSize: '20px'}}>🔒 Wyłącz tor / stół na cały dzień</h2>
            <p style={{color: '#a0a0b0', fontSize: '14px', marginBottom: '20px'}}>Tor zostanie wyłączony na cały dzień. Możesz go przywrócić w dowolnym momencie.</p>
            <form className="booking-form" onSubmit={handleAddClosure}>
              <select name="resource_id" value={newClosure.resource_id} onChange={handleClosureChange}>
                <option value="">Wybierz tor lub stół</option>
                <optgroup label="🎳 Kręgle">
                  {bowlingResources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </optgroup>
                <optgroup label="🎱 Bilard">
                  {billardsResources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </optgroup>
              </select>
              <input type="date" name="date" value={newClosure.date} onChange={handleClosureChange} />
              <input type="text" name="reason" placeholder="Powód wyłączenia (np. usterka, serwis)" value={newClosure.reason} onChange={handleClosureChange} />
              <button type="submit" className="btn" style={{backgroundColor: '#e63946'}}>Wyłącz na cały dzień</button>
            </form>
            {closureMessage && <p style={{marginTop: '16px', color: closureMessage.startsWith('✓') ? '#00c96e' : '#e63946', fontSize: '16px'}}>{closureMessage}</p>}
            {closures.length > 0 && (
              <div style={{marginTop: '24px'}}>
                <h3 style={{color: '#e63946', marginBottom: '12px', fontSize: '16px'}}>Aktywne wyłączenia na {selectedDate}:</h3>
                {closures.map(c => (
                  <div key={c.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: '#1a0a0f', borderRadius: '6px', marginBottom: '8px'}}>
                    <span style={{color: '#a0a0b0', fontSize: '14px'}}>{c.resources?.name} — cały dzień {c.reason ? `| ${c.reason}` : ''}</span>
                    <button className="delete-btn" onClick={() => handleDeleteClosure(c.id)}>Przywróć</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Date picker and view toggle */}
        <div style={{display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap'}}>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="admin-filter-input" />
          <button className="type-btn" style={{borderColor: selectedDate === getTodayPoland() ? '#0ea5e9' : ''}} onClick={() => setSelectedDate(getTodayPoland())}>Dzisiaj</button>
          <div style={{display: 'flex', gap: '8px'}}>
            <button className={view === 'grid' ? 'type-btn active' : 'type-btn'} onClick={() => setView('grid')}>📅 Siatka</button>
            <button className={view === 'list' ? 'type-btn active' : 'type-btn'} onClick={() => setView('list')}>📋 Lista</button>
            <button className={view === 'week' ? 'type-btn active' : 'type-btn'} onClick={() => setView('week')}>📆 Tydzień</button>
          </div>
        </div>

        <p style={{marginBottom: '20px', color: '#a0a0b0'}}>
          Rezerwacje na: <strong style={{color: 'white'}}>{selectedDate}</strong> — łącznie: {reservations.length}
        </p>

        {/* GRID VIEW */}
        {view === 'grid' && (
          <>
            <h2 style={{color: '#0ea5e9', marginBottom: '12px', fontSize: '20px'}}>🎳 Kręgle</h2>
            {renderGrid(bowlingResources)}
            <h2 style={{color: '#0ea5e9', margin: '40px 0 12px', fontSize: '20px'}}>🎱 Bilard</h2>
            {renderGrid(billardsResources)}
          </>
        )}

        {/* WEEK VIEW */}
        {view === 'week' && renderWeekView()}

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
                      <th>Osoby</th>
                      <th>Opis / Faktura</th>
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
                        <td>{r.osoby ? `${r.osoby} os.` : '-'}</td>
                        <td style={{maxWidth: '200px', whiteSpace: 'pre-wrap', color: '#e0c070'}}>{r.opis || '-'}</td>
                        <td><button className="delete-btn" onClick={() => handleDelete(r.id)}>Usuń</button></td>
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