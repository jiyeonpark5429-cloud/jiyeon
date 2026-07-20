(() => {
  const form = document.querySelector('#skillBuilderForm');
  const output = document.querySelector('#skillOutput');
  if (!form || !output) return;

  const value = (name) => form.elements[name].value.trim();

  function createPrompt() {
    const name = value('skillName') || '대학 공문서 문체';
    const when = value('skillWhen') || '공문, 보고서, 안내문 등 행정 문서를 작성할 때';
    const rules = value('skillRules') || '규칙을 입력하세요.';
    output.value = `클로드 스킬을 만들려고 합니다.
아래 규칙을 담은 SKILL.md 파일을 작성해주세요.

[스킬 기본 정보]
스킬 이름: ${name}
작동 시점: ${when}

[규칙]
${rules}`;
  }

  form.addEventListener('submit', (event) => { event.preventDefault(); createPrompt(); });
  document.querySelector('#copySkillButton').addEventListener('click', async (event) => {
    createPrompt();
    try {
      await navigator.clipboard.writeText(output.value);
      event.currentTarget.textContent = '복사 완료!';
      window.setTimeout(() => { event.currentTarget.textContent = '요청문 복사'; }, 1500);
    } catch { output.select(); document.execCommand('copy'); }
  });
  createPrompt();
})();