import { Router, Route } from './lib/router';
import { LuxuryFunnel } from './pages/LuxuryFunnel';

function App() {
  return (
    <Router>
      <Route path="/" component={LuxuryFunnel} />
    </Router>
  );
}

export default App;
