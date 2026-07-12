import "./globals.css"
import Navbar from "./components/Navbar"

export const metadata = {
  title: "Kwazar Bowling Club",
  description: "Zarezerwuj tor bowlingowy lub stół bilardowy",
}

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}