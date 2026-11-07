// all the text on the site lives here so i only edit one file
// ratings are from oct 2026, update them before applying anywhere

export const my_email = 'rajpratyush0902@gmail.com'

export const hero_stats = [
  { big: '9.08', small: 'CGPA · B.Tech CSE, Vellore Institute of Technology' },
  { big: '1990', small: 'LeetCode Knight' },
  { big: '1419', small: 'Codeforces Specialist' },
  { big: '3★', extra: '1603', small: 'CodeChef peak' },
  { big: 'Principal architect', small: '4-person RL capstone', wordy: true },
  { big: 'Top 17', small: 'IIT Bombay E-Summit NEC', wordy: true },
]

// shipped = has a public repo, offline = being rebuilt, local = trained on my machine only
export const work_items = [
  {
    kind: 'shipped',
    name: 'AI Customer Support Automation',
    blurb: 'Built during the IBM Agentic AI program. Routes tickets with an LLM classifier, answers from a FAISS-backed RAG knowledge base, and pauses high-risk replies for human approval.',
    stack: 'LangGraph · FAISS · Ollama (Llama 3.2) · SQLite checkpointing',
    link: 'https://github.com/Jar-pratyush/Customer-Support-Automation-using-LangGraph-RAG-and-HITL',
  },
  {
    kind: 'shipped',
    name: 'HTTP Server from Scratch',
    blurb: 'A web server built from raw sockets to understand how frameworks like Django and Flask handle requests: parsing, routing and responses.',
    stack: 'Python · sockets · HTTP/1.1',
    link: 'https://github.com/Jar-pratyush/http-server-python',
  },
  {
    kind: 'shipped',
    name: 'GenAI Assistant Trio',
    blurb: 'Three Groq-powered productivity tools from the CodeChef Weekend Dev Challenge: summarisation, reply drafting and news briefing.',
    stack: 'Python · Groq API · prompt engineering',
    many_links: [
      { txt: 'Study Assistant', url: 'https://github.com/Jar-pratyush/Student_Study_Assistant' },
      { txt: 'Office Assistant', url: 'https://github.com/Jar-pratyush/Smart_Office_Assistant' },
      { txt: 'News Brief', url: 'https://github.com/Jar-pratyush/News_Brief_Assistant' },
    ],
  },
  {
    kind: 'offline',
    name: 'Distributed Async Task Queue Engine',
    blurb: 'FastAPI accepts tasks; workers consume them from Redis Streams with retries, concurrency limits and a dead-letter queue. Prometheus and Grafana monitoring, deployed on AWS EC2.',
    stack: 'FastAPI · Redis Streams · Docker · Grafana · EC2',
  },
  {
    kind: 'offline',
    name: 'Evaluated Guardrail Agent with CI',
    blurb: 'A LangGraph agent that blocks prompt injections and masks personal data first. Evals run on every push through GitHub Actions, so regressions fail the build.',
    stack: 'LangGraph · LLM APIs · GitHub Actions',
  },
  {
    kind: 'offline',
    name: 'Real-Time Collaborative Whiteboard',
    blurb: 'React and Canvas drawing synced live over Socket.io, with JWT auth in the WebSocket handshake and boards persisted in MongoDB.',
    stack: 'React · Canvas · Socket.io · MongoDB · JWT',
  },
  {
    kind: 'offline',
    name: "Rubik's Cube Solver",
    blurb: "A C++ cube model solving 13-move scrambles in under 10 seconds with Korf's IDA*, benchmarked against BFS and DFS.",
    stack: 'C++ · IDA* · BFS/DFS · OOP',
  },
  {
    kind: 'local',
    name: 'Medical Abstract Classifier',
    blurb: 'Hybrid SciBERT, GRU and CNN classifier for sentences in medical abstracts; targeted tuning gave a ~5% gain over baselines.',
    stack: 'SciBERT · TensorFlow',
  },
  {
    kind: 'local',
    name: 'Dog Breed Classifier',
    blurb: 'Transfer-learning CNN for animal rescue centres: 120 breeds, Stanford Dogs (20,000+ images), 95% test accuracy.',
    stack: 'CNN transfer learning · TensorFlow',
  },
]

export const wins_list = [
  { title: 'Team Lead, Research Team · Entrepreneurship Club, Vellore Institute of Technology', when: 'Aug 2024 – Jun 2025', text: 'Led a technical team building data-collection pipelines and analytics dashboards that supported research for 4 early-stage startups.' },
  { title: 'IIT Bombay E-Summit, National Entrepreneurship Challenge', text: 'Top 17 nationally.' },
  { title: 'Building Agents with Agentic AI · IBM', text: 'IBM Career Education Program, July 2026.', link_txt: 'Verify', link: 'https://courses.ibmcep.cognitiveclass.ai/certificates/1ee21a409f9047dfbee05b3cec77a176' },
  { title: 'AI for Real-World Apps · TCS iON & IIT Kharagpur', text: 'Certification.', link_txt: 'View', link: 'https://drive.google.com/file/d/1x23qU_PtuI1cQYqaNhfeVuxYOpzk2I3X/view?usp=drive_link' },
  { title: 'Agentic AI Workshop builds · ongoing', text: 'Day 0–4 so far: LangGraph agents, human-in-the-loop, checkpoints with MLflow and Docker, ReAct loops.' },
  { title: 'Inter-school badminton champion', text: 'Runner-up the following year.' },
]

export const stack_groups = [
  { label: 'reinforcement learning', items: 'MDPs, actor-critic, Soft Actor-Critic, Prioritized Experience Replay, reward design, custom Gymnasium envs, Tianshou' },
  { label: 'agentic ai & llms', items: 'LangGraph, RAG, FAISS, FastMCP, CrewAI, human-in-the-loop, ReAct, MLflow, Ollama, Groq, Gemini' },
  { label: 'backend & systems', items: 'FastAPI, Node.js, Express, gRPC, Socket.io, Redis, PostgreSQL, MongoDB, sockets and HTTP internals' },
  { label: 'infra & devops', items: 'Docker, Kubernetes (K3s), Prometheus, Grafana, Chaos Mesh, Locust, GitHub Actions, Nginx, AWS' },
  { label: 'languages', items: 'C++, Python, Java, JavaScript/TypeScript, SQL' },
]

export const profile_links = [
  { name: 'GitHub', url: 'https://github.com/Jar-pratyush', text: 'Systems, AI agents and backend builds, from an HTTP server written from scratch to RL-driven infrastructure.' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/pratyush-raj-45b022294/', text: "Experience, leadership and what I'm building now." },
  { name: 'LeetCode', url: 'https://leetcode.com/u/Jarinnit/', text: 'Knight: contest rating 1990, built on consistent pattern-level problem solving.' },
  { name: 'Codeforces', url: 'https://codeforces.com/profile/jarinnit', text: 'Specialist (1419): speed and correctness under contest pressure.' },
  { name: 'CodeChef', url: 'https://www.codechef.com/users/jarinnit', text: 'Peak 3★ (1603) across 14 rated contests · 242 problems solved.' },
  { name: 'AtCoder', url: 'https://atcoder.jp/users/jarinnit', text: 'Active in AtCoder contests: precise, math-heavy problem solving.' },
]

export const capstone_stack = ['Python', 'PyTorch', 'Tianshou', 'Gymnasium', 'K3s', 'Prometheus', 'Chaos Mesh', 'Locust', 'gRPC', 'Linux']
export const team_repo = 'https://github.com/zaidbinshams/self-healing-cloud-infrastructure'
