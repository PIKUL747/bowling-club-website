'use client'

import "./globals.css"
import Navbar from "./components/Navbar"
import SplashScreen from "./components/SplashScreen"

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>
        <SplashScreen />
        <Navbar />
        {children}
      </body>
    </html>
  )
}