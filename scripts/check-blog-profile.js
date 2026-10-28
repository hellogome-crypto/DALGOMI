const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { _private: prompts } = require('../src/lib/codexRunner');
const { SIGNATURE } = require('../src/lib/blogProfile');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dalgomi-profile-'));
try {
  const options = { jobDir: root, runtimeRoot: root, topic: '제주 숙소 선택', category: '숙소', searchResults: [], historyTitles: [], researchTitleResult: {}, writerResult: {} };
  for (const name of ['buildPrompt', 'buildResearchTitlePrompt', 'buildResearchTitleRetryPrompt', 'buildWriterRetryPrompt', 'buildMainReviewPrompt', 'buildWriterContractRefinementPrompt']) {
    const prompt = prompts[name](options, {});
    assert.ok(prompt.includes('[DALGOMI EDITORIAL PROFILE v1]'), name);
    assert.ok(prompt.includes(SIGNATURE), name);
    assert.ok(!prompt.includes('1500-2000'), name);
    assert.ok(prompt.includes('경험 메모가 없으면 정보형'), name);
  }
  const noImages = prompts.buildPrompt({ ...options, maxBodyImages: 0, includeTitleImage: false });
  assert.ok(noImages.includes('Do not insert any [IMAGE INSERT - n]'));
  const images = prompts.buildPrompt({ ...options, maxBodyImages: 10 });
  assert.ok(images.includes('exactly one matching [IMAGE INSERT - n]'));
  assert.ok(prompts.buildImageWorkerPrompt(options).includes('Soft 3D claymorphism'));
  assert.ok(prompts.buildWriterContract({}, {}).tone.includes('달고미'));
  console.log('DALGOMI profile: initial/retry/review/refinement and image/no-image prompts passed.');
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
