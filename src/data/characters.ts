export interface Character {
  id: number;
  name: string;
  image: string;
  synonyms?: string[];
  hint: string;
  description: string;
}

export const characters: Character[] = [
  { id: 1, name: "간디", image: "/ai_portraits/gandhi.png", synonyms: ["마하트마간디", "마하트마", "간디"], hint: "인도의 비폭력 저항 운동가", description: "인도의 민족 운동 지도자로 비폭력 불복종 운동을 전개하여 독립을 이끌어낸 '위대한 영혼'." },
  { id: 2, name: "김구", image: "/ai_portraits/김구.png", synonyms: ["백범", "백범김구", "김구선생님", "김구"], hint: "대한민국 임시정부의 주석, 백범일지", description: "일제강점기 대한민국 임시정부를 이끌며 독립운동에 평생을 바친 민족의 영도자이자 백범일지의 저자." },
  { id: 3, name: "김연아", image: "/ai_portraits/김연아.png", synonyms: ["연아킴", "피겨여왕", "김연아"], hint: "대한민국의 전설적인 피겨 여왕", description: "동계 올림픽 피겨 스케이팅 금메달리스트로, 압도적인 실력과 우아함으로 세계를 제패한 피겨 퀸." },
  { id: 4, name: "나이팅게일", image: "/ai_portraits/나이팅게일.png", synonyms: ["플로렌스", "백의의천사", "나이팅게일"], hint: "크림 전쟁의 백의의 천사", description: "현대 간호학의 창시자로, 크림 전쟁 야전병원에서 헌신적으로 부상병을 돌본 '등불을 든 여인'." },
  { id: 5, name: "나폴레옹", image: "/ai_portraits/나폴레옹.png", synonyms: ["보나파르트", "나폴레옹"], hint: "프랑스 제1제국 황제, 내 사전에 불가능이란 없다", description: "프랑스 혁명 이후 유럽의 패권을 쥐고 나폴레옹 법전을 편찬한 위대한 군사 전략가이자 황제." },
  { id: 6, name: "라이트형제", image: "/ai_portraits/라이트형제.png", synonyms: ["윌버", "오빌", "라이트", "라이트형제"], hint: "최초의 동력 비행기 발명가", description: "수많은 실패를 딛고 인류 최초로 동력 비행기 '플라이어 호' 비행에 성공하여 항공 시대의 막을 연 형제." },
  { id: 7, name: "마리 퀴리", image: "/ai_portraits/마리 퀴리.png", synonyms: ["퀴리부인", "마리퀴리", "퀴리"], hint: "노벨상 2회 수상자, 라듐 발견", description: "방사능 연구의 선구자로 라듐과 폴로늄을 발견하여 여성 최초 및 유일하게 두 분야에서 노벨상을 수상한 과학자." },
  { id: 8, name: "마틴 루터 킹", image: "/ai_portraits/마틴 루터킹.png", synonyms: ["루터킹", "루서킹", "마틴루서킹", "마틴루터킹"], hint: "나에게는 꿈이 있습니다 (I Have a Dream)", description: "미국의 흑인 민권 운동을 이끈 목사로, 비폭력 저항을 통해 인종 차별 철폐에 기여한 평화주의자." },
  { id: 9, name: "방정환", image: "/ai_portraits/방정환.png", synonyms: ["소파", "소파방정환", "방정환선생님", "방정환"], hint: "어린이날 창시자, 소파", description: "'어린이'라는 단어를 만들고 어린이날을 제정하여 아동 인권과 문학에 크게 이바지한 독립운동가 겸 문학가." },
  { id: 10, name: "베토벤", image: "/ai_portraits/베토벤.png", synonyms: ["루트비히", "배토밴", "베토밴", "배토벤", "베토벤"], hint: "청각 장애를 극복한 위대한 작곡가 (운명 교향곡)", description: "고전주의와 낭만주의를 잇는 음악의 성인(악성)으로, 청력을 잃고도 '운명', '합창' 등 걸작을 남긴 작곡가." },
  { id: 11, name: "세종대왕", image: "/ai_portraits/세종대왕.png", synonyms: ["세종", "이도", "세종대왕"], hint: "훈민정음 창제, 조선의 4대 왕", description: "백성을 사랑하는 마음으로 한글을 창제하고 과학 발전, 문화 융성 등 조선의 전성기를 이끈 위대한 성군." },
  { id: 12, name: "스티브 잡스", image: "/ai_portraits/스티브 잡스.png", synonyms: ["잡스", "스티븐잡스", "스티브잡스", "stevejobs"], hint: "애플(Apple)의 창립자, 아이폰의 아버지", description: "탁월한 직관과 혁신적인 디자인 철학으로 개인용 컴퓨터 시대를 열고 스마트폰 혁명을 주도한 IT 아이콘." },
  { id: 13, name: "스티븐 호킹", image: "/ai_portraits/스티븐 호킹.png", synonyms: ["호킹", "스티브호킹", "스티븐호킹"], hint: "루게릭병을 가진 위대한 천재 물리학자", description: "온몸이 마비되는 루게릭병을 지녔음에도 블랙홀과 우주론 연구에 지대한 공헌을 한 세계적인 천체 물리학자." },
  { id: 14, name: "아인슈타인", image: "/ai_portraits/아이슈타인.png", synonyms: ["알베르트", "알버트", "아이슈타인", "아인슈타인"], hint: "상대성 이론, E=mc²", description: "상대성 이론으로 시간과 공간의 개념을 바꾸고 20세기 물리학의 새로운 지평을 연 역사상 가장 위대한 천재." },
  { id: 15, name: "안네", image: "/ai_portraits/안네.png", synonyms: ["안네프랑크", "안네 프랑크", "안네"], hint: "2차 세계대전 유대인 소녀의 영원한 일기 (안네의 일기)", description: "나치를 피해 은신처에서 숨어 지내며 쓴 '안네의 일기'를 통해 홀로코스트의 비극을 역사에 남긴 소녀." },
  { id: 16, name: "안중근", image: "/ai_portraits/안중근.png", synonyms: ["도마", "안중근의사", "안중근", "중근"], hint: "하얼빈의 총성, 이토 히로부미 저격", description: "1909년 하얼빈역에서 이토 히로부미를 사살하여 조국의 독립 의지를 세계에 알린 대한제국의 영웅." },
  { id: 17, name: "안창호", image: "/ai_portraits/안창호.png", synonyms: ["도산", "도산안창호", "안창호선생님", "안창호", "창호"], hint: "독립협회, 신민회, 흥사단을 설립한 교육자", description: "평생을 조국의 독립과 민족의 교육(인재 양성)을 위해 헌신한 굳은 신념과 실천의 민족 지도자." },
  { id: 18, name: "에디슨", image: "/ai_portraits/에디슨.png", synonyms: ["토머스", "토마스", "발명왕", "에디슨"], hint: "천재는 1%의 영감과 99%의 노력으로 이루어진다", description: "전구, 축음기 등 1,000개가 넘는 특허를 남기며 인류의 밤을 밝히고 삶의 방식을 혁신한 발명왕." },
  { id: 19, name: "에이브라함 링컨", image: "/images/에이브라함 링컨.PNG", synonyms: ["링컨", "아브라함", "에이브러햄", "에이브라함"], hint: "국민의, 국민에 의한, 국민을 위한 대통령", description: "미국 남북전쟁을 승리로 이끌며 노예 해방을 선언하고 국가의 분열을 막아낸 미국의 16대 대통령." },
  { id: 20, name: "유관순", image: "/images/유관순.PNG", synonyms: ["유관순열사", "유관순누나", "유관순"], hint: "아우내 장터의 만세 운동 격문, 3.1운동의 상징", description: "어린 나이에도 3.1 독립만세운동의 선두에 서서 가슴속 태극기를 꺼내든 뜨거운 조국애의 상징." },
  { id: 21, name: "윤봉길", image: "/images/윤봉길.PNG", synonyms: ["매헌", "윤봉길의사", "윤봉길"], hint: "상하이 훙커우 공원 도시락 폭탄 투척", description: "수통폭탄으로 일제 수뇌부를 처단하여 중국 정부까지 감동시키며 독립운동에 새로운 활로를 개척한 의사." },
  { id: 22, name: "이순신", image: "/images/이순신.PNG", synonyms: ["충무공", "이순신장군", "이순신"], hint: "임진왜란의 성웅, 거북선 건조, 난중일기", description: "거북선과 철저한 전략으로 임진왜란 중 23전 23승 무패 신화를 쓰며 조선을 구한 영원한 성웅." },
  { id: 23, name: "전봉준", image: "/images/전봉준.PNG", synonyms: ["녹두장군", "전봉준"], hint: "동학농민운동을 이끈 녹두장군", description: "부패한 관리와 외세에 맞서 농민들의 억울함을 풀고 평등한 사회를 외치며 동학농민전쟁을 이끈 농민 지도자." },
  { id: 24, name: "주시경", image: "/images/주시경.PNG", synonyms: ["한힌샘", "주시경선생님", "주시경"], hint: "조선어학회를 창설하고 우리말을 지킨 국어학자", description: "일제강점기 속에서도 우리말과 글의 중요성을 역설하며 현대 국어 문법의 체계를 세운 국어학의 아버지." },
  { id: 25, name: "페이커", image: "/images/페이커.PNG", synonyms: ["이상혁", "faker", "대상혁", "신상혁", "페이커"], hint: "리그 오브 레전드(LoL) 역대 최고 선수, 불사대마왕", description: "압도적인 기량으로 LoL 월드 챔피언십 최다 우승 기록을 쓰며 전 세계 e스포츠의 살아있는 전설이 된 프로게이머." },
  { id: 26, name: "피카소", image: "/images/피카소.PNG", synonyms: ["파블로", "파블로피카소", "피카소"], hint: "입체파(큐비즘)의 거장, 아비뇽의 처녀들", description: "고정관념을 파괴한 입체파 사조를 창시하며 20세기 미술의 새로운 지평을 끊임없이 개척한 회화의 천재." },
  { id: 27, name: "헬렌켈러", image: "/images/헬렌켈러.PNG", synonyms: ["헬렌", "헬렌캘러", "헬렌켈러"], hint: "보지도, 듣지도, 말하지도 못하는 시청각 중복장애를 극복한 기적", description: "설리번 선생님의 가르침으로 장애라는 거대한 장벽을 허물고 사회운동가로 활동하며 전 세계에 희망을 전한 아이콘." }
];
