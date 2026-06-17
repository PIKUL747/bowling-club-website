'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function Reservations() {
  const [resources, setResources] = useState([])
  const [selectedType, setSelectedType] = useState('bowling')
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

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')

    // Check for conflicting reservations
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

  return (
    <main>
      <section className="hero">
        <h1>Rezerwacje</h1>
        <p>Zarezerwuj tor bowlingowy lub stół bilardowy</p>

        {/* Type selector */}
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

        {/* Booking form */}
        <form className="booking-form" onSubmit={handleSubmit}>
          <select
            name="resource_id"
            value={formData.resource_id}
            onChange={handleChange}
            required
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
            required
          />

          <input
            type="email"
            name="customer_email"
            placeholder="Twój email"
            value={formData.customer_email}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="customer_phone"
            placeholder="Numer telefonu"
            value={formData.customer_phone}
            onChange={handleChange}
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <div className="time-row">
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              required
            />
            <span>do</span>
            <input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn">Zarezerwuj</button>
        </form>

        {message && <p className="booking-message">{message}</p>}
      </section>
    </main>
  )
}