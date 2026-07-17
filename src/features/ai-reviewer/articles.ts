import type { ImageSourcePropType } from "react-native";
import type { Href } from "expo-router";

export type ArticleMeta = {
  id: string;
  title: string;
  date: string;
  description: string;
  thumbnail: ImageSourcePropType;
  route: Href;
};

const glossaryHero = require("../../../assets/images/img_article_glossary_hero.png");
const documentsHero = require("../../../assets/images/img_article_documents_hero.png");
const houseIssuesHero = require("../../../assets/images/img_article_house_issues_hero.png");
const houseContactsHero = require("../../../assets/images/img_article_house_contacts_hero.png");

/**
 * "계약 후" 단계의 입주민 추천 콘텐츠 아티클 목록.
 * move-in-record.tsx(입주 상태 기록 화면)의 추천 콘텐츠 섹션과
 * home.tsx(홈 화면)의 "아티클 ZIP" 섹션이 공유하는 단일 소스.
 */
export const ARTICLES: ArticleMeta[] = [
  {
    id: "glossary",
    title: "부동산 비용 관련 용어 정리",
    date: "2026.06.24",
    description:
      "한국에서 집을 계약하다 보면 처음 듣는 부동산 용어가 많이 등장해요. 이때 계약서를 읽거나 중개사의 설명을 들을 때 내용을 이해하지 못하면 중요한 위험 요소를 놓칠 수도 있어요.",
    thumbnail: glossaryHero,
    route: "/ai-reviewer/after/article-glossary",
  },
  {
    id: "documents",
    title: "계약 시 확인할 서류 종류와 이유",
    date: "2026.07.01",
    description:
      "집을 계약할 때는 보증금과 월세만 확인해서는 안돼요. 계약하려는 집이 안전한지, 집주인이 실제 소유자인지, 계약 내용에 문제가 없는지 확인하기 위해 여러 서류를 살펴봐야 합니다.",
    thumbnail: documentsHero,
    route: "/ai-reviewer/after/article-documents",
  },
  {
    id: "house-issues",
    title: "입주 첫날, 집 사진을 꼭 찍어야 하는 이유",
    date: "2026.07.04",
    description:
      "새 집에 들어가면 설레는 마음에 짐부터 정리하기 쉽습니다. 하지만 입주하기 전에 집 곳곳의 상태를 사진으로 남겨두면 나중에 큰 도움이 됩니다.",
    thumbnail: houseIssuesHero,
    route: "/ai-reviewer/after/article-house-issues",
  },
  {
    id: "house-contacts",
    title: "집에 문제가 생겼다면 누구에게 연락해야 할까요?",
    date: "2026.07.10",
    description:
      "상황에 맞는 연락처를 알고 있으면 더 빠르게 해결할 수 있어요. 한국에서 집을 계약한 후 생활하다 보면 예상치 못한 문제가 발생할 수 있습니다.",
    thumbnail: houseContactsHero,
    route: "/ai-reviewer/after/article-house-contacts",
  },
];
