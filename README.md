# Market Project

```
 NestJS 연습을 위한 온라인 마켓 프로젝트
```

---

## ❗️CheckList

- [x] 환불/취소 요청시 status로 Canceling | Refunding만 가능하도록 변경
- [x] 환불/취소 상태 변경시(관리자) status가 Canceling -> Cancelled, Refunding -> Refunded 로만 변경
- [x] 환불/취소 신청 or 상태 변경은 기존 상태에 영향을 받아 차단 되는 경우가 있음 ex) 이미 배송중일 때, 취소는 불가능
- [x] 환불/취소 정보에 따라 order상태 값 변경

---

## 🚩 기능구현

<details>
<summary><h3>회원 인증</h3></summary>

- [x] 로그인/로그아웃

</details>
<details>
<summary><h3>회원 관리</h3></summary>

- [x] 회원 가입
- [x] 내 정보 조회
- [ ] 회원 정보 수정
- [x] 회원 탈퇴

- 관리자 기능

* [x] 전체 회원 조회
* [ ] 사용자 정보 변경 (ex) 관리자 권한 부여)
</details>
<details>
<summary><h3>카테고리 및 상품 관리</h3></summary>

- [x] 전체 카테고리 조회
- [x] 카테고리별 상품 조회

* 관리자 기능

- [x] 카테고리 CUD
- [x] 상품 CUD

</details>
<details>
<summary><h3>장바구니</h3></summary>

- [ ] 장바구니 물품 추가
- [ ] 장바구니 보기
- [ ] 장바구니 물품 수정
- [ ] 장바구니 물품 구매
</details>
<details>
<summary><h3>주문 관리</h3></summary>

- [x] 주문 요청
- [x] 내 주문 내역 조회
- [x] 주문 내역 삭제
  - 내 기록을 불러올 때, 필터링 되도록 해야 함(실제 데이터 삭제 x)
  - 관리자는 해당 기록을 계속 확인할 수 있음

* 관리자 기능

- [x] 전체 주문 내역 조회
- [x] 주문 상태 변경(주문 요청 수락, 취소, 환불)

</details>
<details>
<summary><h3>환불/취소</h3></summary>

- [x] 환불/취소 요청
  - 같은 api이지만 status를 다르게 적용
- [x] 내 환불/취소 기록 조회
- [x] 환불/취소 내역 삭제
  - 내 기록을 불러올 때, 필터링 되도록 해야 함(실제 데이터 삭제 x)
  - 관리자는 해당 기록을 계속 확인할 수 있음

* 관리자 기능

- [x] 전체 환불/취소 내역 조회
- [x] 환불/취소 상태 변경

</details>
<details>
<summary><h3>기타</h3></summary>

- [x] 헬스 체크
- [x] 로그인 상태 확인
</details>

---

## 📌 중점 사항

### TDD

- [ ] unit Test 구현
- [ ] e2e Test 구현

### AOP

- [x] middleware, guard, interceptor, pipe, exception filter 활용

  - 책임을 최대한 분리하고 의존성을 낮추자

### Validation & Transformation

- [x] query, param, body데이터에 검증후 (변형이 필요하다면 진행후) 사용
- [x] DB데이터 entity정보에 직렬화

### 브랜치 전략 - GitHub Flow 기반

- 하나의 서비스 단위로 브랜치파서 개발
- 패키지 설치, 단순 이름 변경, 오타수정은 별도 커밋으로 진행
- 기능 구현 단위로 커밋 분리
- PR(MR)후 merge(서비스 개발 과정을 PR 리스트로 한눈에 보기 좋음)
