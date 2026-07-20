import React, { useMemo } from "react";
import { View } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";

// 카카오맵 JavaScript 키 - 도메인/앱 단위로 제한되는 공개용 키라 REST 키와 달리
// 클라이언트 코드에 그대로 포함해도 된다(카카오 로그인의 네이티브 앱 키와 동일 앱, 다른 키 타입).
const KAKAO_JS_KEY = "857ffcd89130f825fec315ada30acf91";

type Props = {
  latitude?: number;
  longitude?: number;
  /** GPS 오차 보정용 - 지도를 탭하거나 핀을 드래그해서 위치를 옮기면 새 좌표를 알려준다. */
  onSelectLocation?: (latitude: number, longitude: number) => void;
};

const buildMapHtml = (latitude: number, longitude: number) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <style>
    html, body, #map { width: 100%; height: 100%; margin: 0; padding: 0; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&autoload=false"></script>
  <script>
    kakao.maps.load(function () {
      var center = new kakao.maps.LatLng(${latitude}, ${longitude});
      var map = new kakao.maps.Map(document.getElementById('map'), {
        center: center,
        level: 3,
      });
      var marker = new kakao.maps.Marker({
        position: center,
        map: map,
        draggable: true,
      });

      function postPosition(latlng) {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            latitude: latlng.getLat(),
            longitude: latlng.getLng(),
          }));
        }
      }

      // 지도를 탭하면 그 위치로 핀을 옮긴다
      kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
        marker.setPosition(mouseEvent.latLng);
        postPosition(mouseEvent.latLng);
      });

      // 핀을 직접 드래그해서 옮겨도 반영한다
      kakao.maps.event.addListener(marker, 'dragend', function () {
        postPosition(marker.getPosition());
      });
    });
  </script>
</body>
</html>
`;

/**
 * 선택한 주소의 지도 미리보기 (Figma) - height 120px, width full, radius 16px.
 * 카카오맵 공식 RN SDK가 없어서 WebView에 카카오맵 JS SDK를 로드하는 방식으로 구현
 * (react-native-webview, 새 네이티브 모듈이라 리빌드 필요). 좌표가 없으면(예: 옛 흐름)
 * 기존처럼 회색 placeholder만 보여준다.
 *
 * 지도 HTML은 마운트 시 좌표로 한 번만 만들고(useMemo, deps 없음) 이후 부모가
 * onSelectLocation으로 받은 좌표를 다시 흘려보내도 재생성하지 않는다 - 탭/드래그로
 * 옮긴 핀 위치는 지도 안에서 자체적으로 반영되므로, source를 다시 만들면 지도 전체가
 * 리로드되면서 방금 옮긴 핀이 원래 좌표로 되돌아가 버린다.
 */
export default function MapPreview({
  latitude,
  longitude,
  onSelectLocation,
}: Props) {
  const hasCoords = latitude != null && longitude != null;

  const htmlSource = useMemo(
    () => (hasCoords ? { html: buildMapHtml(latitude, longitude) } : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (typeof data.latitude === "number" && typeof data.longitude === "number") {
        onSelectLocation?.(data.latitude, data.longitude);
      }
    } catch {
      // 형식이 안 맞는 메시지는 무시
    }
  };

  return (
    <View className="h-[120px] w-full overflow-hidden rounded-2xl bg-gray-200">
      {htmlSource && (
        <WebView
          source={htmlSource}
          style={{ flex: 1, backgroundColor: "transparent" }}
          scrollEnabled={false}
          javaScriptEnabled
          originWhitelist={["*"]}
          onMessage={handleMessage}
        />
      )}
    </View>
  );
}
