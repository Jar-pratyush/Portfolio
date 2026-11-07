import NavBar from './components/NavBar.jsx'
import HeroBlock from './components/HeroBlock.jsx'
import CapstoneReplay from './components/CapstoneReplay.jsx'
import ScoreBoard from './components/ScoreBoard.jsx'
import WorkGrid from './components/WorkGrid.jsx'
import WinsAndStack from './components/WinsAndStack.jsx'
import ProfileLinks from './components/ProfileLinks.jsx'
import FooterBlock from './components/FooterBlock.jsx'

export default function App() {
  return (
    <div className="site_root">
      <a className="skip_link" href="#flagship">Skip to the capstone</a>
      <NavBar />
      <main id="top" className="page_wrap">
        <HeroBlock />
        <CapstoneReplay />
        <ScoreBoard />
        <WorkGrid />
        <WinsAndStack />
        <ProfileLinks />
        <FooterBlock />
      </main>
    </div>
  )
}
