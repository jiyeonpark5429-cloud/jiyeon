let selected = null;
let workflowDestination = null;
let selectedGroup = null;
let selectedWorkflowGroup = null;
const $ = (selector) => document.querySelector(selector);
const toolHints = {
  GPT: '문서화와 초안 작성에 적합합니다.',
  Claude: '구조화된 기획과 문서 초안에 적합합니다.',
  Perplexity: '최신 공식 자료와 출처 탐색에 적합합니다.',
  Liner: '웹페이지·PDF 기반 자료 탐색에 적합합니다.',
  NotebookLM: '업로드된 소스 안에서의 분석·대조에 적합합니다.'
};

const optionLibrary = {
  '조사 기간': ['최근 1년', '최근 3년', '현재 공고만', '기타 직접 입력'],
  '비교 기관': ['비교하지 않음', '서울 소재 대학', '국공립대학', '기타 직접 입력'],
  '원하는 결과 형식': ['핵심 요약', '비교표', '체크리스트', '기타 직접 입력'],
  '문체': ['친절하고 쉬운 안내', '간결한 행정 안내', '격식 있는 공문체', '기타 직접 입력'],
  '게시 채널': ['홈페이지 공지', '이메일', '포털 공지', '메신저/문자', '기타 직접 입력'],
  '포함할 FAQ': ['포함하지 않음', '3문항', '5문항', '기타 직접 입력'],
  '회의 일시': ['이번 주', '다음 주', '직접 입력'],
  '참석 부서': ['우리 부서만', '유관 부서 포함', '외부 협력기관 포함', '기타 직접 입력'],
  '표 형식': ['표 없이 서술', '핵심 요약 표', '담당·기한 표', '기타 직접 입력'],
  '언어': ['한국어', '한국어·영어 병기', '영어', '기타 직접 입력'],
  '채널': ['홈페이지', '이메일', 'SNS', '복수 채널', '기타 직접 입력'],
  '일정': ['일정 미정', '확정 일정 입력', '상대 일정에 맞춤', '기타 직접 입력'],
  '홍보 채널': ['홈페이지 공지', '이메일', 'SNS', '포스터/디지털 사이니지', '기타 직접 입력'],
  '분위기': ['신뢰감 있는 공식형', '밝고 친근한 교육형', '간결한 정보형', '기타 직접 입력'],
  '우선순위': ['긴급 확인', '이번 주 처리', '일반 검토', '기타 직접 입력'],
  '관련 부서': ['학과·단과대', '대학본부', '직속·부속기관', '외부 협력기관', '기타 직접 입력'],
  '결과 형식': ['핵심 요약', '표 중심', '체크리스트', '실행계획', '기타 직접 입력'],
  '검토자': ['작성자 자체 점검', '팀장·부서장', '유관 부서', '담당 부서 지정', '기타 직접 입력'],
  '기본': ['간단한 1페이지', '상세 안내', '표 중심 정리', '체크리스트', '기타 직접 입력']
};

const successCriteriaByGroup = {
  '교육·학사 운영': ['수신자가 읽은 뒤 본인의 대상 여부·해야 할 일·마감일을 1분 안에 판단할 수 있음', '신청·수강·제출 절차를 순서대로 실행할 수 있고, 각 단계의 문의처가 분명함', '학사 용어와 일정이 공식 근거와 일치하며, 예외·미확인 사항은 별도 표시됨', '반복 문의가 예상되는 지점을 FAQ 또는 유의사항으로 선제적으로 해소함', '기타 직접 입력'],
  '학생·입학·국제 지원': ['대상자가 자격·제출물·일정을 스스로 확인하고 다음 행동을 결정할 수 있음', '지원·신청 과정에서 놓치기 쉬운 단계와 공식 확인처가 명확히 분리되어 있음', '한국어가 익숙하지 않은 수신자도 핵심 행동을 이해할 수 있는 짧고 쉬운 문장임', '개별 심사·선발 판단 없이 공개된 사실과 문의 경로만 정확히 전달함', '기타 직접 입력'],
  '연구·산학 지원': ['연구자가 공고의 대상·기간·제출물·문의처를 표 하나로 비교해 준비 여부를 판단할 수 있음', '공개 근거와 내부 확인이 필요한 항목을 구분해 담당자에게 바로 질문할 수 있음', '연구지원 절차의 다음 행동과 준비 자료가 우선순위대로 제시됨', '지원 가능 여부나 연구윤리 판단을 대신하지 않고 확인 질문으로 남김', '기타 직접 입력'],
  '기획·성과·평가': ['수신자가 1쪽 요약만 읽고 보고 목적·핵심 성과·결정이 필요한 사항을 파악할 수 있음', '수치·사례·해석·한계가 구분되어 성과를 과장하거나 오해하지 않음', '다음 단계의 담당·기한·추가 데이터 요구가 실행 가능한 수준으로 정리됨', '모든 핵심 수치에 기준일·출처·비교 기준이 표시되어 재검증할 수 있음', '기타 직접 입력'],
  '일반행정·인사·안전': ['수신자가 요청받은 행동·회신 기한·담당 창구를 한 번에 확인하고 즉시 처리할 수 있음', '공식 문서에 맞는 정중한 표현으로 배경과 요청 사항이 혼동 없이 분리됨', '안전 안내의 경우 즉시 해야 할 행동과 금지 사항이 우선순위대로 제시됨', '권한·인사·사건 판단이 필요한 부분은 결론 대신 담당자 확인 항목으로 남김', '기타 직접 입력'],
  '재무·계약·시설': ['검토자가 문서만 보고 사실 확인이 필요한 항목과 담당 부서를 빠짐없이 확인할 수 있음', '시설 안내의 경우 영향 범위·이용 제한 시간·대체 방법·문의처를 분리해 전달함', '예산·계약 관련 문서는 판단이나 승인 없이 준비 자료와 확인 질문을 구조화함', '수치·규격·일정 등 오류 위험이 큰 요소를 체크리스트로 재검증할 수 있음', '기타 직접 입력'],
  '홍보·대외협력': ['대상자가 핵심 메시지와 참여/문의 행동을 10초 안에 이해할 수 있음', '보도·홍보 문안의 모든 수치·인용·협력기관 표기가 제공 근거와 일치함', '홈페이지·이메일·SNS 등 채널이 달라도 핵심 메시지와 톤이 일관됨', '게시 전 최종 확인이 필요한 사실과 로고·이미지 사용 유의사항이 명확함', '기타 직접 입력'],
  '정보화·디지털': ['신규 이용자가 별도 도움 없이 준비 사항부터 이용 완료까지 단계별로 따라 할 수 있음', '보안상 하지 말아야 할 행동과 장애 발생 시 공식 지원 창구가 눈에 띄게 제시됨', '기술 용어를 최소화해 비전문가도 문제 해결에 필요한 정보를 찾을 수 있음', 'FAQ가 반복 문의를 줄일 만큼 구체적이며 권한별 차이는 확인 필요로 구분됨', '기타 직접 입력'],
  '도서관·학술서비스': ['이용자가 본인에게 해당하는 서비스·교육·신청 방법을 빠르게 선택할 수 있음', '학술정보 접근 조건과 공식 링크·문의처가 정확히 제시되어 바로 이용할 수 있음', '교원·학생·연구자별 준비 사항이 구분되어 불필요한 안내를 줄임', '구독 범위나 이용 권한처럼 확인이 필요한 항목은 추정하지 않고 표시함', '기타 직접 입력'],
  '평생·지역협력': ['참여자가 교육 목적·대상·일정·신청 방법을 이해하고 참여 여부를 결정할 수 있음', '운영자가 역할·협력기관·운영 단계·성과 확인 방법을 한 문서에서 점검할 수 있음', '지역사회 대상에게 익숙한 쉬운 표현으로 프로그램 가치와 참여 행동을 전달함', '확정되지 않은 정원·지원·협약 사항은 사실처럼 쓰지 않고 확인 항목으로 남김', '기타 직접 입력'],
  '창업·지역협력': ['참여자가 지원 범위·준비 사항·일정·문의처를 파악해 다음 행동을 결정할 수 있음', '운영자가 모집·선발 후 운영·멘토링·성과 공유 단계의 역할을 구분해 확인할 수 있음', '지원 내용과 선발 기준을 과장하지 않고 공식 정보와 확인 필요 사항을 분리함', 'FAQ가 예비 참여자의 반복 질문을 줄일 만큼 구체적인 행동 중심으로 작성됨', '기타 직접 입력'],
  '생활관·시설 운영': ['이용자가 본인에게 적용되는 일정·장소·준비물·금지 행동을 빠르게 확인할 수 있음', '시설 점검·이용 제한의 영향 범위와 대체 방법이 혼동 없이 분리되어 있음', '안전 유의사항과 비상 시 문의처가 즉시 행동 가능한 문장으로 제시됨', '벌점·징계·건강 판단처럼 민감한 기준은 공식 근거 없이는 포함하지 않음', '기타 직접 입력'],
  '인권·상담 지원': ['수신자가 예방교육 목적·참여 방법·공식 지원 창구를 안전하고 존중적인 표현으로 이해할 수 있음', '민감한 사례나 개인정보를 노출하지 않으면서도 도움이 필요한 사람이 다음 행동을 알 수 있음', '긴급·사건 대응처럼 전문 판단이 필요한 부분은 담당 부서 확인 경로로 연결됨', '안내문이 낙인·비난 없이 접근 가능한 언어로 작성되었는지 점검할 수 있음', '기타 직접 입력'],
  '문화·전시 운영': ['관람객이 행사 가치·대상·일정·장소·참여 방법을 한 화면에서 이해할 수 있음', '전시·행사 관련 사실과 이미지·인용 정보가 제공된 공식 자료와 일치함', '홍보 채널별 문안이 달라도 관람객에게 요청하는 행동이 일관됨', '방문 전 필요한 예약·접근성·문의 정보를 빠뜨리지 않고 안내함', '기타 직접 입력']
};

const constraintsByRisk = {
  낮음: ['공식·공개 자료만 근거로 사용', '미확인 사실은 확인 필요로 표시', '간결한 한국어로 작성', '기타 직접 입력'],
  보통: ['개인정보·비공개 정보 제외', '확정 사실과 추정을 분리', '담당자 최종 검토 전제로 작성', '정해진 분량 안에서 작성', '기타 직접 입력'],
  높음: ['개인정보·민감정보 절대 입력하지 않음', '승인·평가·계약·법률 판단을 하지 않음', '공개된 사실과 내부 확인 항목을 분리', '담당 부서의 최종 검토를 명시', '기타 직접 입력']
};

function choicesFor(label) {
  return optionLibrary[label] || optionLibrary['기본'];
}

const workflowStageOrder = ['근거 탐색', '기획·문서화', '안내·홍보', '분석·검토'];

function groupNames() {
  return [...new Set(templates.map((template) => template.group))];
}

function activeStage() {
  return document.querySelector('.stage-tab.selected')?.dataset.stage || '전체';
}

function activateStage(stage) {
  document.querySelectorAll('.stage-tab').forEach((button) => button.classList.toggle('selected', button.dataset.stage === stage));
  renderCards(stage, $('#searchInput').value);
}

function renderTabs() {
  $('#stageTabs').innerHTML = stages.map((stage, index) => `<button class="stage-tab ${index === 0 ? 'selected' : ''}" data-stage="${stage}" role="tab" aria-selected="${index === 0}">${stage}</button>`).join('');
  $('#stageTabs').addEventListener('click', (event) => {
    if (!event.target.dataset.stage) return;
    activateStage(event.target.dataset.stage);
  });
}

function renderGroups() {
  $('#groupChips').innerHTML = groupNames().map((group) => {
    const count = templates.filter((template) => template.group === group).length;
    return `<button type="button" class="group-chip ${selectedGroup === group ? 'selected' : ''}" data-group="${group}" aria-pressed="${selectedGroup === group}"><span>${group}</span><small>${count}</small></button>`;
  }).join('');
  $('#groupChips').onclick = (event) => {
    const button = event.target.closest('[data-group]');
    if (!button) return;
    selectedGroup = selectedGroup === button.dataset.group ? null : button.dataset.group;
    selectedWorkflowGroup = selectedGroup;
    workflowDestination = selectedGroup ? documentTemplateForGroup(selectedGroup)?.id || null : null;
    updateWorkflowContext();
    renderGroups();
    renderCards(activeStage(), $('#searchInput').value);
    renderRecommendations();
  };
  $('#clearGroup').hidden = !selectedGroup;
}

function renderRecommendations() {
  const container = $('#workflowRecommendations');
  if (!selectedGroup) { container.hidden = true; container.innerHTML = ''; return; }
  const steps = workflowStageOrder.map((stage) => templates.find((template) => template.group === selectedGroup && template.stage === stage)).filter(Boolean);
  const fallback = templates.filter((template) => template.group === selectedGroup).slice(0, 3);
  const recommended = steps.length ? steps : fallback;
  container.hidden = false;
  container.innerHTML = `<div class="recommendation-heading"><div><span>직무별 추천 워크플로우</span><h3>${selectedGroup} 업무를 이렇게 시작해 보세요</h3><p>현재 업무군에서 자주 이어지는 작업을 순서대로 제안합니다. 원하는 단계부터 바로 열 수 있습니다.</p></div><b>${recommended.length}단계</b></div><div class="recommendation-steps">${recommended.map((template, index) => `<article><div class="recommendation-index">${String(index + 1).padStart(2, '0')}</div><span>${template.stage}</span><h4>${template.title}</h4><p>${template.description}</p><button type="button" data-recommend-id="${template.id}">이 단계 열기 <i>→</i></button></article>`).join('')}</div>`;
  container.querySelectorAll('[data-recommend-id]').forEach((button) => button.addEventListener('click', () => {
    const template = templates.find((item) => item.id === button.dataset.recommendId);
    activateStage(template.stage);
    selectTemplate(template.id);
  }));
}

function renderCards(stage = '전체', query = '') {
  const normalized = query.toLowerCase();
  const visible = templates.filter((template) => (stage === '전체' || template.stage === stage) && (!selectedGroup || template.group === selectedGroup) && (`${template.title} ${template.group} ${template.description}`).toLowerCase().includes(normalized));
  $('#templateCards').innerHTML = visible.map((template) => `<article class="work-card ${selected?.id === template.id ? 'chosen' : ''}" data-id="${template.id}"><div class="card-top"><span>${template.stage}</span><b class="risk ${template.risk}">${template.risk}</b></div><h3>${template.title}</h3><p>${template.description}</p><div class="card-bottom"><small>${template.group}</small><button type="button" aria-label="${template.title} 선택">→</button></div></article>`).join('') || `<p class="empty-note">선택한 조건에 맞는 템플릿이 없습니다. 업무군을 해제하거나 다른 단계를 선택해 보세요.</p>`;
  document.querySelectorAll('.work-card').forEach((card) => card.addEventListener('click', () => selectTemplate(card.dataset.id)));
}
function optionLabel(option) {
  return typeof option === 'string' ? option : option.label;
}

function optionChoices(option) {
  return typeof option === 'string' ? choicesFor(option) : option.choices;
}

function optionalField(option, index) {
  const label = optionLabel(option);
  const choices = optionChoices(option);
  return `<fieldset class="choice-field"><legend>${label}</legend><div class="choice-options">${choices.map((choice) => `<label><input type="checkbox" name="optional${index}" value="${choice}"${choice === '기타 직접 입력' ? ` data-other-toggle="optionalOther${index}"` : ''} /><span>${choice}</span></label>`).join('')}</div><input class="other-input" name="optionalOther${index}" placeholder="기타 내용을 직접 입력하세요" hidden /></fieldset>`;
}
function activeOptionalOptions() {
  if (!selected) return [];
  const base = selected.optional || [];
  if (!['GPT', 'Claude'].includes($('#toolSelect').value)) return base;
  return [...base,
    { label: '작성 방식', choices: ['실습용: 가정 수치로 바로 완성', '실제 업무용: 필요한 내용 먼저 질문'] },
    { label: '성공 기준', choices: successCriteriaByGroup[selected.group] || successCriteriaByGroup['일반행정·인사·안전'] },
    { label: '제약 조건', choices: constraintsByRisk[selected.risk] }
  ];
}

function sharedTopic() {
  return $('#sharedTopic')?.value.trim() || '';
}

function sharedEvidence() {
  return $('#sharedEvidence')?.value.trim() || '';
}

function isResearchTool() {
  return selected?.stage === '근거 탐색' || ['Perplexity', 'Liner'].includes($('#toolSelect')?.value);
}


const expertDomainByGroup = {
  '교육·학사 운영': '대학 학사행정·교육과정 운영',
  '학생·입학·국제 지원': '대학 학생지원·입학·국제교류 행정',
  '연구·산학 지원': '대학 연구지원·산학협력 행정',
  '기획·성과·평가': '대학 기획·성과관리',
  '일반행정·인사·안전': '대학 일반행정·인사·안전관리',
  '재무·계약·시설': '대학 재무·계약·시설관리',
  '홍보·대외협력': '대학 홍보·대외협력',
  '정보화·디지털': '대학 정보화 서비스 기획·운영',
  '도서관·학술서비스': '대학 도서관·학술정보 서비스',
  '평생·지역협력': '대학 평생교육·지역협력',
  '창업·지역협력': '대학 창업지원·지역협력',
  '생활관·시설 운영': '대학 생활관·시설 운영',
  '인권·상담 지원': '대학 인권·상담 지원',
  '문화·전시 운영': '대학 문화·전시 운영'
};

function expertRole() {
  const domain = expertDomainByGroup[selected?.group] || '대학 행정';
  const tool = $('#toolSelect')?.value || selected?.tool;
  if (['Perplexity', 'Liner'].includes(tool) || selected?.stage === '근거 탐색') return `${domain} 분야의 대학 행정 자료 조사·출처 검증 전문가`;
  if (tool === 'NotebookLM' || selected?.stage === '분석·검토') return `${domain} 분야의 문서 대조·품질 검토 전문가`;
  if (selected?.stage === '안내·홍보') return `${domain} 분야의 대상별 안내문·홍보문 작성 전문가`;
  if (selected?.stage === '기획·문서화') return `${domain} 분야의 기획서·행정문서 작성 전문가`;
  return `${domain} 분야의 업무 설계 전문가`;
}
function evidenceFieldKeys() {
  return ['facts', 'sources', 'source', 'notes', 'documents', 'material', 'evidence', 'approved', 'basis', 'feedback', 'data', 'researchResults'];
}

function activeFields() {
  if (!selected) return [];
  if (isResearchTool()) {
    return [
      ['institution', '조사 대상 기관·범위', '예: 서울시립대학교 학부 과정 / 수도권 4년제 대학 3곳 비교'],
      ['topic', '조사 주제', '예: 2026학년도 2학기 수강신청 변경 안내'],
      ['audience', '활용 목적', '예: 학생 안내문 작성 전 사실 확인'],
      ['sourceRule', '자료 출처 조건 (선택)', '예: 대학 공식 홈페이지·규정·공지 우선 / 제한 없음', true]
    ];
  }
  const base = selected.fields || [];
  const tool = $('#toolSelect')?.value || selected.tool;
  if (!['GPT', 'Claude'].includes(tool)) return base;
  let hasEvidenceField = false;
  const normalized = base.map(([key, label, placeholder, optional]) => {
    if (!evidenceFieldKeys().includes(key)) return [key, label, placeholder, optional];
    hasEvidenceField = true;
    return [key, 'Perplexity·Liner에서 수집한 자료·출처', '앞 단계에서 받은 결과물(핵심 사실, URL, 날짜, 수치)을 붙여 넣으세요.', optional];
  });
  return hasEvidenceField
    ? normalized
    : [...normalized, ['researchResults', 'Perplexity·Liner에서 수집한 자료·출처', '앞 단계에서 받은 결과물(핵심 사실, URL, 날짜, 수치)을 붙여 넣으세요.']];
}
function inheritedValue(key, fallback) {
  if (['topic', 'purpose', 'event', 'program', 'service'].includes(key) && sharedTopic()) return sharedTopic();
  if (!isResearchTool() && evidenceFieldKeys().includes(key)) return sharedEvidence();
  return fallback || '';
}
function fieldGuide(key) {
  const evidenceKeys = evidenceFieldKeys();
  if (evidenceKeys.includes(key)) return '무엇을 넣나요? Perplexity·Liner에서 수집한 결과를 그대로 붙여 넣으세요. 핵심 사실, URL, 게시일·기준일, 수치를 포함합니다. 이 칸은 예시가 아니라 실제 조사 결과를 넣는 곳입니다.';
  if (['topic', 'purpose', 'event', 'program', 'service'].includes(key)) return '무엇을 넣나요? 이번에 만들 문서의 주제와 목적을 한 문장으로 적으세요. 예: “2026학년도 2학기 수강신청 변경 안내”입니다.';
  if (['audience', 'owner'].includes(key)) return '무엇을 넣나요? 이 문서를 읽거나 실행할 사람을 구체적으로 적으세요. 예: 재학생, 학과 조교, 행사 운영 담당자입니다.';
  if (key === 'institution') return '무엇을 넣나요? 반드시 조사할 대학·기관 또는 비교 범위를 구체적으로 적으세요. 예: “서울시립대학교 학부 과정”, “수도권 사립대 3곳”, “A대학교와 B대학교 비교”입니다. 이 정보가 없으면 기관별 일정·절차를 정확히 조사할 수 없습니다.';
  if (key === 'sourceRule') return '무엇을 넣나요? 자료를 어디까지 찾아볼지 정하는 선택 조건입니다. 예: “대학 공식 홈페이지·규정·공지 우선”, “대학 공식자료와 정부·공공기관 자료만”, “언론·전문기관 사례도 포함”, “제한 없음”입니다. 비워 두면 AI가 신뢰할 수 있는 출처를 폭넓게 탐색하고 출처 유형을 구분합니다.';
  return '가능하면 확인된 정보와 구체적인 조건을 적으세요. 모르는 내용은 비워 두거나 [확인 필요]로 표시하세요.';
}
function exampleValue(key) {
  if (!selected) return '';
  if (key === 'institution') return '서울시립대학교 학부 과정';
  if (key === 'sourceRule') return '대학 공식 홈페이지·규정·공지 우선';
  if (evidenceFieldKeys().includes(key)) return '';
  if (key === 'scope') return selected.example.sources || selected.example.source || selected.example.facts || '서울시립대학교 및 관련 공공기관의 공식 공개 자료';
  return selected.example[key] || '';
}

function documentTemplateForGroup(group) {
  return templates.find((template) => template.group === group && template.stage === '기획·문서화') || templates.find((template) => template.group === group && template.stage !== '근거 탐색');
}

function updateWorkflowContext() {
  const group = selectedWorkflowGroup || selectedGroup || selected?.group;
  const groupBox = $('#sharedGroup');
  const status = $('#contextStatus');
  if (!groupBox || !status) return;
  groupBox.textContent = group || '업무군을 먼저 선택해 주세요';
  status.textContent = group
    ? `‘${group}’ 업무 흐름으로 고정됨 · 주제와 조사 결과는 문서화 단계에 그대로 전달됩니다.`
    : '업무 탐색에서 업무군 또는 템플릿을 선택하면 이 흐름이 고정됩니다.';
}
function renderTemplateExample() {
  const box = $('#templateExample');
  if (!selected || !box) return;
  const fields = activeFields();
  box.hidden = false;
  box.innerHTML = `<span>대표 실습 예시</span><p>${selected.title} · ${selected.group}</p><ul>${fields.map(([key, label]) => `<li><b>${label}</b>${exampleValue(key) || '예시 준비 중'}</li>`).join('')}</ul><button type="button" id="applyExample">이 예시로 시작하기</button>`;
  $('#applyExample').addEventListener('click', () => {
    fields.forEach(([key]) => {
      const input = $(`#formFields [name="${key}"]`);
      if (input && exampleValue(key)) input.value = exampleValue(key);
    });
    if (selected?.stage === '근거 탐색') { const topic = $('#formFields [name="topic"]'); if (topic?.value.trim()) $('#sharedTopic').value = topic.value.trim(); }
    buildPrompt();
    $('#applyExample').textContent = '예시 적용 완료';
  });
}
function selectTemplate(id) {
  selected = templates.find((template) => template.id === id);
  selectedGroup = selected.group;
  selectedWorkflowGroup = selected.group;
  if (selected.stage === '근거 탐색') workflowDestination = documentTemplateForGroup(selected.group)?.id || null;
  if (selected.stage === '기획·문서화') workflowDestination = selected.id;
  renderGroups();
  renderRecommendations();
  updateWorkflowContext();
  $('#selectedStage').textContent = `${selected.stage} · ${selected.group}`;
  $('#selectedTemplate').textContent = selected.title;
  $('#outputTitle').textContent = selected.title;
  $('#toolSelect').value = selected.tool;
  const required = activeFields().map(([key, label, placeholder]) => `<label>${label}<small class="field-guide">${fieldGuide(key)}</small><textarea name="${key}" placeholder="${placeholder}">${inheritedValue(key, selected.example[key])}</textarea></label>`).join('');
  const options = activeOptionalOptions();
  const optional = options.length ? `<details><summary>추가 선택 사항 열기</summary><p class="choice-guide">여러 항목을 함께 고를 수 있습니다. GPT·Claude에서는 작성 방식도 선택할 수 있으며, 선택하지 않으면 실습용 즉시 완성으로 진행됩니다.</p>${options.map(optionalField).join('')}</details>` : '';
  $('#formFields').innerHTML = required + optional;
  renderTemplateExample();
  $('#promptForm').querySelectorAll('textarea, input, select').forEach((input) => input.addEventListener('input', () => {
    if (selected?.stage === '근거 탐색' && input.name === 'topic' && input.value.trim()) $('#sharedTopic').value = input.value.trim();
    if (!isResearchTool() && evidenceFieldKeys().includes(input.name)) $('#sharedEvidence').value = input.value;
    buildPrompt();
  }));
    $('#promptForm').querySelectorAll('input[type="checkbox"][name^="optional"]').forEach((checkbox) => checkbox.addEventListener('change', () => {
    const targetName = checkbox.dataset.otherToggle;
    if (targetName) { const other = $(`[name="${targetName}"]`); if (other) { other.hidden = !checkbox.checked; if (other.hidden) other.value = ''; } }
    buildPrompt();
  }));$('#riskDot').className = `risk-dot ${selected.risk}`;
  $('#riskLabel').textContent = `위험도 ${selected.risk}`;
  $('#riskText').textContent = selected.risk === '높음' ? '판단·승인·결정은 담당자가 해야 합니다. 실제 민감정보를 입력하지 마세요.' : 'AI 결과는 초안입니다. 사실, 일정, 수신자와 공개 가능 여부를 확인해 주세요.';
  const checklist = selected.risk === '높음' ? ['개인정보·비공개 정보가 없는지 확인합니다.', '관련 규정과 권한은 담당자가 확인합니다.', 'AI 출력만으로 승인·판단하지 않습니다.'] : ['공개 가능한 자료만 사용합니다.', '출처·수치·일정을 담당자가 확인합니다.', '최종 발신·결재 전 담당자가 검토합니다.'];
  $('#reviewList').innerHTML = checklist.map((item) => `<li>${item}</li>`).join('');
  buildPrompt();
  renderCards(document.querySelector('.stage-tab.selected')?.dataset.stage || '전체', $('#searchInput').value);
  location.hash = 'studio';
}

function documentCompletionRule(tool, formData) {
  if (!['GPT', 'Claude'].includes(tool) || isResearchTool()) return '';
  const actualMode = [...formData.values()].some((value) => typeof value === 'string' && value.startsWith('실제 업무용'));
  if (actualMode) return `[작성 절차 — 실제 업무용]
1. 문서를 만들기 위해 꼭 필요한 정보가 비어 있으면, 한 번에 최대 3개의 짧은 질문만 하세요. 질문 외에 설명·초안·가정 수치는 출력하지 마세요.
2. 사용자가 답하면 같은 대화에서 이미 받은 내용까지 모두 반영해 문서를 바로 완성하세요. 이미 받은 정보를 다시 묻지 말고 추가 질문도 최소화하세요.
3. 필수 정보가 충분하면 질문 없이 바로 완성 문서를 출력하세요.
4. 확정되지 않은 실제 정보는 임의로 만들지 말고 [확인 필요]로 표시하세요.`;
  return `[작성 절차 — 실습용 즉시 완성]
1. 추가 질문이나 일반적인 안내를 먼저 출력하지 말고, 지금 제공된 정보만으로 요청한 문서를 바로 완성하세요.
2. 인원·예산·기간·성과 수치처럼 문서 완성에 필요하지만 제공되지 않은 값은 문서 성격에 맞는 [실습용 가정]으로 채우세요. 예: 참여 인원 120명, 만족도 4.3/5.0, 예산 집행률 92%, 전년 대비 12% 증가.
3. 가정한 모든 수치와 기관 고유 정보에는 [실습용 가정] 표시를 붙이고, 문서 끝에 ‘실제 업무 전 교체할 항목’을 목록으로 정리하세요. 이를 실제 사실·성과·공식 수치처럼 표현하지 마세요.
4. 결과는 설명이 아니라 바로 사용할 수 있는 완성 문서 본문으로 시작하세요.
5. 사용자가 ‘실제 업무용: 필요한 내용 먼저 질문’을 선택한 경우에만, 문서 작성 전 필요한 내용을 최대 3개 질문으로 확인하세요.`;
}
function buildPrompt() {
  if (!selected) return;
  const formData = new FormData($('#promptForm'));
  const lines = activeFields().map(([key, label, , optional]) => {
    const value = formData.get(key);
    if (optional) return `- ${label}: ${value || '별도 제한 없음 (신뢰할 수 있는 출처를 폭넓게 탐색하고 출처 유형을 구분)'}`;
    return `- ${label}: ${value || '[입력 필요]'}`;
  });
  activeOptionalOptions().forEach((option, index) => {
    const label = optionLabel(option);
    const choices = formData.getAll(`optional${index}`);
    const other = formData.get(`optionalOther${index}`)?.trim();
    const selectedChoices = choices.filter((choice) => choice !== '기타 직접 입력');
    if (choices.includes('기타 직접 입력') && other) selectedChoices.push(other);
    if (selectedChoices.length) lines.push(`- ${label}: ${selectedChoices.join(' / ')}`);
  });  const tool = $('#toolSelect').value;
  const workflowGroup = selectedWorkflowGroup || selectedGroup || selected.group;
  const sharedContext = [
    `- 선택 업무군: ${workflowGroup}`,
    sharedTopic() ? `- 공통 업무 주제(다음 단계까지 유지): ${sharedTopic()}` : '- 공통 업무 주제: [입력 필요]',
    ''
  ].filter(Boolean).join('\n');  const request = isResearchTool()
    ? `조사 대상 기관·범위와 자료 출처 조건을 우선하여 탐색하세요. 자료 출처 조건이 비어 있으면 신뢰할 수 있는 출처를 폭넓게 탐색하되, 대학 공식자료·정부/공공기관·전문기관·언론/사례 등 출처 유형을 구분해 표시하세요. 기관별 고유 정보는 조사 대상 기관이 명시된 경우에만 정리하고, 확인되지 않은 내용은 [기관 내부 확인 필요]로 표시하세요.

최종 결과는 조사 항목별 핵심 내용, 출처 URL, 게시·수정 시점, 출처 유형, 확인 필요 사항을 구분하여 정리해주세요.`
    : `${selected.request}` + (documentCompletionRule(tool, formData) ? `\n\n${documentCompletionRule(tool, formData)}` : '');  const safety = selected.risk === '높음' ? '개인정보·비공개 정보는 사용하지 말고, 승인·평가·계약 등 판단을 대신하지 마세요.' : '확정되지 않은 기관 고유 정보는 [기관 내부 확인 필요]로 표시하고, 사실을 임의로 만들지 마세요.';
  $('#promptOutput').value = `당신은 ${expertRole()}입니다.\n\n[업무 맥락]\n- 업무: ${selected.title}\n- 선택 도구: ${tool}\n${sharedContext ? `${sharedContext}\n` : ''}${lines.join('\n')}\n\n[요청]\n${request}\n\n[안전 및 검토]\n${safety}\n- 최종 결과는 담당자가 공식 자료와 대조해 검토해야 합니다.`;
}

$('#toolSelect').addEventListener('change', (event) => { $('#toolHint').textContent = toolHints[event.target.value]; buildPrompt(); });
$('#searchInput').addEventListener('input', (event) => renderCards(activeStage(), event.target.value));
$('#clearGroup').addEventListener('click', () => { selectedGroup = null; selectedWorkflowGroup = null; workflowDestination = null; updateWorkflowContext(); renderGroups(); renderCards(activeStage(), $('#searchInput').value); renderRecommendations(); });
$('#sharedTopic').addEventListener('input', buildPrompt);
$('#sharedEvidence').addEventListener('input', buildPrompt);
const researchTemplateByGroup = {
  '교육·학사 운영': 'academic-evidence', '학생·입학·국제 지원': 'admission-evidence', '연구·산학 지원': 'research-evidence', '기획·성과·평가': 'performance-evidence', '일반행정·인사·안전': 'admin-evidence', '재무·계약·시설': 'finance-evidence', '홍보·대외협력': 'communications-evidence', '정보화·디지털': 'it-evidence', '도서관·학술서비스': 'library-evidence', '평생·지역협력': 'community-evidence', '창업·지역협력': 'startup-evidence', '생활관·시설 운영': 'residential-evidence', '인권·상담 지원': 'rights-evidence', '문화·전시 운영': 'culture-evidence'
};

$('#evidenceToDocument').addEventListener('click', () => {
  const group = selectedWorkflowGroup || selectedGroup || selected?.group;
  if (!group) { alert('먼저 업무 탐색에서 업무군 또는 템플릿을 선택해 주세요.'); location.hash = 'explore'; return; }
  if (!sharedTopic()) { alert('공통 업무 주제를 먼저 입력해 주세요.'); $('#sharedTopic').focus(); return; }
  if (!sharedEvidence()) { alert('Perplexity·Liner에서 받은 조사 결과물을 붙여 넣어 주세요.'); $('#sharedEvidence').focus(); return; }
  const nextTemplate = documentTemplateForGroup(group);
  if (nextTemplate) { activateStage(nextTemplate.stage); selectTemplate(nextTemplate.id); }
});

document.querySelectorAll('[data-next-stage]').forEach((button) => button.addEventListener('click', () => {
  const nextStage = button.dataset.nextStage;
  const tab = document.querySelector(`[data-stage="${nextStage}"]`);
  if (tab) tab.click();
  let nextTemplate;
  const workflowGroup = selectedWorkflowGroup || selectedGroup || selected?.group;
  if (nextStage === '근거 탐색' && workflowGroup) {
    nextTemplate = templates.find((template) => template.id === researchTemplateByGroup[workflowGroup]);
  } else if (nextStage === '기획·문서화' && workflowGroup) {
    nextTemplate = workflowDestination ? templates.find((template) => template.id === workflowDestination) : documentTemplateForGroup(workflowGroup);
  } else if (nextStage === '분석·검토' && workflowGroup) {
    nextTemplate = templates.find((template) => template.group === workflowGroup && template.stage === '분석·검토');
  }  nextTemplate ||= templates.find((template) => template.stage === nextStage);
  if (nextTemplate) selectTemplate(nextTemplate.id);
}));
$('#copyButton').addEventListener('click', async () => { try { await navigator.clipboard.writeText($('#promptOutput').value); $('#copyButton').textContent = '복사 완료!'; setTimeout(() => { $('#copyButton').textContent = '복사하기'; }, 1500); } catch { alert('프롬프트를 선택해 복사해 주세요.'); } });
renderTabs();
renderGroups();
renderRecommendations();
renderCards();
