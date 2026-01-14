// 축구장 크기 상수 (미터 기준)
export const FIELD_WIDTH = 105; // m
export const FIELD_HEIGHT = 68; // m

// 픽셀 변환 비율 (1m = 10px)
export const PIXELS_PER_METER = 10;

// 캔버스 크기
export const CANVAS_WIDTH = FIELD_WIDTH * PIXELS_PER_METER; // 1050px
export const CANVAS_HEIGHT = FIELD_HEIGHT * PIXELS_PER_METER; // 680px

// 선 색상
export const LINE_COLOR = '#ffffff';
export const LINE_WIDTH = 2;

// 축구장 라인 위치 (미터)
export const LINES = {
  // 중앙선
  centerX: FIELD_WIDTH / 2, // 52.5m
  centerY: FIELD_HEIGHT / 2, // 34m

  // 센터 서클
  centerCircleRadius: 9.15, // 9.15m

  // 페널티 박스 (Large Box)
  penaltyBoxWidth: 16.5,
  penaltyBoxHeight: 40.32,
  penaltyBoxDistance: 16.5, // 골 라인에서 페널티 박스까지의 거리

  // 골 에어리어 (Small Box)
  goalAreaWidth: 5.5,
  goalAreaHeight: 18.32,
  goalAreaDistance: 5.5,

  // 페널티 스팟
  penaltySpotDistance: 11,

  // 페널티 아크
  penaltyArcRadius: 9.15,

  // 코너 아크
  cornerArcRadius: 1,

  // 골 포스트
  goalWidth: 7.32, // 7.32m
  goalHeight: 2.44, // 2.44m (골대 높이)
} as const;

// 배경 색상
export const FIELD_COLOR = '#2d5a27'; // 짙은 녹색
export const FIELD_STRIPE_COLOR = '#3d7a37'; // 밝은 녹색 (스트라이프용)

// 그리드 설정
export const GRID_SIZE = PIXELS_PER_METER; // 1m 간격
export const GRID_COLOR = 'rgba(255, 255, 255, 0.12)';
