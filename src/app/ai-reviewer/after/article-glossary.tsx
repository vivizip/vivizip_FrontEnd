import React from "react";

import ArticleScreen from "../../../features/ai-reviewer/components/article/ArticleScreen";
import ArticleSection from "../../../features/ai-reviewer/components/article/ArticleSection";
import ArticleParagraph from "../../../features/ai-reviewer/components/article/ArticleParagraph";
import ArticleBulletList from "../../../features/ai-reviewer/components/article/ArticleBulletList";

const heroImage = require("../../../../assets/images/img_article_glossary_hero.png");
const jeonseImage = require("../../../../assets/images/img_article_glossary_jeonse.png");
const wolseImage = require("../../../../assets/images/img_article_glossary_wolse.png");
const depositImage = require("../../../../assets/images/img_article_glossary_deposit.png");
const maintenanceImage = require("../../../../assets/images/img_article_glossary_maintenance.png");

/**
 * 입주민 추천 콘텐츠 아티클 01 - "부동산 비용 관련 용어 정리" (Figma node 1179:15225)
 */
export default function ArticleGlossaryScreen() {
  return (
    <ArticleScreen
      heroImage={heroImage}
      category="용어 정리"
      title="부동산 비용 관련 용어 정리"
      date="2026.06.24"
      views={620}
      intro="한국에서 집을 계약하다 보면 처음 듣는 부동산 용어가 많이 등장해요. 이때 계약서를 읽거나 중개사의 설명을 들을 때 내용을 이해하지 못하면 중요한 위험 요소를 놓칠 수도 있어요. 아래 용어들만 알아도 계약 과정을 훨씬 쉽게 이해할 수 있어요!"
      closingText="이번 편에서 부동산 금액과 관련된 기본 용어를 알아보았어요! 다음 편에서는 계약에 필요한 서류와 안전하게 계약하는 방법을 이해할 수 있는 방법을 소개할게요!"
      initialLikeCount={6}
    >
      <ArticleSection
        number={1}
        title="전세 (Jeonse)"
        image={jeonseImage}
        intro={
          <>
            <ArticleParagraph>전세는 한국의 독특한 임대 방식이에요!</ArticleParagraph>
            <ArticleParagraph>
              세입자가 집주인에게 큰 금액의 보증금을 맡기고, 계약 기간 동안
              월세 없이 거주하는 방식으로 계약이 끝나면 보증금을 다시
              돌려받게 됩니다!
            </ArticleParagraph>
          </>
        }
        details={
          <>
            <ArticleParagraph>예시</ArticleParagraph>
            <ArticleBulletList items={["보증금: 2억 원", "월세: 없음"]} />
            <ArticleParagraph>
              ✔️ 계약 종료 시 보증금을 돌려받을 수 있는지 확인하는 것이 가장
              중요합니다.
            </ArticleParagraph>
          </>
        }
      />

      <ArticleSection
        number={2}
        title="월세 (Monthly Rent)"
        image={wolseImage}
        intro={
          <ArticleParagraph>
            월세는 보증금과 함께 매달 일정 금액 임대료를 내는 방식으로 대학생
            자취방을 구하는 가장 흔한 방식이에요!
          </ArticleParagraph>
        }
        details={
          <>
            <ArticleParagraph>예시</ArticleParagraph>
            <ArticleBulletList items={["보증금: 1,000만 원", "월세: 70만 원"]} />
            <ArticleParagraph>
              ✔️ 보증금이 높을수록 월세는 낮아지는 경우가 많답니다.
            </ArticleParagraph>
          </>
        }
      />

      <ArticleSection
        number={3}
        title="보증금 (Deposit)"
        image={depositImage}
        intro={
          <ArticleParagraph>
            월세는 보증금과 함께 매달 일정 금액 임대료를 내는 방식으로 대학생
            자취방을 구하는 가장 흔한 방식이에요!
          </ArticleParagraph>
        }
        details={
          <>
            <ArticleParagraph>예시</ArticleParagraph>
            <ArticleBulletList items={["보증금: 1,000만 원", "월세: 70만 원"]} />
            <ArticleParagraph>
              ✔️ 보증금이 높을수록 월세는 낮아지는 경우가 많답니다.
            </ArticleParagraph>
          </>
        }
      />

      <ArticleSection
        number={4}
        title="관리비 (Maintenance Fee)"
        image={maintenanceImage}
        intro={
          <ArticleParagraph>
            월세와 별도로 내는 건물 관리 비용입니다.
          </ArticleParagraph>
        }
        details={
          <>
            <ArticleParagraph>
              관리비에는 다음과 같은 항목이 포함될 수 있어요
            </ArticleParagraph>
            <ArticleBulletList
              items={["공동 전기", "청소비", "엘리베이터 관리", "인터넷", "수도"]}
            />
            <ArticleParagraph>
              포함 항목은 건물마다 다르므로 계약 전에 확인해주세요!
            </ArticleParagraph>
          </>
        }
      />
    </ArticleScreen>
  );
}
