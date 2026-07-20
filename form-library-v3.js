const formTemplates = [
  ['행정·협업','공문 초안','부서 간 협조 요청·안내·회신 요청을 정리하는 참고 양식.','01_공문_초안.docx',['수신·참조','제목','요청 배경','요청 사항','기한·일정']],
  ['행정·협업','협조 요청서','여러 부서의 역할과 일정을 조율할 때 쓰는 양식.','02_협조_요청서.docx',['요청 개요','협조 대상','요청 내용','일정','역할 분담']],
  ['행정·협업','내부 검토 메모','결재·회의 전 핵심 쟁점과 확인 사항을 빠르게 공유하는 양식.','03_내부_검토_메모.docx',['검토 안건','검토 목적','핵심 내용','검토 의견','다음 단계']],
  ['행정·협업','회의록 및 액션리스트','논의와 결정, 담당자별 후속 조치를 남기는 양식.','04_회의록.docx',['회의 정보','안건별 논의','후속 과제','확인 필요','다음 회의']],
  ['행정·협업','업무 인수인계서','담당 변경 시 진행 업무·일정·자료 위치를 정리하는 양식.','05_업무_인수인계서.docx',['업무 개요','진행 현황','주요 일정','관련 자료','유의 사항']],
  ['기획·사업','사업 계획서','신규 사업 또는 개선 과제의 목적과 추진 계획을 구성하는 양식.','06_사업_계획서.docx',['사업 개요','추진 배경·목적','추진 내용','추진 일정','성과 확인']],
  ['기획·사업','운영 계획서','교육·행사·서비스 운영의 역할과 일정을 정리하는 양식.','07_운영_계획서.docx',['운영 개요','운영 목표','운영 흐름','인력·역할','사후 정리']],
  ['기획·사업','결과 보고서','완료한 사업·행사의 운영 결과와 확인된 성과를 보고하는 양식.','08_결과_보고서.docx',['사업 개요','추진 내용','주요 결과','개선 사항','후속 계획']],
  ['기획·사업','성과 요약보고서','관리자·회의용으로 핵심 결과와 다음 의사결정을 압축하는 양식.','09_성과_요약보고서.docx',['한눈에 보는 결과','주요 추진 내용','확인된 변화','의사결정 요청','다음 일정']],
  ['안내·행사','행사 운영계획서','교내 행사·설명회·교육 프로그램을 준비하는 양식.','10_행사_운영계획서.docx',['행사 기본 정보','목표·대상','세부 일정','운영 인력','현장 체크']],
  ['안내·행사','참가자 안내문','학생·교직원·외부 참여자에게 일정과 방법을 전달하는 양식.','11_참가자_안내문.docx',['제목·한줄 안내','핵심 일정','참여 방법','준비 사항','자주 묻는 질문']],
  ['안내·행사','보도자료 초안','확정된 사실을 바탕으로 대외 홍보문을 구성하는 양식.','12_보도자료_초안.docx',['제목','리드문','본문','인용문 자리','배포 전 확인']],
  ['검토·관리','문서 검토 체크리스트','공지·보고서·안내문 공개 전 점검하는 양식.','13_문서_검토_체크리스트.docx',['문서 정보','사실 확인','표현 점검','정보보호','조치 결과']],
  ['검토·관리','민원 응대 기록지','문의·민원의 사실 관계와 후속 안내를 기록하는 양식.','14_민원_응대_기록지.docx',['접수 정보','문의 요지','확인한 사실','후속 조치','유의 사항']],
  ['검토·관리','시설 점검표','행사·강의·공용시설 사용 전후 점검하는 양식.','15_시설_점검표.docx',['점검 정보','기본 상태','장비·안전','이상 사항','최종 확인']]
].map(([category,title,description,file,fields]) => ({ category,title,description,file:`forms/${file}`,fields }));

let selectedFormCategory = '전체';
const formCategories = ['전체', ...new Set(formTemplates.map((item) => item.category))];
const formLibrary = () => document.querySelector('#forms');

function renderFormCategories() {
  const target = document.querySelector('#formCategoryTabs');
  if (!target) return;
  target.innerHTML = formCategories.map((category) => `<button type="button" class="form-category ${selectedFormCategory === category ? 'selected' : ''}" data-form-category="${category}">${category}</button>`).join('');
  target.onclick = (event) => {
    const button = event.target.closest('[data-form-category]');
    if (!button) return;
    selectedFormCategory = button.dataset.formCategory;
    renderFormCategories();
    renderFormCards();
  };
}

function renderFormCards() {
  const target = document.querySelector('#formCards');
  const query = (document.querySelector('#formSearch')?.value || '').toLowerCase();
  if (!target) return;
  const visible = formTemplates.filter((item) => (selectedFormCategory === '전체' || item.category === selectedFormCategory) && `${item.title} ${item.description} ${item.category}`.toLowerCase().includes(query));
  target.innerHTML = visible.map((item, index) => `<article class="form-card"><div class="form-card-top"><span>${item.category}</span><b>${String(formTemplates.indexOf(item) + 1).padStart(2, '0')}</b></div><h3>${item.title}</h3><p>${item.description}</p><div class="form-fields-preview"><small>양식 구성</small>${item.fields.slice(0, 3).map((field) => `<i>${field}</i>`).join('')}<em>+${Math.max(item.fields.length - 3, 0)}</em></div><div class="form-card-actions"><button type="button" data-form-preview="${index}">구성 보기</button><a href="${item.file}" download>DOCX 다운로드</a></div></article>`).join('') || '<p class="empty-note">검색 조건에 맞는 양식이 없습니다.</p>';
  target.querySelectorAll('[data-form-preview]').forEach((button) => button.addEventListener('click', () => showFormPreview(formTemplates[Number(button.dataset.formPreview)])));
}

function showFormPreview(item) {
  const panel = document.querySelector('#formPreviewPanel');
  if (!panel) return;
  panel.hidden = false;
  panel.innerHTML = `<div><span>양식 미리보기</span><h3>${item.title}</h3><p>${item.description}</p></div><ol>${item.fields.map((field) => `<li><b>${field}</b><small>작성할 내용을 입력하는 영역</small></li>`).join('')}</ol><div class="form-preview-actions"><a href="${item.file}" download>이 양식 다운로드</a><button type="button" id="closeFormPreview">닫기</button></div>`;
  document.querySelector('#closeFormPreview').addEventListener('click', () => { panel.hidden = true; });
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function initFormLibrary() {
  if (!formLibrary()) return;
  renderFormCategories();
  renderFormCards();
  document.querySelector('#formSearch').addEventListener('input', renderFormCards);
}

initFormLibrary();