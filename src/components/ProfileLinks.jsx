import { profile_links } from '../data/content.js'

export default function ProfileLinks() {
  return (
    <section id="profiles" className="sec_block">
      <h2 className="sec_title reveal_up">Endpoints</h2>
      <div className="prof_grid">
        {profile_links.map((p) => (
          <a key={p.name} href={p.url} className="prof_card reveal_up">
            <span className="prof_name">{p.name} ↗</span>
            <span className="prof_txt">{p.text}</span>
          </a>
        ))}
      </div>
    </section>
  )
}
