(() => {
  const form = document.querySelector('#skillBuilderForm');
  const output = document.querySelector('#skillOutput');
  if (!form || !output) return;

  const value = (name) => form.elements[name].value.trim();

  function createPrompt() {
    const name = value('skillName') || '나의 Claude 스킬';
    const when = value('skillWhen') || '[작동 시점 작성]';
    const rules = value('skillRules') || '[스킬 규칙 작성]';
    const example = value('skillExample');
    output.value = `클로드 스킬을 만들려고 합니다.
아래 규칙을 담은 SKILL.md 파일을 작성하고,
Claude에 업로드할 수 있게 ZIP 파일로 만들어주세요.

[스킬 기본 정보]
스킬 이름: ${name}
작동 시점: ${when}

[규칙]
${rules}
${example ? `
[대표 업무 예시]
${example}
` : ''}
[파일 제작 기준]
1. SKILL.md 파일 첫머리에 name과 description을 포함한 YAML 메타데이터를 넣어주세요.
2. 설명에는 이 스킬을 언제 사용해야 하는지 분명하게 써주세요.
3. ZIP 안에는 스킬 폴더가 최상위에 오도록 만들어주세요.
4. 최상위 폴더명은 uos-official-writing처럼 영문, 숫자, 밑줄(_), 하이픈(-)만 사용해주세요.
5. ZIP을 열었을 때 [폴더명]/SKILL.md 구조가 보이게 해주세요.

먼저 SKILL.md 전문을 보여주고, 규칙이 모두 반영됐는지 짧은 점검표도 함께 제시해주세요.`;
  }

  form.addEventListener('submit', (event) => { event.preventDefault(); createPrompt(); });
  document.querySelector('#copySkillButton').addEventListener('click', async (event) => {
    createPrompt();
    try {
      await navigator.clipboard.writeText(output.value);
      event.currentTarget.textContent = '복사됨';
      window.setTimeout(() => { event.currentTarget.textContent = '요청문 복사'; }, 1500);
    } catch { output.select(); document.execCommand('copy'); }
  });
  createPrompt();
})();