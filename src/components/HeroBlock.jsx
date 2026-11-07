import { hero_stats, my_email } from '../data/content.js'

export default function HeroBlock() {
  return (
    <section className="hero_sec">
      <div className="hero_left">
        <p className="mono_kicker">$ whoami</p>
        <h1 className="hero_name">Pratyush<br />Raj</h1>
        <p className="hero_role">Software Engineer · AI Engineer</p>
        <p className="hero_tag">Software engineer by craft, AI engineer by focus. Currently building a cluster that fixes itself.</p>
        <div className="btn_row">
          <a href="#flagship" className="btn_main">
            Break my cluster
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
          </a>
          <a href="https://github.com/Jar-pratyush" className="btn_ghost">GitHub</a>
          <a href={`mailto:${my_email}`} className="btn_ghost">Email me</a>
        </div>
      </div>

      <div className="stat_card">
        <div className="stat_head"><span>kubectl get stats</span><span className="accent_txt">● all ready</span></div>
        <div className="stat_grid">
          {hero_stats.map((st) => (
            <div key={st.small} className="stat_cell">
              <div className={st.wordy ? 'stat_big stat_wordy' : 'stat_big'}>
                {st.big}{st.extra && <span className="stat_extra"> {st.extra}</span>}
              </div>
              <div className="stat_small">{st.small}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
