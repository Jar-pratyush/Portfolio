import { policy_rows, key_findings, known_limits } from '../data/capstone.js'

export default function ScoreBoard() {
  return (
    <section id="results" className="sec_block">
      <h2 className="sec_title reveal_up">How it scored</h2>
      <p className="sec_lead reveal_up">Pre-registered main evaluation on the live cluster: five policies, the same 50 scheduled episodes each (10 per fault type plus 10 with no fault), interleaved. A fault counts as recovered after 3 consecutive healthy ticks with the fault cured; anything slower than 18 ticks is censored at 360 s.</p>

      <div className="score_table reveal_up" role="table" aria-label="Main evaluation results by policy">
        <div className="score_row score_head" role="row">
          <span role="columnheader">policy</span>
          <span role="columnheader">faults recovered (of 40)</span>
          <span role="columnheader">median MTTR</span>
          <span role="columnheader">false alarms</span>
        </div>
        {policy_rows.map((p) => (
          <div key={p.label} className={p.mine ? 'score_row row_mine' : 'score_row'} role="row">
            <span className="pol_name" role="cell">{p.label}</span>
            <span className="rec_cell" role="cell">
              <span className="rec_track"><span className={p.mine ? 'rec_fill fill_mine' : 'rec_fill'} style={{ width: Math.round((p.rec / 40) * 100) + '%' }} /></span>
              <span className="mono_num">{p.rec}/40</span>
            </span>
            <span className="mono_num" role="cell" data-lbl="median MTTR">{p.mttr}</span>
            <span className="mono_num" role="cell" data-lbl="false alarms">{p.false_alarms}</span>
          </div>
        ))}
      </div>
      <p className="fine_print">Unrecovered episodes count as 360 s, so Kubernetes' median is 360 s. False alarms = fault-free episodes (of 10) where the policy acted anyway.</p>

      <div className="find_grid">
        {key_findings.map((f) => (
          <div key={f.big} className="find_card reveal_up">
            <div className="find_big">{f.big}</div>
            <div className="find_small">{f.small}</div>
          </div>
        ))}
      </div>

      <div className="limits_box reveal_up">
        <div className="mono_h warn_h">// known limits</div>
        <ul>
          {known_limits.map((l) => <li key={l}>{l}</li>)}
        </ul>
      </div>
    </section>
  )
}
