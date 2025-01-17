import React from 'react'
import { NavItem } from '@/components/NavItem'

const navs = [
  { animatedBackground: '/bg-home.gif', path: '/', title: 'Retour', condition: true, isBtn: false, action: () => { } },
  { animatedBackground: '/bg-card.gif', path: '/decks/create', title: 'Mes decks', condition: true, isBtn: false, action: () => { } },
  { animatedBackground: '/bg-decks.gif', path: '/decks/my-cards', title: 'Mes cartes', condition: true, isBtn: false, action: () => { } },
  { animatedBackground: '/bg-deck.gif', path: '/exchange-history', title: 'Mes échanges', condition: true, isBtn: false, action: () => { } },
]

const DeckHome = () => {
  return (
    <div className="hero items-center min-h-screen text-gray-300 bg-[url('/bg-deck.gif')] bg-cover">
      <div className="hero-overlay bg-gray-900 opacity-60 h-full" />
      <div className="hero-content text-center flex flex-col">
        <div className="max-w-md">
          <h1 className="-mt-20 text-5xl font-bold">
            Crafting zone
          </h1>
        </div>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {navs.filter(auth => auth.condition === true).map((nav, index) => (
            <NavItem
              key={index}
              title={nav.title}
              videoUrl={nav.animatedBackground}
              linkUrl={nav.path}
              isButton={nav.isBtn}
              action={nav.action}
            />
          ))}
        </div>
      </div>
    </div >
  )

}

export default DeckHome
