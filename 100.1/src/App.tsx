import { Router, Route } from './lib/router';
import { LuxuryFunnel } from './pages/LuxuryFunnel';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';

function App() {
  return (
    <Router>
      <Route path="/" component={LuxuryFunnel} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/order-confirmation" component={OrderConfirmationPage} />
    </Router>
  );
}

export default App;
