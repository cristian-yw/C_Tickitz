import { Routes, Route } from 'react-router-dom';
import Movies from './pages/Movies';
import MovieDetail from './pages/Detail';
import Order from './pages/Order'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Movies />} />
      <Route path="/movie/:id" element={<MovieDetail />} />
      <Route path="/order/:id" element={<Order />} />
    </Routes>
  );
}
export default App