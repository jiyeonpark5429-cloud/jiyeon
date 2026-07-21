const formTemplates = [
  ['조사·분석','공개자료 조사·비교 보고서','여러 대학·기관의 공개 공고, 규정, 운영 사례를 비교하고 출처와 기준일을 남기는 양식.','01_공개자료_조사_비교_보고서.docx',['조사 목적·범위','출처·기준일','비교표','핵심 시사점','확인 필요 사항']],
  ['기획·참고','운영 개선 참고안','공개 사례를 참고해 우리 업무에 적용하기 전 검토할 선택지와 질문을 정리하는 양식.','02_운영_개선_참고안.docx',['참고 목적','공개 근거 요약','적용 가능 선택지','유의 사항','담당자 확인 질문']],
  ['안내·FAQ','안내문·FAQ','공개 공고·규정·이용 안내를 구성원이 바로 이해할 수 있는 안내문과 FAQ로 바꾸는 양식.','03_안내문_FAQ.docx',['제목·대상','핵심 일정·조건','이용·신청 절차','자주 묻는 질문','공식 문의처']],
  ['홍보·콘텐츠','홍보 콘텐츠 초안','공식 행사 공지·보도자료의 확인된 사실을 카드뉴스, 웹공지, SNS 문안으로 정리하는 양식.','04_홍보_콘텐츠_초안.docx',['핵심 메시지','확인된 사실·인용','채널별 문안','이미지·링크 자리','게시 전 확인']],
  ['검토·대조','출처 대조·검토 체크리스트','NotebookLM에서 공개 URL과 생성 문서를 비교하며 불일치와 확인 질문을 남기는 양식.','05_출처_대조_검토_체크리스트.docx',['대조 대상','근거 일치·차이','누락 가능성','수정 제안','담당자 확인 질문']]
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