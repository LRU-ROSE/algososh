import { Route, Routes, useNavigate } from "react-router-dom";
import { FibonacciPage } from "../fibonacci-page/fibonacci-page";
import { ListPage } from "../list-page/list-page";
import { MainPage } from "../main-page/main-page";
import { QueuePage } from "../queue-page/queue-page";
import { StringComponent } from "../string/string";
import { SortingPage } from "../sorting-page/sorting-page";
import { StackPage } from "../stack-page/stack-page";

import cs from "./app.module.css";
import { useEffect } from "react";

function App() {
  const navigate = useNavigate();
  // Github pages hack
  useEffect(() => {
    const path = localStorage.getItem("gh-pages-path");
    if (path) {
      localStorage.removeItem("gh-pages-path");
      navigate(path, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cs.app}>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/recursion" element={<StringComponent />} />
        <Route path="/fibonacci" element={<FibonacciPage />} />
        <Route path="/sorting" element={<SortingPage />} />
        <Route path="/stack" element={<StackPage />} />
        <Route path="/queue" element={<QueuePage />} />
        <Route path="/list" element={<ListPage />} />
      </Routes>
    </div>
  );
}

export default App;
