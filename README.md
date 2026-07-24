# 생활형 AI 프롬프트 실습실

동탄8동 주민 대상 생성형 AI 교육용 반응형 프롬프트 실습 웹앱입니다.

## 로컬 실행

```bash
pnpm install
pnpm dev
```

## 배포용 빌드

```bash
pnpm build
```

완성된 정적 웹사이트는 `dist/` 폴더에 생성됩니다. 이 폴더 전체를 Netlify, Vercel, Cloudflare Pages 또는 일반 웹 호스팅에 업로드하면 됩니다.

## GitHub Pages 배포

`main` 브랜치에 변경 사항을 푸시하면 GitHub Actions가 `dist/`를 자동 배포합니다. 저장소의 **Settings → Pages**에서 배포 원본을 **GitHub Actions**로 선택하세요.

프롬프트 카드는 `src/data/prompts.ts`에서 추가·수정할 수 있습니다.
