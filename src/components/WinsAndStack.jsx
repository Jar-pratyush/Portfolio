import { wins_list, stack_groups } from '../data/content.js'

export default function WinsAndStack() {
  return (
    <section className="sec_block two_col reveal_up">
      <div>
        <h2 className="sub_title">Leadership &amp; wins</h2>
        <div className="wins_list">
          {wins_list.map((w) => (
            <div key={w.title}>
              <div className="win_title">{w.title}</div>
              {w.when && <div className="win_when">{w.when}</div>}
              <div className="win_txt">
                {w.text}
                {w.link && <> <a href={w.link}>{w.link_txt} ↗</a></>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="sub_title">Stack</h2>
        <div className="stack_list">
          {stack_groups.map((g) => (
            <div key={g.label}>
              <div className="stack_lbl">{g.label}</div>
              <div className="stack_line" aria-hidden="true" />
              <div className="stack_items">{g.items}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
