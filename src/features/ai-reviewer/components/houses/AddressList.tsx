import React, { Fragment } from "react";
import { View } from "react-native";

import AddressListItem, { type RegisteredAddress } from "./AddressListItem";

type Props = {
  addresses: RegisteredAddress[];
  onSelect?: (address: RegisteredAddress) => void;
  onPressKebab?: (address: RegisteredAddress) => void;
};

/**
 * 등록된 주소 목록. 최근 등록 순 정렬은 호출부에서 배열 순서로 보장한다.
 * 항목 사이에만 구분선(위아래 16px, bg gray-50) 삽입.
 */
export default function AddressList({
  addresses,
  onSelect,
  onPressKebab,
}: Props) {
  return (
    <View className="w-full">
      {addresses.map((address, index) => (
        <Fragment key={address.id}>
          {index > 0 && <View className="my-4 h-px w-full bg-gray-50" />}
          <AddressListItem
            address={address}
            onPress={() => onSelect?.(address)}
            onPressKebab={() => onPressKebab?.(address)}
          />
        </Fragment>
      ))}
    </View>
  );
}
