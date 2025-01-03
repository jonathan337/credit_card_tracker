import '@/app/globals.css'
import { Inter } from 'next/font/google'
import { Header } from '@/components/Header'
import { Providers } from '@/components/Providers'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Credit Card Forex Tracker',
  description: 'Track your credit card forex spending and payment due dates',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Providers>
            <div className="min-h-screen bg-background">
              <Header />
              {children}
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'