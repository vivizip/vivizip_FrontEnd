import React from "react";
import { Text, View } from "react-native";

import ArticleScreen from "../../../features/ai-reviewer/components/article/ArticleScreen";
import ArticleSection from "../../../features/ai-reviewer/components/article/ArticleSection";
import ArticleParagraph from "../../../features/ai-reviewer/components/article/ArticleParagraph";
import ArticleBulletList from "../../../features/ai-reviewer/components/article/ArticleBulletList";

const heroImage = require("../../../../assets/images/img_article_house_contacts_hero.png");
const boilerImage = require("../../../../assets/images/img_article_house_contacts_boiler.png");
const waterLeakImage = require("../../../../assets/images/img_article_house_contacts_water_leak.png");
const applianceImage = require("../../../../assets/images/img_article_house_contacts_appliance.png");
const electricityImage = require("../../../../assets/images/img_article_house_contacts_electricity.png");
const internetImage = require("../../../../assets/images/img_article_house_contacts_internet.png");
const doorLockImage = require("../../../../assets/images/img_article_house_contacts_door_lock.png");
const elevatorImage = require("../../../../assets/images/img_article_house_contacts_elevator.png");
const windowImage = require("../../../../assets/images/img_article_house_contacts_window.png");
const commonFacilityImage = require("../../../../assets/images/img_article_house_contacts_common_facility.png");

/**
 * 입주민 추천 콘텐츠 아티클 04 - "집에 문제가 생겼다면 누구에게 연락해야 할까요?" (Figma node 1179:15438)
 */
export default function ArticleHouseContactsScreen() {
  return (
    <ArticleScreen
      heroImage={heroImage}
      category="입주 팁"
      title="집에 문제가 생겼다면 누구에게 연락해야 할까요?"
      date="2026.07.10"
      views={620}
      intro="상황에 맞는 연락처를 알고 있으면 더 빠르게 해결할 수 있어요. 한국에서 집을 계약한 후 생활하다 보면 예상치 못한 문제가 발생할 수 있습니다. 물이 나오지 않거나, 보일러가 고장 나거나, 엘리베이터가 멈추는 등 다양한 상황이 생길 수 있는데요. 문제의 종류에 따라 연락해야 하는 사람이 다릅니다. 아래 내용을 미리 알아두면 당황하지 않고 빠르게 대처할 수 있습니다."
      closingText="집에 문제가 생겼을 때는 누구에게 연락해야 하는지 아는 것만으로도 문제를 더 빠르게 해결할 수 있습니다. 또한 문제를 발견했다면 사진이나 영상을 남기고, 문자나 메신저로 기록을 남겨두는 습관은 추후 분쟁을 예방하는 데 큰 도움이 됩니다."
    >
      <ArticleSection
        number={1}
        title="보일러가 작동하지 않아요."
        image={boilerImage}
        intro={
          <ArticleParagraph>
            누구에게 연락해야 하나요? 👉 집주인 또는 공인중개사{"\n"}
            보일러는 집의 주요 시설이기 때문에 먼저 집주인에게 알려야
            합니다. 집주인이 수리 업체를 연결하거나 직접 수리를 진행하는
            경우가 많습니다.
          </ArticleParagraph>
        }
        details={
          <>
            <ArticleParagraph>이렇게 해보세요.</ArticleParagraph>
            <ArticleBulletList
              items={[
                "전원이 켜져 있는지 확인하기",
                "에러 코드가 있다면 사진 찍기",
                "집주인에게 사진과 함께 전달하기",
              ]}
            />
          </>
        }
      />

      <ArticleSection
        number={2}
        title="수도가 나오지 않거나 누수가 생겼어요."
        image={waterLeakImage}
        intro={
          <ArticleParagraph>
            누구에게 연락해야 하나요?👉 집주인{"\n"}
            누수는 시간이 지날수록 피해가 커질 수 있으므로 가능한 빨리
            알려야 합니다.
          </ArticleParagraph>
        }
        details={
          <>
            <ArticleParagraph>이렇게 해보세요.</ArticleParagraph>
            <ArticleBulletList
              items={[
                "누수 부위를 사진 또는 영상으로 기록하기",
                "물이 새는 위치를 설명하기",
                "즉시 집주인에게 연락하기",
              ]}
            />
          </>
        }
      />

      <ArticleSection
        number={3}
        title="에어컨이나 옵션 가전이 고장 났어요."
        image={applianceImage}
        intro={
          <ArticleParagraph>
            누구에게 연락해야 하나요?👉 집주인{"\n"}
            옵션으로 제공된 가전제품은 대부분 집주인이 관리합니다. 임의로
            수리하기 전에 먼저 집주인과 상의하는 것이 좋습니다.
          </ArticleParagraph>
        }
        details={null}
      />

      <ArticleSection
        number={4}
        title="전기가 갑자기 나갔어요."
        image={electricityImage}
        intro={
          <ArticleParagraph>
            누구에게 연락해야 하나요?{"\n"}
            먼저 차단기(두꺼비집)가 내려갔는지 확인하세요.
          </ArticleParagraph>
        }
        details={
          <ArticleBulletList
            items={[
              "차단기가 내려간 경우 → 직접 올려보기",
              "계속 내려간다면 👉 집주인 또는 관리사무소",
              "건물 전체가 정전이라면 👉 관리사무소",
            ]}
          />
        }
      />

      <ArticleSection
        number={5}
        title="인터넷이 되지 않아요."
        image={internetImage}
        intro={
          <>
            <ArticleParagraph>
              누구에게 연락해야 하나요? 👉상황에 따라 다릅니다.
            </ArticleParagraph>
            <ArticleBulletList
              items={[
                "개인이 가입한 인터넷 → 통신사 고객센터",
                "건물에서 제공하는 인터넷 → 관리사무소 또는 집주인",
              ]}
            />
            <ArticleParagraph>
              공유기 전원을 한 번 껐다 켜보는 것도 도움이 됩니다.
            </ArticleParagraph>
          </>
        }
        details={null}
      />

      <ArticleSection
        number={6}
        title="현관문이나 도어락이 고장 났어요."
        image={doorLockImage}
        intro={
          <ArticleParagraph>
            누구에게 연락해야 하나요?{"\n"}👉 집주인{"\n"}
            배터리가 부족한 경우도 있으니 먼저 확인해 보세요.{"\n"}
            문이 열리지 않는다면 집주인에게 바로 연락하는 것이 좋습니다.
          </ArticleParagraph>
        }
        details={null}
      />

      <ArticleSection
        number={7}
        title="엘리베이터가 멈췄어요."
        image={elevatorImage}
        intro={
          <ArticleParagraph>
            누구에게 연락해야 하나요?{"\n"}👉 관리사무소{"\n"}
            엘리베이터 안에 비상 호출 버튼이 있다면 먼저 눌러 도움을
            요청하세요.{"\n"}
            무리하게 문을 열려고 하지 않는 것이 중요합니다.
          </ArticleParagraph>
        }
        details={null}
      />

      <ArticleSection
        number={8}
        title="창문이 깨졌거나 방충망이 망가졌어요."
        image={windowImage}
        intro={
          <ArticleParagraph>
            누구에게 연락해야 하나요?{"\n"}👉 집주인{"\n"}
            원인을 확인하기 위해 사진을 먼저 찍어 두세요.{"\n"}
            수리를 진행하기 전에 집주인과 먼저 상의하는 것이 좋습니다.
          </ArticleParagraph>
        }
        details={
          <ArticleBulletList
            items={[
              "차단기가 내려간 경우 → 직접 올려보기",
              "계속 내려간다면 → 집주인 또는 관리사무소",
              "건물 전체가 정전이라면 → 관리사무소",
            ]}
          />
        }
      />

      <ArticleSection
        number={9}
        title="공동시설에 문제가 있어요."
        image={commonFacilityImage}
        intro={
          <>
            <ArticleParagraph>
              예를 들어{"\n"}
              복도 조명이 꺼짐{"\n"}
              현관 자동문 고장{"\n"}
              쓰레기장이 잠겨 있음{"\n"}
              주차장 출입문 고장
            </ArticleParagraph>
            <ArticleParagraph>
              누구에게 연락해야 하나요?{"\n"}👉 관리사무소{"\n"}
              공용 시설은 관리사무소에서 관리하는 경우가 많습니다.
            </ArticleParagraph>
          </>
        }
        details={null}
      />

      <View className="w-full gap-2 px-4 py-3">
        <Text className="text-headline-s text-gray-800">
          문제가 생겼을 때 기억하세요!
        </Text>
        <ArticleParagraph>먼저 사진이나 영상을 찍어 두세요.</ArticleParagraph>
        <ArticleParagraph>발견한 날짜와 시간을 기록해 두세요.</ArticleParagraph>
        <ArticleParagraph>
          집주인, 관리사무소에 가능한 빨리 알려주세요.
        </ArticleParagraph>
        <ArticleParagraph>
          문자나 메신저로 남기면 나중에 확인하기 쉽습니다.
        </ArticleParagraph>
      </View>
    </ArticleScreen>
  );
}
