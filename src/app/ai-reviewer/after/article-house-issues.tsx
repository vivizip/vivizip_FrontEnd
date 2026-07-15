import React from "react";
import { Text, View } from "react-native";

import ArticleScreen from "../../../features/ai-reviewer/components/article/ArticleScreen";
import ArticleSection from "../../../features/ai-reviewer/components/article/ArticleSection";
import ArticleParagraph from "../../../features/ai-reviewer/components/article/ArticleParagraph";
import ArticleBulletList from "../../../features/ai-reviewer/components/article/ArticleBulletList";

const heroImage = require("../../../../assets/images/img_article_house_issues_hero.png");
const wallpaperImage = require("../../../../assets/images/img_article_house_issues_wallpaper.png");
const floorImage = require("../../../../assets/images/img_article_house_issues_floor.png");
const moldImage = require("../../../../assets/images/img_article_house_issues_mold.png");
const applianceImage = require("../../../../assets/images/img_article_house_issues_appliance.png");
const windowImage = require("../../../../assets/images/img_article_house_issues_window.png");
const furnitureImage = require("../../../../assets/images/img_article_house_issues_furniture.png");

/**
 * 입주민 추천 콘텐츠 아티클 03 - "입주 첫날, 집 사진을 꼭 찍어야 하는 이유" (Figma node 1179:15354)
 */
export default function ArticleHouseIssuesScreen() {
  return (
    <ArticleScreen
      heroImage={heroImage}
      category="입주 팁"
      title="입주 첫날, 집 사진을 꼭 찍어야 하는 이유"
      date="2026.07.04"
      views={220}
      intro={
        '새 집에 들어가면 설레는 마음에 짐부터 정리하기 쉽습니다. 하지만 입주하기 전에 집 곳곳의 상태를 사진으로 남겨두면 나중에 퇴실하거나 집에 문제가 생겼을 때 큰 도움이 됩니다. 사진은 "이 손상은 내가 만든 것이 아니라 원래 있던 상태였다."는 중요한 증거가 될 수 있습니다. 아래는 실제로 자주 발생하는 사례입니다.'
      }
      closingText="입주 첫날 10~20분만 투자해 집 상태를 기록해 두면, 퇴실 시 발생할 수 있는 불필요한 분쟁을 예방하는 데 큰 도움이 됩니다. 작은 흠집이라도 사진과 영상으로 남겨두는 습관이 여러분의 보증금을 지키는 가장 확실한 방법입니다."
    >
      <ArticleSection
        number={1}
        title="벽지가 찢어져 있었는데 사진을 남기지 않은 경우"
        image={wallpaperImage}
        intro={
          <ArticleParagraph>
            사례: 입주 당시 벽지가 이미 찢어져 있었지만 사진을 찍지 않았는데.
            퇴실할 때 집주인이 "이건 입주 후에 생긴 손상입니다." 라고
            주장하면서 벽지 교체 비용을 요구하는 경우가 있습니다.
          </ArticleParagraph>
        }
        details={
          <>
            <ArticleParagraph>이렇게 예방하세요</ArticleParagraph>
            <ArticleBulletList
              items={[
                "방 전체 사진 촬영",
                "찢어진 부분 확대 촬영",
                "날짜가 기록되는 사진으로 보관",
              ]}
            />
          </>
        }
      />

      <ArticleSection
        number={2}
        title="바닥 긁힘을 기록하지 않은 경우"
        image={floorImage}
        intro={
          <ArticleParagraph>
            사례: 가구를 놓는 공간에 원래부터 긁힌 자국이 있었지만 기록하지
            않아 퇴실할 때 바닥 수리 비용을 요구받는 사례가 있습니다.
          </ArticleParagraph>
        }
        details={
          <>
            <ArticleParagraph>이렇게 예방하세요</ArticleParagraph>
            <ArticleBulletList
              items={["바닥 전체 촬영", "긁힘이나 찍힘 부분 확대 촬영", "방마다 따로 저장"]}
            />
          </>
        }
      />

      <ArticleSection
        number={3}
        title="곰팡이가 있었는데 증거가 없는 경우"
        image={moldImage}
        intro={
          <ArticleParagraph>
            사례: 창문 주변이나 화장실에 곰팡이가 있었지만 사진을 남기지
            않아 집주인이 관리 소홀이라고 주장하며 청소 비용을 요구하는
            경우가 있습니다.
          </ArticleParagraph>
        }
        details={
          <>
            <ArticleParagraph>이렇게 예방하세요</ArticleParagraph>
            <ArticleBulletList items={["창틀", "욕실 실리콘", "천장", "베란다"]} />
            <ArticleParagraph>곰팡이가 있는 곳은 모두 촬영해 두세요.</ArticleParagraph>
          </>
        }
      />

      <ArticleSection
        number={4}
        title="가전제품이 원래 고장 나 있었던 경우"
        image={applianceImage}
        intro={
          <ArticleParagraph>
            사례: 에어컨이나 인덕션이 제대로 작동하지 않았지만 기록하지
            않아 나중에 집주인이 "사용하다가 고장 낸 것 아니냐." 라고
            이야기하는 경우도 있습니다.
          </ArticleParagraph>
        }
        details={
          <>
            <ArticleParagraph>이렇게 예방하세요</ArticleParagraph>
            <ArticleBulletList
              items={["작동 영상을 촬영", "전원이 켜지는 모습 기록", "이상한 소음도 함께 녹화"]}
            />
          </>
        }
      />

      <ArticleSection
        number={5}
        title="창문이나 문이 잘 닫히지 않는 경우"
        image={windowImage}
        intro={
          <ArticleParagraph>
            사례: 입주 당시부터 창문이 잘 닫히지 않았지만 따로 기록하지
            않아 퇴실할 때 수리 비용을 부담하게 되는 사례가 있습니다.
          </ArticleParagraph>
        }
        details={
          <>
            <ArticleParagraph>이렇게 예방하세요</ArticleParagraph>
            <ArticleBulletList
              items={["창문 여닫는 영상", "방문", "현관문", "방충망 상태 촬영"]}
            />
          </>
        }
      />

      <ArticleSection
        number={6}
        title="가구나 옵션의 흠집을 기록하지 않은 경우"
        image={furnitureImage}
        intro={
          <ArticleParagraph>
            사례: 빌트인 가구나 냉장고, 세탁기에 흠집이 있었지만 기록하지
            않으면 퇴실할 때 파손 비용을 요구받을 수 있습니다.
          </ArticleParagraph>
        }
        details={
          <>
            <ArticleParagraph>이렇게 예방하세요</ArticleParagraph>
            <ArticleBulletList
              items={["냉장고", "세탁기", "에어컨", "붙박이장", "싱크대"]}
            />
            <ArticleParagraph>흠집은 가까이에서 촬영해 두세요.</ArticleParagraph>
          </>
        }
      />

      <View className="w-full gap-2 px-4 py-3">
        <Text className="text-headline-s text-gray-800">사진을 찍을 때 팁</Text>
        <ArticleBulletList
          items={[
            "전체 사진과 확대 사진을 모두 남기기",
            "가능하면 영상도 함께 촬영하기",
            "날짜가 표시된 원본 사진 보관하기",
            "방별로 폴더를 만들어 정리하기",
            "발견한 하자는 집주인이나 공인중개사에게 바로 공유하기",
          ]}
        />
      </View>
    </ArticleScreen>
  );
}
