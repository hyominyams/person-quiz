export interface Character {
  id: number;
  name: string;
  image: string;
  synonyms?: string[];
}

export const characters: Character[] = [
  { id: 1, name: "간디", image: "/ai_portraits/gandhi.png", synonyms: ["마하트마간디", "마하트마", "간디"] },
  { id: 2, name: "김구", image: "/ai_portraits/김구.png", synonyms: ["백범", "백범김구", "김구선생님", "김구"] },
  { id: 3, name: "김연아", image: "/ai_portraits/김연아.png", synonyms: ["연아킴", "피겨여왕", "김연아"] },
  { id: 4, name: "나이팅게일", image: "/ai_portraits/나이팅게일.png", synonyms: ["플로렌스", "백의의천사", "나이팅게일"] },
  { id: 5, name: "나폴레옹", image: "/ai_portraits/나폴레옹.png", synonyms: ["보나파르트", "나폴레옹"] },
  { id: 6, name: "라이트형제", image: "/ai_portraits/라이트형제.png", synonyms: ["윌버", "오빌", "라이트", "라이트형제"] },
  { id: 7, name: "마리 퀴리", image: "/ai_portraits/마리 퀴리.png", synonyms: ["퀴리부인", "마리퀴리", "퀴리"] },
  { id: 8, name: "마틴 루터 킹", image: "/ai_portraits/마틴 루터킹.png", synonyms: ["루터킹", "루서킹", "마틴루서킹", "마틴루터킹"] },
  { id: 9, name: "방정환", image: "/ai_portraits/방정환.png", synonyms: ["소파", "소파방정환", "방정환선생님", "방정환"] },
  { id: 10, name: "베토벤", image: "/ai_portraits/베토벤.png", synonyms: ["루트비히", "배토밴", "베토밴", "배토벤", "베토벤"] },
  { id: 11, name: "세종대왕", image: "/ai_portraits/세종대왕.png", synonyms: ["세종", "이도", "세종대왕"] },
  { id: 12, name: "스티브 잡스", image: "/ai_portraits/스티브 잡스.png", synonyms: ["잡스", "스티븐잡스", "스티브잡스", "stevejobs"] },
  { id: 13, name: "스티븐 호킹", image: "/ai_portraits/스티븐 호킹.png", synonyms: ["호킹", "스티브호킹", "스티븐호킹"] },
  { id: 14, name: "아인슈타인", image: "/ai_portraits/아이슈타인.png", synonyms: ["알베르트", "알버트", "아이슈타인", "아인슈타인"] },
  { id: 15, name: "안네", image: "/ai_portraits/안네.png", synonyms: ["안네프랑크", "안네 프랑크", "안네"] },
  { id: 16, name: "안중근", image: "/ai_portraits/안중근.png", synonyms: ["도마", "안중근의사", "안중근", "중근"] },
  { id: 17, name: "안창호", image: "/ai_portraits/안창호.png", synonyms: ["도산", "도산안창호", "안창호선생님", "안창호", "창호"] },
  { id: 18, name: "에디슨", image: "/ai_portraits/에디슨.png", synonyms: ["토머스", "토마스", "발명왕", "에디슨"] },
  { id: 19, name: "에이브라함 링컨", image: "/images/에이브라함 링컨.PNG", synonyms: ["링컨", "아브라함", "에이브러햄", "에이브라함"] },
  { id: 20, name: "유관순", image: "/images/유관순.PNG", synonyms: ["유관순열사", "유관순누나", "유관순"] },
  { id: 21, name: "윤봉길", image: "/images/윤봉길.PNG", synonyms: ["매헌", "윤봉길의사", "윤봉길"] },
  { id: 22, name: "이순신", image: "/images/이순신.PNG", synonyms: ["충무공", "이순신장군", "이순신"] },
  { id: 23, name: "전봉준", image: "/images/전봉준.PNG", synonyms: ["녹두장군", "전봉준"] },
  { id: 24, name: "주시경", image: "/images/주시경.PNG", synonyms: ["한힌샘", "주시경선생님", "주시경"] },
  { id: 25, name: "페이커", image: "/images/페이커.PNG", synonyms: ["이상혁", "faker", "대상혁", "신상혁", "페이커"] },
  { id: 26, name: "피카소", image: "/images/피카소.PNG", synonyms: ["파블로", "파블로피카소", "피카소"] },
  { id: 27, name: "헬렌켈러", image: "/images/헬렌켈러.PNG", synonyms: ["헬렌", "헬렌캘러", "헬렌켈러"] }
];
