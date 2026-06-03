import { createBrowserRouter } from "react-router";
import { LearnModule } from "./pages/LearnModule";
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
