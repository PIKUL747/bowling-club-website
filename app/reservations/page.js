'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function Reservations() {
  const [allReservations, setAllReservations] = useState([])
  const [lanes, setLanes] = useState([])
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
    loadLanes()
  }, [])

  useEffect(() => {
    if (gridDate) loadGridReservations(gridDate)
  }, [gridDate])

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

  return (
    <main>
      <section className="hero">
        <h1>Dostępność torów</h1>
        <p>Sprawdź wolne terminy i zadzwoń do nas aby zarezerwować!</p>

        <div style={{margin: '24px 0', padding: '20px', backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e3a5f', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto'}}>
          <p style={{fontSize: '18px', color: 'white', marginBottom: '8px'}}>📞 Rezerwacje tylko telefonicznie:</p>
          <a href="tel:537523207" style={{fontSize: '28px', fontWeight: 'bold', color: '#0ea5e9', textDecoration: 'none'}}>
            537 523 207
          </a>
          <p style={{fontSize: '13px', color: '#606070', marginTop: '8px'}}>Pon-Pt: 15:00 - 00:00 | Sob-Nd: 13:00 - 00:00</p>
        </div>

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

        <div style={{marginTop: '30px', padding: '20px', backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e3a5f', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto'}}>
          <p style={{color: '#a0a0b0', fontSize: '14px'}}>
            Aby zarezerwować tor, zadzwoń pod numer <a href="tel:537523207" style={{color: '#0ea5e9'}}>537 523 207</a> a nasza obsługa wprowadzi rezerwację do systemu.
          </p>
        </div>
      </section>
    </main>
  )
}