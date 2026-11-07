// capstone replay stuff, numbers straight from the eval export (main evaluation, 24 oct 2026)
// each tick row in episodes.json is:
// [phase, action, p95_ms, fail_ratio, rps, healthy, injected_this_tick, [[spec, ready, throttle] x 4 services]]
// phase is l = lead in, f = fault window, p = post

import episode_data from './episodes.json'

export const all_episodes = episode_data

// same order as the per-service arrays inside each tick
export const managed_svcs = ['frontend', 'cartservice', 'currencyservice', 'productcatalogservice']

// rec_tick = first of the 3 healthy ticks that count as recovered, -1 if it never got there
export const scenario_info = {
  f1: {
    title: 'bad deploy · productcatalogservice',
    inject_msg: 'bad deploy: +600 ms latency in productcatalogservice',
    rec_tick: 7,
    verdict: 'Recovered in 59.5 s with one RESTORE. Agent median for bad deploys: 59.3 s (10 of 10). Scripted runbook: 79.7 s.',
  },
  f2cart: {
    title: 'hot pod · cartservice',
    inject_msg: 'hot pod: Chaos Mesh CPU stress in cartservice',
    rec_tick: 6,
    verdict: 'Recovered in 79.2 s with one RESTART. Agent: 5 of 5 on cartservice, median 79.2 s. Runbook: 79.6 s.',
  },
  f2cur: {
    title: 'hot pod · currencyservice',
    inject_msg: 'hot pod: Chaos Mesh CPU stress in currencyservice',
    rec_tick: -1,
    is_miss: true,
    verdict: 'Missed. CPU stress pinned currencyservice at 100% throttle, but p95 stayed at 63–70 ms, right at the 70 ms SLA, so the reward barely moved. The agent never learned this case (0 of 5); the runbook caught 3 of 5.',
  },
  f3cart: {
    title: 'scaled to zero · cartservice',
    inject_msg: 'scaled to zero: cartservice set to 0 replicas',
    rec_tick: 8,
    verdict: 'Recovered in 59.6 s with one RESTORE. Agent: 5 of 5 on cartservice. Note the latency drop: failed requests return fast, so the failure ratio is the real signal.',
  },
  f3cur: {
    title: 'scaled to zero · currencyservice',
    inject_msg: 'scaled to zero: currencyservice set to 0 replicas',
    rec_tick: 5,
    verdict: 'Recovered in 39.8 s with one RESTORE, the fastest case. Agent: 5 of 5 on currencyservice. Runbook: 39.7 s.',
  },
  f4: {
    title: 'traffic surge · frontend',
    inject_msg: 'traffic surge: Locust load ×2.5',
    rec_tick: 8,
    verdict: 'Recovered in 59.7 s with one SCALE_UP; the new pod was ready one tick later. Agent: 10 of 10. Kubernetes HPA was slightly faster here (59.2 s).',
  },
  null: {
    title: 'control run · no fault',
    inject_msg: '',
    rec_tick: -1,
    verdict: 'Correct: no action. The agent stayed hands-off in all 10 fault-free episodes, so it does not raise false alarms.',
  },
}

// which buttons show up on which service tile
export const tile_faults = {
  frontend: [['f4', 'Traffic surge']],
  cartservice: [['f2cart', 'Hot pod'], ['f3cart', 'Scale to zero']],
  currencyservice: [['f2cur', 'Hot pod'], ['f3cur', 'Scale to zero']],
  productcatalogservice: [['f1', 'Bad deploy']],
}

// what plays on its own if nobody clicks anything
export const auto_cycle = ['f1', 'f4', 'f3cart', 'f3cur']

export const policy_rows = [
  { label: 'PER-SAC agent (warm start)', rec: 35, mttr: '79.1 s', false_alarms: '0 / 10', mine: true },
  { label: 'Scripted runbook', rec: 38, mttr: '79.6 s', false_alarms: '0 / 10' },
  { label: 'Kubernetes + HPA', rec: 10, mttr: '360 s', false_alarms: '0 / 10' },
  { label: 'Kubernetes (default)', rec: 0, mttr: '360 s', false_alarms: '0 / 10' },
  { label: 'PER-SAC (cold start)', rec: 15, mttr: '360 s', false_alarms: '10 / 10' },
]

export const key_findings = [
  { big: 'Matches the runbook', small: 'Median MTTR difference about −0.6 s; the 95% bootstrap CI of [−20.0, +0.9] s sits inside the pre-registered 20 s non-inferiority margin.' },
  { big: '0 false alarms', small: 'No action in any of the 10 fault-free episodes. The cold-start agent acted in all 10, which is why the runbook warm start matters.' },
  { big: '0.33 s to decide', small: 'Median from telemetry window close to action dispatched (p95 0.89 s), with zero mask violations or execution errors.' },
  { big: 'Beats Kubernetes', small: 'Plain Kubernetes recovered 0 of 40 faults, and HPA only the 10 traffic surges.' },
]

export const known_limits = [
  'HPA recovered traffic surges slightly faster than the agent (median 59.2 s vs 59.7 s).',
  'The agent never learned CPU stress on currencyservice (0 of 5): latency stayed right at the 70 ms threshold, so the reward barely registered it.',
  'Robustness on a degraded link was not established: the CI upper bound was 20.15 s against a 20 s margin.',
  'Results come from two training seeds; the second also recovered 35 of 40.',
]
