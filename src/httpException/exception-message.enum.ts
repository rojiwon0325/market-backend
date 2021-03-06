export enum ExceptionMessage {
  NOT_FOUND = '결과를 찾을 수 없습니다.',
  NOT_FOUND_USER = '사용자를 찾을 수 없습니다.',
  NOT_FOUND_PRODUCT = '상품을 찾을 수 없습니다.',
  VALIDATION = '올바른 형식이 아닙니다.',
  VALIDATION_EMAIL = '이메일 형식이 올바르지 않습니다.',
  USED_REFUND = '이미 요청한 환불/취소 정보가 존재합니다.',
  USED_NAME = '이미 사용중인 이름입니다.',
  USED_EMAIL = '이미 사용중인 이메일입니다.',
  NOT_DELETED = '데이터가 삭제되지 않았습니다.',
  INCORRECT_PASSWORD = '비밀번호가 일치하지 않습니다.',
  UNEXPECTED = '예기치 못한 오류가 발생했습니다.',
  UNAUTHORIZED = '로그인이 필요합니다.',
  FORBIDDEN = '권한이 필요합니다.',
  REQUIRED_PRODUCT_NAME = '상품명이 필요합니다.',
  REQUIRED_PRODUCT_PRICE = '상품 가격이 필요합니다.',
  MIN_PRODUCT_PRICE = '상품 가격은 0이상입니다.',
  REQUIRED_PRODUCT_IMAGE_URL = '상품 이미지 주소가 필요합니다.',
  FAIL_UPLOAD = '업로드에 실패하였습니다.',
  CANT_CANCELING = '이미 배송이 시작된 주문은 취소 요청할 수 없습니다.',
}
