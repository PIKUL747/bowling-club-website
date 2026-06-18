'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function Reservations() {
  const [resources, setResources] = useState([])
  const [selectedType, setSelectedType] = useState('bowling')
  const [bookedSlots, setBookedSlots] = useState([])
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

  function getTodayPoland() {
    const now = new Date()
    const polandDate = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Warsaw',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now)
    return polandDate
  }

  function getDayOfWeek(dateString) {
    if (!dateString) return null
    const date = new Date(dateString + 'T12:00:00')
    return date.getDay()
  }

  function timeToMinutes(time) {
    if (time === '00:00') return 24 * 60
    const [h, m] = time.split(':').map(Number)
    return h * 60 + m
  }

  function isStartSlotTaken(slot) {
    const slotMinutes = timeToMinutes(slot)
    return bookedSlots.some(b => {
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
    return getAllSlots(dateString).filter(slot => !isStartSlotTaken(slot))
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

      // Stop if we hit a booked start time
      const blocked = bookedSlots.some(b => {
        const bookedStart = timeToMinutes(b.start_time)
        const nextMinutes = timeToMinutes(nextSlot)
        return nextMinutes > timeToMinutes(startTime) && nextMinutes <= bookedStart && timeToMinutes(startTime) < bookedStart
      })

      endSlots.push(nextSlot)
      current = nextSlot

      // Stop adding end slots after a booked slot
      const hitBooking = bookedSlots.some(b => {
        const nextMinutes = timeToMinutes(nextSlot)
        const bookedStart = timeToMinutes(b.start_time)
        return nextMinutes > timeToMinutes(startTime) && nextMinutes >= bookedStart
      })

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

    if (!formData.resource_id) {
      setMessage('Proszę wybrać tor lub stół.')
      return
    }
    if (!formData.customer_name) {
      setMessage('Proszę podać imię i nazwisko.')
      return
    }
    if (!formData.customer_email) {
      setMessage('Proszę podać email.')
      return
    }
    if (!formData.date) {
      setMessage('Proszę wybrać datę.')
      return
    }
    if (!formData.start_time) {
      setMessage('Proszę wybrać godzinę rozpoczęcia.')
      return
    }
    if (!formData.end_time) {
      setMessage('Proszę wybrać godzinę zakończenia.')
      return
    }

    const todayPoland = getTodayPoland()
    if (formData.date < todayPoland) {
      setMessage('Nie można rezerwować terminów w przeszłości.')
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
      </section>
    </main>
  )
}