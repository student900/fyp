import { createBrowserRouter } from "react-router";
import { LearnModule } from "./pages/LearnModule";
import { LearnPathSelect } from "./pages/LearnPathSelect";
import { QuizModule } from "./pages/QuizModule";
import { PracticeModule } from "./pages/PracticeModule";
import { Home } from "./pages/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/learn",
    Component: LearnPathSelect,
  },
  {
    path: "/learn/:track",
    Component: LearnModule,
  },
  {
    path: "/quiz",
    Component: QuizModule,
  },
  {
    path: "/practice",
    Component: PracticeModule,
  },
]);
