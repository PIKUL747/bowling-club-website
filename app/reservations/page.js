'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function Reservations() {
  const [allReservations, setAllReservations] = useState([])
  const [allClosures, setAllClosures] = useState([])
  const [bowlingLanes, setBowlingLanes] = useState([])
  const [billiardsTables, setBilliardsTables] = useState([])
  const [gridDate, setGridDate] = useState('')

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

  function timeToMinutes(time) {
    if (!time) return 0
    const t = time.substring(0, 5)
    if (t === '00:00') return 24 * 60
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }

  useEffect(() => {
    const today = getTodayPoland()
    setGridDate(today)
    loadResources()
  }, [])

  useEffect(() => {
    if (gridDate) {
      loadGridReservations(gridDate)
      loadGridClosures(gridDate)
    }
  }, [gridDate])

  async function loadResources() {
    const { data } = await supabase
      .from('resources')
      .select('*')
      .order('id')
    const all = data || []
    setBowlingLanes(all.filter(r => r.type === 'bowling'))
    setBilliardsTables(all.filter(r => r.type === 'billiards'))
  }

  async function loadGridReservations(date) {
    const { data } = await supabase
      .from('reservations')
      .select('resource_id, start_time, end_time')
      .eq('date', date)
    setAllReservations(data || [])
  }

  async function loadGridClosures(date) {
    const { data } = await supabase
      .from('closures')
      .select('resource_id, start_time, end_time')
      .eq('date', date)
    setAllClosures(data || [])
  }

  function isSlotUnavailable(resourceId, timeSlot) {
    const slotMinutes = timeToMinutes(timeSlot)

    const booked = allReservations.some(r => {
      if (r.resource_id !== resourceId) return false
      return slotMinutes >= timeToMinutes(r.start_time) && slotMinutes < timeToMinutes(r.end_time)
    })

    const closed = allClosures.some(c => {
      if (c.resource_id !== resourceId) return false
      return slotMinutes >= timeToMinutes(c.start_time) && slotMinutes < timeToMinutes(c.end_time)
    })

    return booked || closed
  }

  function renderGrid(resources) {
    return (
      <div className="schedule-wrapper">
        <table className="schedule-table">
          <thead>
            <tr>
              <th className="schedule-time-header">Godzina</th>
              {resources.map(r => (
                <th key={r.id} className="schedule-lane-header">{r.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(timeSlot => (
              <tr key={timeSlot}>
                <td className="schedule-time-cell">{timeSlot}</td>
                {resources.map(r => {
                  const unavailable = isSlotUnavailable(r.id, timeSlot)
                  return (
                    <td
                      key={r.id}
                      className={unavailable ? 'schedule-booked-cell-public' : 'schedule-empty-cell'}
                    >
                      {unavailable ? '✕' : ''}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <main>
      <section className="hero">
        <h1 className="neon-title">Dostępność</h1>
        <p className="neon-subtitle">Sprawdź wolne terminy i zadzwoń do nas aby zarezerwować!</p>

        <div style={{margin: '24px auto', padding: '20px', backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e3a5f', maxWidth: '500px'}}>
          <p style={{fontSize: '18px', color: 'white', marginBottom: '8px'}}>📞 Rezerwacje tylko telefonicznie:</p>
          <a href="tel:537523207" style={{fontSize: '28px', fontWeight: 'bold', color: '#0ea5e9', textDecoration: 'none'}}>
            537 523 207
          </a>
          <p style={{fontSize: '13px', color: '#606070', marginTop: '8px'}}>Pon-Pt: 15:00 - 00:00 | Sob-Nd: 13:00 - 00:00</p>
        </div>

        <div style={{display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center', margin: '20px 0', flexWrap: 'wrap'}}>
          <input
            type="date"
            value={gridDate}
            onChange={e => setGridDate(e.target.value)}
            min={getTodayPoland()}
            max={getMaxDate()}
            className="date-picker-large"
          />
        </div>

        <div style={{display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '24px'}}>
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
        {renderGrid(bowlingLanes)}

        <h2 style={{color: '#0ea5e9', margin: '40px 0 16px', fontSize: '24px'}}>🎱 Bilard</h2>
        {renderGrid(billiardsTables)}

        <div style={{marginTop: '30px', padding: '20px', backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e3a5f', maxWidth: '500px', margin: '30px auto 0'}}>
          <p style={{color: '#a0a0b0', fontSize: '14px'}}>
            Aby zarezerwować tor lub stół bilardowy, zadzwoń pod numer <a href="tel:537523207" style={{color: '#0ea5e9'}}>537 523 207</a> a nasza obsługa wprowadzi rezerwację do systemu.
          </p>
        </div>
      </section>
    </main>
  )
}