const totalChapters = 31; // 잠언은 총 31장
const startDate = new Date("2025-02-14"); // 잠잠성경 시작 날짜

// 날짜 차이를 계산하여 읽을 잠언 장수를 결정하는 함수
function getProverbChapter() {
  const today = new Date();

  // 날짜 차이를 일 단위로 계산
  const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

  // 잠언 31장까지 읽고 다시 1장부터
  const chapter = (daysPassed % totalChapters) + 1;
  return chapter;
}

// 캘린더 생성 및 날짜와 해당하는 잠언 장수 표시
function generateCalendar() {
  const calendarElement = document.getElementById("calendar");
  calendarElement.innerHTML = ""; // 기존 캘린더 초기화

  const today = new Date();
  const currentDay = today.getDay(); // 현재 요일 (0: 일요일, 6: 토요일)

  // 일주일 시작일 (현재 요일을 기준으로 지난 일요일)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDay); // 지난 일요일 날짜로 설정

  const currentChapter = getProverbChapter(); // 오늘의 잠언 장수 계산

  // 일주일 날짜 출력
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);

    const dayElement = document.createElement("div");
    dayElement.classList.add("day");

    // 오늘 날짜 강조
    if (i === currentDay) {
      dayElement.classList.add("today");
    }

    // 날짜 텍스트 삽입
    const dayText = day.toLocaleDateString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
    });
    dayElement.textContent = dayText;

    // 잠언 장수 표시
    const chapterText = ((currentChapter + i - 1) % totalChapters) + 1; // 순차적으로 잠언 장수
    const verseText = `잠언 ${chapterText}장`; // 잠언 장수 텍스트 생성

    const verseElement = document.createElement("div");
    verseElement.classList.add("verse");
    verseElement.textContent = verseText;

    dayElement.appendChild(verseElement); // 캘린더 날짜 밑에 잠언 장수 추가
    calendarElement.appendChild(dayElement);
  }
}

// 페이지가 로드될 때 캘린더 생성
document.addEventListener("DOMContentLoaded", function () {
  generateCalendar();
});

// 24시간마다 새로 고침 (옵션)
setInterval(generateCalendar, 86400000); // 24시간 = 86400000 밀리초

// 📌 성경 구절 불러오기
function loadBibleVerses() {
  fetch("tov.txt") // 서버에서 bible-verses.txt 파일을 요청
    .then((response) => response.text()) // 파일 내용 읽어오기
    .then((data) => {
      const bibleVerses = data
        .split("\n") // 줄바꿈으로 텍스트 분리
        .filter((line) => line.trim() !== ""); // 빈 줄 제거

      // 성경 구절을 웹 페이지에 표시
      const bibleVerseList = document.getElementById("tov");
      bibleVerseList.innerHTML = ""; // 기존 내용 초기화

      // 모든 구절을 <p> 태그로 추가
      bibleVerses.forEach((verse) => {
        const listItem = document.createElement("p");
        listItem.textContent = verse; // 구절 내용 삽입
        bibleVerseList.appendChild(listItem); // 목록에 추가
      });
    })
    .catch((error) => console.error("성경 구절 로드 실패:", error)); // 에러 처리
}

// 📌 주간 광고 불러오기
function loadAnnouncements() {
  fetch("announcements.txt") // 서버에서 announcements.txt 파일을 요청
    .then((response) => response.text()) // 파일 내용 읽어오기
    .then((data) => {
      const announcements = data
        .split("\n") // 줄바꿈으로 텍스트 분리
        .filter((line) => line.trim() !== ""); // 빈 줄 제거
      const announcementList = document.getElementById("announcement-list");
      announcementList.innerHTML = ""; // 기존 내용 초기화

      announcements.forEach((ad) => {
        const listItem = document.createElement("p");
        listItem.textContent = ad; // 광고 내용을 해당 <p> 요소에 넣기
        announcementList.appendChild(listItem); // 목록에 추가
      });
    })
    .catch((error) => console.error("광고 로드 실패:", error)); // 에러 처리
}

// 두 함수가 모두 페이지 로드 시 실행되도록 하나의 window.onload로 합침
window.onload = function () {
  loadBibleVerses(); // 성경 구절 불러오기
  loadAnnouncements(); // 주간 광고 불러오기
};
