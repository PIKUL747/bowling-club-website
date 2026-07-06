'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function Reservations() {
  const [resources, setResources] = useState([])
  const [selectedType, setSelectedType] = useState('bowling')
  const [bookedSlots, setBookedSlots] = useState([])
  const [allReservations, setAllReservations] = useState([])
  const [lanes, setLanes] = useState([])
  const [gridDate, setGridDate] = useState('')
  const [view, setView] = useState('grid')
  const [formData, setFormData] = useState({
    resource_id: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    date: '',
    start_time: '',
    end_time: '',
  })
  const [message, setMessage] = useState('')

  const timeSlots = [
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00', '22:00', '23:00'
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

  function getMaxDate() {
    const now = new Date()
    now.setMonth(now.getMonth() + 2)
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
    const today = getTodayPoland()
    setGridDate(today)
    loadLanes()
  }, [])

  useEffect(() => {
    if (gridDate) loadGridReservations(gridDate)
  }, [gridDate])

  useEffect(() => {
    async function loadResources() {
      const { data } = await supabase
        .from('resources')
        .select('*')
        .eq('type', selectedType)
      setResources(data || [])
    }
    loadResources()
  }, [selectedType])

  useEffect(() => {
    async function loadBookedSlots() {
      if (!formData.resource_id || !formData.date) {
        setBookedSlots([])
        return
      }
      const { data } = await supabase
        .from('reservations')
        .select('start_time, end_time')
        .eq('resource_id', formData.resource_id)
        .eq('date', formData.date)
      setBookedSlots(data || [])
    }
    loadBookedSlots()
  }, [formData.resource_id, formData.date])

  async function loadLanes() {
    const { data } = await supabase
      .from('resources')
      .select('*')
      .eq('type', 'bowling')
      .order('id')
    setLanes(data || [])
  }

  async function loadGridReservations(date) {
    const { data } = await supabase
      .from('reservations')
      .select('resource_id, start_time, end_time')
      .eq('date', date)
    setAllReservations(data || [])
  }

  function isSlotBooked(laneId, timeSlot) {
    return allReservations.some(r => {
      if (r.resource_id !== laneId) return false
      const slotMinutes = timeToMinutes(timeSlot)
      const startMinutes = timeToMinutes(r.start_time)
      const endMinutes = timeToMinutes(r.end_time)
      return slotMinutes >= startMinutes && slotMinutes < endMinutes
    })
  }

  function getDayOfWeek(dateString) {
    if (!dateString) return null
    const date = new Date(dateString + 'T12:00:00')
    return date.getDay()
  }

  function isSlotTaken(slot) {
    return bookedSlots.some(b => {
      const slotMinutes = timeToMinutes(slot)
      const start = timeToMinutes(b.start_time)
      const end = timeToMinutes(b.end_time)
      return slotMinutes >= start && slotMinutes < end
    })
  }

  function getAllSlots(dateString) {
    const day = getDayOfWeek(dateString)
    if (day === null) return []
    const isWeekend = day === 5 || day === 6 || day === 0
    const openHour = isWeekend ? 13 : 15
    const allowHalfHours = selectedType === 'bowling' && !isWeekend
    const slots = []
    for (let hour = openHour; hour <= 23; hour++) {
      slots.push(String(hour).padStart(2, '0') + ':00')
      if (allowHalfHours && hour < 23) {
        slots.push(String(hour).padStart(2, '0') + ':30')
      }
    }
    return slots
  }

  function getAvailableStartSlots(dateString) {
    return getAllSlots(dateString).filter(slot => !isSlotTaken(slot))
  }

  function getEndSlots(dateString, startTime) {
    if (!startTime) return []
    const day = getDayOfWeek(dateString)
    if (day === null) return []
    const isWeekend = day === 5 || day === 6 || day === 0
    const allowHalfHours = selectedType === 'bowling' && !isWeekend
    const endSlots = []
    let current = startTime
    for (let i = 0; i < 8; i++) {
      const [h, m] = current.split(':').map(Number)
      let nextH = h
      let nextM = m + (allowHalfHours ? 30 : 60)
      if (nextM >= 60) {
        nextH += Math.floor(nextM / 60)
        nextM = nextM % 60
      }
      if (nextH > 24) break
      if (nextH === 24) {
        endSlots.push('00:00')
        break
      }
      const nextSlot = String(nextH).padStart(2, '0') + ':' + String(nextM).padStart(2, '0')
      const hitBooking = bookedSlots.some(b => {
        const nextMinutes = timeToMinutes(nextSlot)
        const bookedStart = timeToMinutes(b.start_time)
        return nextMinutes > timeToMinutes(startTime) && nextMinutes >= bookedStart
      })
      endSlots.push(nextSlot)
      current = nextSlot
      if (hitBooking) break
      if (nextSlot === '00:00') break
    }
    return endSlots
  }

  function handleChange(e) {
    const updated = { ...formData, [e.target.name]: e.target.value }
    if (e.target.name === 'date') {
      updated.start_time = ''
      updated.end_time = ''
    }
    if (e.target.name === 'start_time') {
      updated.end_time = ''
    }
    setFormData(updated)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    if (!formData.resource_id) { setMessage('Proszę wybrać tor lub stół.'); return }
    if (!formData.customer_name) { setMessage('Proszę podać imię i nazwisko.'); return }
    if (!formData.customer_email) { setMessage('Proszę podać email.'); return }
    if (!formData.date) { setMessage('Proszę wybrać datę.'); return }
    if (!formData.start_time) { setMessage('Proszę wybrać godzinę rozpoczęcia.'); return }
    if (!formData.end_time) { setMessage('Proszę wybrać godzinę zakończenia.'); return }

    const todayPoland = getTodayPoland()
    if (formData.date < todayPoland) {
      setMessage('Nie można rezerwować terminów w przeszłości.')
      return
    }

    if (formData.date > getMaxDate()) {
      setMessage('Rezerwacje można składać maksymalnie 2 miesiące do przodu.')
      return
    }

    const { data: conflicts } = await supabase
      .from('reservations')
      .select('*')
      .eq('resource_id', formData.resource_id)
      .eq('date', formData.date)
      .lt('start_time', formData.end_time)
      .gt('end_time', formData.start_time)

    if (conflicts && conflicts.length > 0) {
      setMessage('Przepraszamy, ten tor jest już zajęty w tym czasie. Wybierz inny czas lub tor.')
      return
    }

    const { error } = await supabase
      .from('reservations')
      .insert([formData])

    if (error) {
      setMessage('Błąd: ' + error.message)
    } else {
      setMessage('Rezerwacja przyjęta! Do zobaczenia!')
      setBookedSlots([])
      loadGridReservations(gridDate)
      setFormData({
        resource_id: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        date: '',
        start_time: '',
        end_time: '',
      })
    }
  }

  const availableSlots = getAvailableStartSlots(formData.date)
  const endSlots = getEndSlots(formData.date, formData.start_time)

  return (
    <main>
      <section className="hero">
        <h1>Rezerwacje</h1>
        <p>Zarezerwuj tor bowlingowy lub stół bilardowy</p>

        <div style={{display: 'flex', gap: '8px', justifyContent: 'center', margin: '30px 0 20px'}}>
          <button
            className={view === 'grid' ? 'type-btn active' : 'type-btn'}
            onClick={() => setView('grid')}
          >
            📅 Dostępność
          </button>
          <button
            className={view === 'form' ? 'type-btn active' : 'type-btn'}
            onClick={() => setView('form')}
          >
            📝 Rezerwuj
          </button>
        </div>

        {view === 'grid' && (
          <div>
            <div style={{display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap'}}>
              <input
                type="date"
                value={gridDate}
                onChange={e => setGridDate(e.target.value)}
                min={getTodayPoland()}
                max={getMaxDate()}
                className="admin-filter-input"
              />
              <button
                className="type-btn"
                onClick={() => setGridDate(getTodayPoland())}
              >
                Dzisiaj
              </button>
            </div>

            <div style={{display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '16px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <div style={{width: '20px', height: '20px', backgroundColor: '#1a0a0f', border: '2px solid #e63946', borderRadius: '4px'}}></div>
                <span style={{color: '#a0a0b0', fontSize: '13px'}}>Zajęty</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <div style={{width: '20px', height: '20px', backgroundColor: '#0a0a0f', border: '1px solid #1e3a5f', borderRadius: '4px'}}></div>
                <span style={{color: '#a0a0b0', fontSize: '13px'}}>Wolny</span>
              </div>
            </div>

            <h2 style={{color: '#0ea5e9', marginBottom: '16px', fontSize: '24px'}}>🎳 Kręgle</h2>

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
                        const booked = isSlotBooked(lane.id, timeSlot)
                        return (
                          <td
                            key={lane.id}
                            className={booked ? 'schedule-booked-cell-public' : 'schedule-empty-cell'}
                          >
                            {booked ? '✕' : ''}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{marginTop: '24px'}}>
              <button className="btn" onClick={() => setView('form')}>
                Zarezerwuj teraz
              </button>
            </div>
          </div>
        )}

        {view === 'form' && (
          <>
            <div className="type-selector">
              <button
                className={selectedType === 'bowling' ? 'type-btn active' : 'type-btn'}
                onClick={() => setSelectedType('bowling')}
              >
                🎳 Bowling
              </button>
              <button
                className={selectedType === 'billiards' ? 'type-btn active' : 'type-btn'}
                onClick={() => setSelectedType('billiards')}
              >
                🎱 Bilard
              </button>
            </div>

            <form className="booking-form" onSubmit={handleSubmit}>
              <select
                name="resource_id"
                value={formData.resource_id}
                onChange={handleChange}
              >
                <option value="">Wybierz {selectedType === 'bowling' ? 'tor' : 'stół'}</option>
                {resources.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>

              <input
                type="text"
                name="customer_name"
                placeholder="Twoje imię i nazwisko"
                value={formData.customer_name}
                onChange={handleChange}
                maxLength={30}
              />

              <input
                type="email"
                name="customer_email"
                placeholder="Twój email"
                value={formData.customer_email}
                onChange={handleChange}
              />

              <input
                type="tel"
                name="customer_phone"
                placeholder="Numer telefonu"
                value={formData.customer_phone}
                onChange={handleChange}
                maxLength={25}
              />

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={getTodayPoland()}
                max={getMaxDate()}
              />

              <div className="time-row">
                <select
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  disabled={!formData.date || !formData.resource_id}
                >
                  <option value="">Godzina start</option>
                  {availableSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
                <span>do</span>
                <select
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  disabled={!formData.start_time}
                >
                  <option value="">Godzina koniec</option>
                  {endSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn">Zarezerwuj</button>
            </form>

            {message && <p className="booking-message">{message}</p>}
          </>
        )}
      </section>
    </main>
  )
}