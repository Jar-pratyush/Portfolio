import { useEffect, useReducer, useMemo } from 'react'
import { all_episodes, managed_svcs, scenario_info, tile_faults, auto_cycle } from '../data/capstone.js'
import { capstone_stack, team_repo } from '../data/content.js'
import { use_in_view, wants_less_motion } from '../hooks/use_in_view.js'

const TICK_MS = 850
const BAR_SLOTS = 23
// log10(6000) is the top of the chart, slowest tick we have is ~5 s
const LOG_TOP = Math.log10(6000)

const start_state = { ep_key: 'f1', tick_idx: 0, is_playing: true, user_clicked: false, rest_cnt: 0, cycle_pos: 0 }

function replay_reducer(st, act) {
  if (act.type === 'run') {
    // reduced motion people just get the whole episode at once
    const full_len = act.instant ? all_episodes[act.key].t.length : 0
    return { ...st, ep_key: act.key, tick_idx: full_len, is_playing: !act.instant, user_clicked: true, rest_cnt: 0 }
  }
  if (act.type === 'tick') {
    const n_ticks = all_episodes[st.ep_key].t.length
    if (st.is_playing) {
      if (st.tick_idx < n_ticks) return { ...st, tick_idx: st.tick_idx + 1 }
      return { ...st, is_playing: false, rest_cnt: 0 }
    }
    // auto cycle only until the visitor touches something
    if (st.user_clicked || act.no_auto) return st
    if (st.rest_cnt < 6) return { ...st, rest_cnt: st.rest_cnt + 1 }
    const nxt = (st.cycle_pos + 1) % auto_cycle.length
    return { ...st, ep_key: auto_cycle[nxt], cycle_pos: nxt, tick_idx: 0, is_playing: true, rest_cnt: 0 }
  }
  return st
}

// colours for a service tile based on what the recorded tick says
function tile_look(svc_name, svc_vals, ctx) {
  const [spec_n, ready_n, thr] = svc_vals
  let status_txt = 'healthy'
  let look_cls = 'tile_ok'
  if (spec_n === 0) { status_txt = 'scaled to zero'; look_cls = 'tile_bad' }
  else if (ready_n < spec_n) { status_txt = 'new pod starting'; look_cls = 'tile_warn' }
  else if (thr >= 0.6) { status_txt = `CPU throttled ${Math.round(thr * 100)}%`; look_cls = 'tile_warn' }
  else if (svc_name === 'productcatalogservice' && ctx.ep_key === 'f1' && ctx.cur_i >= ctx.inj_i && ctx.cur_i < ctx.rec_i) {
    // the bad deploy doesnt show in replicas or cpu, only in latency, so flag it by hand
    status_txt = 'bad deploy live'; look_cls = 'tile_bad'
  }
  if (ctx.act_now && ctx.act_now.includes(svc_name)) {
    status_txt = 'agent: ' + ctx.act_now.split(' ')[0]
    look_cls = 'tile_agent'
  }
  return { status_txt, look_cls }
}

export default function CapstoneReplay() {
  const [sec_ref, in_view] = use_in_view('-80px')
  const [st, dispatch] = useReducer(replay_reducer, start_state)
  const less_motion = useMemo(() => wants_less_motion(), [])

  // only tick when the section is on screen and the tab is open
  useEffect(() => {
    if (!in_view) return
    const t_id = setInterval(() => {
      if (document.hidden) return
      dispatch({ type: 'tick', no_auto: less_motion })
    }, TICK_MS)
    return () => clearInterval(t_id)
  }, [in_view, less_motion])

  const run_ep = (key) => dispatch({ type: 'run', key, instant: less_motion })

  const ep = all_episodes[st.ep_key]
  const sc = scenario_info[st.ep_key]
  const ticks = ep.t
  const shown_n = Math.max(1, st.tick_idx)
  const cur_i = shown_n - 1
  const cur = ticks[cur_i]
  const is_done = !st.is_playing && st.tick_idx >= ticks.length

  // where the fault lands and where the agent acted
  let inj_i = -1
  let act_i = -1
  ticks.forEach((tk, i) => {
    if (inj_i < 0 && (tk[6] === 1 || (st.ep_key === 'null' && tk[0] === 'f'))) inj_i = i
    if (act_i < 0 && tk[1]) act_i = i
  })

  // latency bars, log scale so the 5 s spike and the 20 ms baseline both fit
  const bar_list = []
  for (let b = 0; b < BAR_SLOTS; b++) {
    if (b < st.tick_idx && b < ticks.length) {
      const v = Math.max(3, ticks[b][2])
      const h_pct = Math.max(4, Math.min(100, Math.round((Math.log10(v) / LOG_TOP) * 100)))
      bar_list.push({ h_pct, is_ok: ticks[b][5] === 1, is_lead: ticks[b][0] === 'l', is_inj: b === inj_i })
    } else {
      bar_list.push(null)
    }
  }

  // event stream, built from the ticks played so far
  let log_lines = []
  let breached = false
  for (let x = 0; x < st.tick_idx && x < ticks.length; x++) {
    const r = ticks[x]
    const ts = `t=${(x + 1) * 20}s`
    if (x === 0) log_lines.push({ ts, src: 'locust', msg: `30 users · ${r[4]} req/s baseline` })
    if (x === inj_i && sc.inject_msg) log_lines.push({ ts, src: 'chaos', msg: sc.inject_msg })
    if (x === inj_i && st.ep_key === 'null') log_lines.push({ ts, src: 'chaos', msg: 'control: nothing injected' })
    if (inj_i >= 0 && x >= inj_i && !r[5] && !breached) {
      breached = true
      log_lines.push({ ts, src: 'prom', msg: `SLA breach · p95 ${r[2].toLocaleString('en-US')} ms · ${Math.round(r[3] * 100)}% failed` })
    }
    if (x === inj_i + 1 && st.ep_key === 'f2cur') log_lines.push({ ts, src: 'prom', msg: `throttle 100% · p95 ${r[2]} ms, under the SLA` })
    if (r[1]) log_lines.push({ ts, src: 'agent', msg: r[1] })
    if (x === sc.rec_tick) log_lines.push({ ts, src: 'healthy', msg: `3 healthy ticks · recovered in ${ep.mttr} s` })
  }
  if (is_done && st.ep_key === 'f2cur') log_lines.push({ ts: 't=460s', src: 'eval', msg: 'no action in 18 ticks · censored at 360 s' })
  if (is_done && st.ep_key === 'null') log_lines.push({ ts: 't=220s', src: 'agent', msg: 'no action taken · correct' })
  log_lines = log_lines.slice(-7)

  // what stage of the loop we're in right now
  let stage_n = -1
  let chip_txt = '● steady state'
  let chip_cls = 'chip_ok'
  if (inj_i >= 0 && cur_i >= inj_i) {
    if (st.ep_key === 'null') { chip_txt = '● no fault · watching' }
    else if (sc.rec_tick >= 0 && cur_i >= sc.rec_tick) { stage_n = 4; chip_txt = '● recovered' }
    else if (act_i >= 0 && cur_i === act_i) { stage_n = 2; chip_txt = '◆ agent acting'; chip_cls = 'chip_agent' }
    else if (act_i >= 0 && cur_i > act_i) { stage_n = 3; chip_txt = '◆ recovering'; chip_cls = 'chip_agent' }
    else if (cur_i === inj_i) { stage_n = 0; chip_txt = '▲ fault injected'; chip_cls = 'chip_bad' }
    else if (!cur[5]) { stage_n = 1; chip_txt = '▲ SLA breached'; chip_cls = 'chip_warn' }
    else { stage_n = 1; chip_txt = sc.is_miss ? '▲ fault active · unnoticed' : '▲ degrading'; chip_cls = 'chip_warn' }
  }
  const stage_names = ['Fault injected', 'Telemetry degrades', 'Agent decides', 'Kubernetes patch', 'Recovered']
  const stage_cls = ['stage_bad', 'stage_warn', 'stage_agent', 'stage_agent', 'stage_ok']

  const tile_ctx = { ep_key: st.ep_key, cur_i, inj_i, rec_i: sc.rec_tick, act_now: cur[1] }

  return (
    <section id="flagship" ref={sec_ref} className="sec_block reveal_up">
      <div className="chip_row">
        <span className="pill pill_live">● Evaluated on the live cluster · Oct 2026</span>
        <span className="pill">B.Tech capstone</span>
        <span className="pill">Team of 4</span>
        <span className="pill">Role: Principal Architect</span>
      </div>
      <h2 className="flag_title">Self-Healing Cloud Infrastructure using RL</h2>
      <p className="flag_lead">An RL agent watches a live microservices cluster, detects degradation from real telemetry, and acts to recover from injected failures without a human in the loop.</p>
      <p className="flag_cta"><strong>Break it yourself.</strong> Pick a fault on any service the agent manages and replay what the trained agent actually did when that fault hit the real cluster.</p>

      <div className="console_box">
        <div className="console_head">
          <span className="muted_txt">recorded from the real cluster · {sc.title}</span>
          <span className={'phase_chip ' + chip_cls}>{chip_txt}</span>
        </div>

        <div className="tile_area">
          <div className="tile_grid">
            {managed_svcs.map((svc_name, j) => {
              const svc_vals = cur[7][j]
              const { status_txt, look_cls } = tile_look(svc_name, svc_vals, tile_ctx)
              const thr_pct = Math.round(svc_vals[2] * 100)
              return (
                <div key={svc_name} className={'svc_tile ' + look_cls}>
                  <div className="tile_top">
                    <span className="tile_name">{svc_name}</span>
                    <span className="tile_reps">{svc_vals[1]}/{svc_vals[0]} ready</span>
                  </div>
                  <div className="tile_status">{status_txt}</div>
                  <div className="cpu_track" aria-hidden="true">
                    <div className={svc_vals[2] >= 0.6 ? 'cpu_fill cpu_hot' : 'cpu_fill'} style={{ width: thr_pct + '%' }} />
                  </div>
                  <div className="fault_btns">
                    {tile_faults[svc_name].map(([f_key, f_label]) => (
                      <button
                        key={f_key}
                        type="button"
                        className={f_key === st.ep_key ? 'fault_btn fault_on' : 'fault_btn'}
                        aria-label={`${f_label} on ${svc_name}`}
                        aria-pressed={f_key === st.ep_key}
                        onClick={() => run_ep(f_key)}
                      >
                        {f_label}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="other_svcs">
            <span>checkout · payment · shipping · email · recommendation · ad: running, not managed by the agent</span>
            <button type="button" className={st.ep_key === 'null' ? 'fault_btn null_on' : 'fault_btn'} aria-pressed={st.ep_key === 'null'} onClick={() => run_ep('null')}>
              Control run: inject nothing
            </button>
          </div>
        </div>

        <div className="console_body">
          <div className="chart_side">
            <div className="small_head"><span>server-side p95 latency · log scale</span><span>t = {shown_n * 20} s</span></div>
            <div className="bar_chart" role="img" aria-label={`p95 latency per 20 second tick, currently ${cur[2]} ms`}>
              <div className="sla_line" aria-hidden="true" />
              <span className="sla_lbl" aria-hidden="true">SLA 70 ms</span>
              {bar_list.map((b, i) =>
                b ? (
                  <div
                    key={i}
                    className={'lat_bar' + (b.is_ok ? '' : ' lat_bad') + (b.is_lead ? ' lat_lead' : '') + (b.is_inj ? ' lat_inj' : '')}
                    style={{ height: b.h_pct + '%' }}
                  />
                ) : (
                  <div key={i} className="lat_bar lat_empty" />
                )
              )}
            </div>
            <div className="read_grid">
              <div className="read_box"><div className="read_k">p95</div><div className="read_v">{cur[2].toLocaleString('en-US')} ms</div></div>
              <div className="read_box"><div className="read_k">failed</div><div className="read_v">{Math.round(cur[3] * 1000) / 10}%</div></div>
              <div className="read_box"><div className="read_k">requests/s</div><div className="read_v">{cur[4]}</div></div>
            </div>
          </div>

          <div className="log_side">
            <div className="small_head"><span>event stream · one tick = 20 s, replayed fast</span></div>
            <div className="log_list" aria-live="polite">
              {log_lines.map((ln, i) => (
                <div key={st.ep_key + i} className="log_line">
                  <span className="log_ts">{ln.ts}</span>
                  <span className={'log_src src_' + ln.src}>{ln.src}</span>
                  <span className="log_msg">{ln.msg}</span>
                </div>
              ))}
            </div>
            {is_done && <p className={sc.is_miss ? 'verdict_box verdict_miss' : 'verdict_box'}>{sc.verdict}</p>}
          </div>
        </div>

        <ol className="stage_strip">
          {stage_names.map((nm, q) => {
            const lit = q === stage_n || (stage_n === 2 && q === 3)
            return (
              <li key={nm} className={lit ? 'stage_cell ' + stage_cls[q] : 'stage_cell'}>
                <span className="stage_n">0{q + 1}</span>
                {nm}
              </li>
            )
          })}
        </ol>
      </div>
      <p className="fine_print">Every number above is a recorded tick from the main evaluation on the live testbed, not a simulation. The full simulator is coming soon.</p>

      <div className="two_col">
        <div className="reveal_up">
          <h3 className="mono_h">// how it works</h3>
          <p className="body_txt">Locust drives steady load against Google's Online Boutique on K3s, and four fault types hit it: a bad deploy that slows the product catalog, a Chaos Mesh CPU stress on one pod, a service scaled to zero, and a 2.5–3× traffic surge. Every 20 seconds, Prometheus telemetry becomes a 36-value observation in a Gymnasium environment; the agent never sees which fault was injected. A masked Soft Actor-Critic agent with Prioritized Experience Replay, warm-started from runbook transitions, picks one of 12 actions: restart, scale or restore one of four services, or do nothing. It runs as a two-node lab: cluster on one machine, load and agent on another.</p>
        </div>
        <div className="reveal_up">
          <h3 className="mono_h">// my role</h3>
          <p className="body_txt">Set the system architecture and non-negotiable design constraints across the RL, infrastructure, observability and testing workstreams; led integration of the cluster-to-agent bridge.</p>
          <div className="tag_row">
            {capstone_stack.map((t) => <span key={t} className="tag_chip">{t}</span>)}
          </div>
          <a href={team_repo} className="text_link">View the team repo →</a>
        </div>
      </div>
    </section>
  )
}
