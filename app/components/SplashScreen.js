'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function SplashScreen() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 2800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#0a0a0f',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Image
              src="/logo.png"
              alt="Kwazar Bowling Club"
              width={160}
              height={160}
              style={{objectFit: 'contain', borderRadius: '50%', border: '3px solid white'}}
            />
          </motion.div>

          {/* Club name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            style={{
              marginTop: '30px',
              fontSize: '42px',
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              textShadow: '0 0 10px #0ea5e9, 0 0 20px #0ea5e9, 0 0 40px #0ea5e9',
              padding: '0 20px',
            }}
          >
            Kwazar Bowling Club
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{
              marginTop: '12px',
              fontSize: '18px',
              color: '#0ea5e9',
              textShadow: '0 0 8px #0ea5e9',
              letterSpacing: '2px',
            }}
          >
            Tarnów
          </motion.p>

          {/* Loading bar */}
          <motion.div
            style={{
              marginTop: '50px',
              width: '200px',
              height: '3px',
              backgroundColor: '#1e3a5f',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, delay: 0.3, ease: 'easeInOut' }}
              style={{
                height: '100%',
                backgroundColor: '#0ea5e9',
                boxShadow: '0 0 8px #0ea5e9',
                borderRadius: '2px',
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}