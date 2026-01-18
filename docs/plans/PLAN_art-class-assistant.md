# Implementation Plan: 미술 수업용 반복 재생 도우미 (Art Class Loop Assistant)

**Status**: 🔄 In Progress
**Started**: 2026-01-18
**Last Updated**: 2026-01-18
**Estimated Completion**: TBD

---

**⚠️ CRITICAL INSTRUCTIONS**: After completing each phase:

1. ✅ Check off completed task checkboxes
2. 🧪 Run all quality gate validation commands
3. ⚠️ Verify ALL quality gate items pass
4. 📅 Update "Last Updated" date above
5. 📝 Document learnings in Notes section
6. ➡️ Only then proceed to next phase

⛔ **DO NOT skip quality gates or proceed with failing checks**

---

## 📋 Overview
### Feature Description

선생님이 YouTube URL과 단계별 설명 텍스트를 입력하면, 화면을 50:50으로 분할하여 왼쪽에는 영상이 무한 반복되고, 오른쪽에는 큰 글씨로 설명이 자동/수동으로 넘어가는 웹 애플리케이션입니다.

### Success Criteria

* [ ] YouTube URL에서 영상 ID를 정확히 추출하여 재생할 수 있다.
* [ ] 영상을 특정 구간 또는 전체 구간 무한 반복 재생할 수 있다.
* [ ] 입력된 설명 텍스트가 정해진 시간 간격으로 순환하며 보여진다.
* [ ] 아이들이 멀리서도 볼 수 있도록 텍스트 가독성이 확보된다 (큰 폰트).

### User Impact

* 교사의 반복적인 설명 노동 감소
* 학생들의 개별 작업 속도 존중 및 자기주도적 학습 환경 조성

---

## 🏗️ Architecture Decisions

| Decision | Rationale | Trade-offs |
| --- | --- | --- |
| **Client-Side Only (SPA)** | 별도의 백엔드 없이 브라우저 상태만으로 빠르게 구현 가능 | 새로고침 시 데이터가 초기화됨 (추후 LocalStorage 적용 가능) |
| **Component Layout** | Split Screen (Left: Video, Right: Text) | 모바일에서는 세로 배치로 반응형 처리 필요 |
| **YouTube IFrame API** | 안정적인 영상 재생 및 제어 가능 | 인터넷 연결 필수, YouTube 정책 의존 |

---

## 🧪 Test Strategy

### Testing Approach

**TDD Principle**: 기능 구현 전, 실패하는 테스트(Red)를 먼저 작성합니다.

### Test Pyramid

| Test Type | Coverage Target | Purpose |
| --- | --- | --- |
| **Unit Tests** | ≥80% | URL 파싱 로직, 슬라이드 타이머 로직 검증 |
| **Component Tests** | Critical paths | 영상 플레이어 렌더링, 텍스트 전환 UI 검증 |
| **E2E Tests** | Key flows | 입력 폼 작성 -> 재생 화면 전환 테스트 |

---

## 🚀 Implementation Phases

### Phase 1: 데이터 모델 및 입력 폼 구현 (Foundation)

**Goal**: 수업 내용(영상 링크, 설명 리스트)을 입력받고 검증하는 로직 구현
**Estimated Time**: 2-3 hours
**Status**: ✅ Completed

#### Tasks

**🔴 RED: Write Failing Tests First**

* [x] **Test 1.1**: YouTube URL 파싱 유틸리티 테스트 작성
* File: `test/unit/utils/youtubeParser.test.js`
* Case: `https://youtu.be/VIDEO_ID` 및 `https://www.youtube.com/watch?v=VIDEO_ID` 입력 시 ID 추출 검증
* Expected: 함수가 없어 실패


* [x] **Test 1.2**: 설명 텍스트 입력 상태 관리 테스트 작성
* File: `test/unit/store/classData.test.js`
* Case: 빈 텍스트 입력 방지, 리스트 추가/삭제 동작 검증
* Expected: Store/Reducer가 없어 실패



**🟢 GREEN: Implement to Make Tests Pass**

* [x] **Task 1.3**: YouTube ID 추출 함수 구현
* File: `src/utils/youtubeParser.js`
* Goal: 정규식을 사용하여 Test 1.1 통과


* [x] **Task 1.4**: 입력 폼 컴포넌트 및 상태 관리 구현
* File: `src/components/SetupForm.jsx`
* Goal: URL 입력 및 설명 단계(Step 1, Step 2...) 추가 기능 구현하여 Test 1.2 통과



**🔵 REFACTOR: Clean Up Code**

* [x] **Task 1.5**: 코드 정리 및 유효성 검사 강화
* 유효하지 않은 URL 입력 시 에러 메시지 처리 로직 개선



#### Quality Gate ✋

* [x] **TDD Compliance**: 파싱 로직 테스트가 먼저 작성되었는가?
* [x] **Test Coverage**: URL 파서 유닛 테스트 통과
* [x] **Functionality**: 입력 폼에서 데이터가 정상적으로 객체화되는지 확인

---

### Phase 2: 설명 텍스트 슬라이드 뷰어 구현 (Instruction Display)

**Goal**: 오른쪽 화면에 들어갈 텍스트 자동/수동 순환 컴포넌트 구현
**Estimated Time**: 2-3 hours
**Status**: ✅ Completed

#### Tasks

**🔴 RED: Write Failing Tests First**

* [x] **Test 2.1**: 슬라이드 인덱스 변경 로직 테스트
* File: `test/unit/hooks/useSlideShow.test.js`
* Case: `next()`, `prev()` 호출 시 인덱스 변경, 마지막 장에서 처음으로 루프 확인
* Expected: Hook이 없어 실패


* [x] **Test 2.2**: 타이머 자동 전환 테스트
* File: `test/component/InstructionViewer.test.jsx`
* Case: 설정된 시간(예: 10초) 후 인덱스가 자동으로 증가하는지 확인 (Mock Timer 사용)



**🟢 GREEN: Implement to Make Tests Pass**

* [x] **Task 2.3**: 슬라이드쇼 로직 Hook 구현 (`useSlideShow`)
* File: `src/hooks/useSlideShow.js`
* Goal: Test 2.1 통과


* [x] **Task 2.4**: 텍스트 디스플레이 컴포넌트 구현
* File: `src/components/InstructionViewer.jsx`
* Goal: 큰 폰트 적용, Test 2.2 통과 (useEffect로 타이머 구현)



**🔵 REFACTOR: Clean Up Code**

* [x] **Task 2.5**: UI 가독성 개선
* 폰트 크기 반응형 처리, 현재 단계 표시기(Pagination dots) 추가



#### Quality Gate ✋

* [x] **TDD Compliance**: 타이머 로직에 대한 테스트가 존재하는가?
* [x] **Functionality**: 텍스트가 순서대로 나오고 반복되는가?

---

### Phase 3: 비디오 플레이어 및 레이아웃 통합 (Integration)

**Goal**: 왼쪽 유튜브 플레이어 연동 및 전체 50:50 레이아웃 완성
**Estimated Time**: 3-4 hours
**Status**: ✅ Completed

#### Tasks

**🔴 RED: Write Failing Tests First**

* [x] **Test 3.1**: 통합 뷰 렌더링 테스트
* File: `test/integration/ClassRoomView.test.jsx`
* Case: 유효한 데이터 주입 시 VideoPlayer와 InstructionViewer가 모두 존재하는지 확인


* [x] **Test 3.2**: 영상 반복 재생 설정 테스트 (Mocking 필요)
* Case: `onEnd` 이벤트 발생 시 다시 재생(`playVideo`)이 호출되는지 검증



**🟢 GREEN: Implement to Make Tests Pass**

* [x] **Task 3.3**: YouTube Player Wrapper 구현
* File: `src/components/VideoLooper.jsx`
* Goal: `react-youtube` 등을 활용, 영상 종료 시점(`onEnd`)에 다시 0초로 seek하여 재생
* Note: `mute` 옵션 고려 (교실 소음 방지)


* [x] **Task 3.4**: Split Screen 레이아웃 구현
* File: `src/pages/ClassRoom.jsx`
* Goal: CSS Grid/Flex를 사용하여 50:50 비율 유지, Test 3.1 통과



**🔵 REFACTOR: Clean Up Code**

* [x] **Task 3.5**: 전체 스타일링 폴리싱
* 아이들이 보기 편한 대비(Contrast) 조정, 전체 화면 모드 버튼 추가



#### Quality Gate ✋

* [x] **Build**: 전체 프로젝트 빌드 성공
* [x] **Manual Testing**: 영상이 끝나면 자동으로 처음으로 돌아가는가?
* [x] **Responsive**: 창 크기를 조절해도 설명 글씨가 잘 보이는가?

---

## ⚠️ Risk Assessment

| Risk | Probability | Impact | Mitigation Strategy |
| --- | --- | --- | --- |
| **인터넷 연결 끊김** | Medium | High | 로딩 실패 시 "네트워크 확인 필요" 메시지를 크게 표시하고 텍스트는 계속 보여주도록 예외 처리 |
| **YouTube 영상 차단** | Low | High | "퍼가기 허용"이 안 된 영상일 경우 사용자에게 알림 제공 |
| **가독성 문제** | Medium | Medium | 텍스트 길이에 따라 폰트 사이즈를 동적으로 조절하는 CSS 로직 추가 고려 |

---

## 🔄 Rollback Strategy

각 단계(Phase)에서 심각한 오류 발생 시:

1. `git revert`를 통해 해당 Phase의 커밋을 되돌립니다.
2. Phase 1(데이터 모델) 변경 시, 입력 폼의 상태 구조를 이전 버전으로 복구합니다.

---

## 📝 Notes & Learnings

### Implementation Notes

* (Phase 진행 중 기록 예정)
