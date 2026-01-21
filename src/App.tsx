import '@mantine/core/styles.css';
import './styles/global.css';

import { MantineProvider } from '@mantine/core';
import { theme } from './styles/theme';
import { Navbar, Footer } from './components';
import { Hero, About, Skills, Experience, Projects, Certifications, Contact } from './sections';

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <div className="animated-bg" />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </MantineProvider>
  );
}

export default App;
