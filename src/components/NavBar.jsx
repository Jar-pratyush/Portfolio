const nav_links = [
  ['#flagship', '/flagship'],
  ['#results', '/results'],
  ['#work', '/work'],
  ['#profiles', '/profiles'],
  ['#contact', '/contact'],
]

export default function NavBar() {
  return (
    <header className="top_bar">
      <nav className="top_nav" aria-label="Main">
        <a href="#top" className="brand_mark">
          pratyush<span className="accent_txt">.</span>raj
        </a>
        {/* scrolls sideways on small phones instead of wrapping into 3 lines */}
        <div className="nav_links">
          {nav_links.map(([href, txt]) => (
            <a key={href} href={href}>{txt}</a>
          ))}
        </div>
      </nav>
    </header>
  )
}
