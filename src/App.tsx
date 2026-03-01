import { Link } from "react-router";

const App = () => {
  return (
    <div style={{ padding: 16, maxWidth: 680 }}>
      <h1>rq-lab</h1>
      <Link to="/optimisticUpdate">OptimisticUpdate</Link>
      <br />
      <Link to="/refetchOnWindowFocus">RefetchOnWindowFocus</Link>
    </div>
  );
};

export default App;
