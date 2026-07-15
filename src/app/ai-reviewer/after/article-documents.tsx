import React from "react";

import ArticleScreen from "../../../features/ai-reviewer/components/article/ArticleScreen";
import ArticleSection from "../../../features/ai-reviewer/components/article/ArticleSection";
import ArticleParagraph from "../../../features/ai-reviewer/components/article/ArticleParagraph";
import ArticleBulletList from "../../../features/ai-reviewer/components/article/ArticleBulletList";

const heroImage = require("../../../../assets/images/img_article_documents_hero.png");
const registerImage = require("../../../../assets/images/img_article_documents_register.png");
const buildingImage = require("../../../../assets/images/img_article_documents_building.png");
const leaseImage = require("../../../../assets/images/img_article_documents_lease.png");
const brokerageImage = require("../../../../assets/images/img_article_documents_brokerage.png");

/**
 * 입주민 추천 콘텐츠 아티클 02 - "계약 시 확인할 서류 종류와 이유" (Figma node 1179:15289)
 */
export default function ArticleDocumentsScreen() {
  return (
    <ArticleScreen
      heroImage={heroImage}
      category="용어 정리"
      title="계약 시 확인할 서류 종류와 이유"
      date="2026.07.01"
      views={540}
      intro="집을 계약할 때는 보증금과 월세만 확인해서는 안돼요. 계약하려는 집이 안전한지, 집주인이 실제 소유자인지, 계약 내용에 문제가 없는지 확인하기 위해 여러 서류를 살펴봐야 합니다. 아래 서류들은 한국에서 집을 계약할 때 꼭 확인해야 하는 대표적인 문서들이에요."
      closingText="집 계약은 큰 금액이 오가는 중요한 절차입니다. 계약 전에 필요한 서류를 꼼꼼히 확인하면 예상하지 못한 문제를 예방하고, 보증금을 더 안전하게 지킬 수 있습니다. 이해되지 않는 내용이 있다면 공인중개사에게 설명을 요청하고, 계약서에 서명하기 전에 모든 내용을 충분히 확인하는 것이 좋습니다."
      initialLikeCount={10}
    >
      <ArticleSection
        number={1}
        title="등기부등본 (Real Estate Register)"
        image={registerImage}
        intro={
          <>
            <ArticleParagraph>등기부등본이란?</ArticleParagraph>
            <ArticleParagraph>
              부동산의 소유권과 권리관계를 확인할 수 있는 공식 문서입니다. 이
              문서를 통해 집의 실제 소유자와 대출, 압류 등의 정보를 확인할 수
              있습니다.
            </ArticleParagraph>
          </>
        }
        details={
          <>
            <ArticleParagraph>왜 확인해야 할까요?</ArticleParagraph>
            <ArticleParagraph>
              보증금을 안전하게 돌려받기 위해 가장 중요한 서류입니다.
            </ArticleParagraph>
            <ArticleParagraph>
              만약 집에 많은 대출이 있거나 다른 권리자가 있다면 계약이
              위험할 수 있습니다.
            </ArticleParagraph>
            <ArticleParagraph>꼭 확인해야 하는 항목</ArticleParagraph>
            <ArticleBulletList
              items={[
                "집주인이 계약 상대방과 같은 사람인지",
                "근저당권(대출)이 있는지",
                "압류 또는 가압류가 있는지",
                "신탁등기가 있는지",
              ]}
            />
          </>
        }
      />

      <ArticleSection
        number={2}
        title="건축물대장 (Building Register)"
        image={buildingImage}
        intro={
          <>
            <ArticleParagraph>건축물대장이란?</ArticleParagraph>
            <ArticleParagraph>
              건물의 공식 정보를 확인할 수 있는 문서입니다. 건물이 적법하게
              지어졌는지와 건물의 기본 정보를 확인할 수 있습니다.
            </ArticleParagraph>
          </>
        }
        details={
          <>
            <ArticleParagraph>왜 확인해야 할까요?</ArticleParagraph>
            <ArticleParagraph>
              불법 건축물이거나 실제 사용 용도와 다른 건물일 수 있기
              때문입니다.
            </ArticleParagraph>
            <ArticleParagraph>꼭 확인해야 하는 항목</ArticleParagraph>
            <ArticleBulletList
              items={["건물 용도", "건물 면적", "사용승인 여부", "위반건축물 표시 여부"]}
            />
          </>
        }
      />

      <ArticleSection
        number={3}
        title="임대차계약서 (Lease Agreement)"
        image={leaseImage}
        intro={
          <>
            <ArticleParagraph>임대차계약서란?</ArticleParagraph>
            <ArticleParagraph>
              집주인과 세입자가 계약 내용을 약속하는 공식 문서입니다. 계약이
              끝날 때까지 가장 중요한 기준이 되는 문서입니다.
            </ArticleParagraph>
          </>
        }
        details={
          <>
            <ArticleParagraph>왜 확인해야 할까요?</ArticleParagraph>
            <ArticleParagraph>
              계약서에 적힌 내용이 실제 계약 조건이 됩니다.
            </ArticleParagraph>
            <ArticleParagraph>꼭 확인해야 하는 항목</ArticleParagraph>
            <ArticleBulletList
              items={["계약 기간", "보증금", "월세", "관리비", "지급일", "특약사항"]}
            />
            <ArticleParagraph>
              특약사항은 계약마다 내용이 다르므로 반드시 꼼꼼하게 읽어보세요.
            </ArticleParagraph>
          </>
        }
      />

      <ArticleSection
        number={4}
        title="중개대상물 확인·설명서 (Property Explanation Document)"
        image={brokerageImage}
        intro={
          <>
            <ArticleParagraph>중개대상물 확인·설명서란?</ArticleParagraph>
            <ArticleParagraph>
              공인중개사가 계약 전에 반드시 설명해야 하는 문서입니다.
              부동산의 상태와 권리관계를 상세하게 확인할 수 있습니다.
            </ArticleParagraph>
          </>
        }
        details={
          <>
            <ArticleParagraph>왜 확인해야 할까요?</ArticleParagraph>
            <ArticleParagraph>
              계약 후 문제가 생길 수 있는 위험 요소를 미리 확인할 수 있기
              때문입니다.
            </ArticleParagraph>
            <ArticleParagraph>꼭 확인해야 하는 항목</ArticleParagraph>
            <ArticleBulletList
              items={[
                "권리관계",
                "건물 상태",
                "시설 및 설비",
                "관리비",
                "하자 여부",
                "주차 가능 여부",
              ]}
            />
          </>
        }
      />
    </ArticleScreen>
  );
}
