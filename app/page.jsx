import {
  buildNewsSectionHtml,
  getArticleCards,
} from "../lib/artikel";
import HomeClient from "./HomeClient";

export default function Page() {
  const newsSectionHtml = buildNewsSectionHtml(getArticleCards());
  return <HomeClient newsSectionHtml={newsSectionHtml} />;
}
