import { solveSymptomChecklist, CROP_SYMPTOMS } from '../lib/diseaseDetector';

describe('solveSymptomChecklist', () => {
  it('falls back to a generic fungal diagnosis for crops without specific rules', () => {
    const results = solveSymptomChecklist('sorghum', 'Arusha', ['orange_dust']);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].diseaseNameEn).toContain('Fungal/Pathogenic Infection');
  });

  it('reports Common Rust for maize when the rust symptom is selected', () => {
    const results = solveSymptomChecklist('maize', 'Arusha', ['powder_rust']);
    const rust = results.find((r) => r.diseaseNameEn === 'Common Rust');
    expect(rust).toBeDefined();
    // 0.1 base + 0.7 symptom (+ any region risk) → comfortably high confidence
    expect(rust!.confidence).toBeGreaterThanOrEqual(80);
    expect(rust!.organicControlEn).toBeTruthy();
    expect(rust!.organicControlSw).toBeTruthy();
  });

  it('surfaces all three maize diseases when their symptoms are present', () => {
    // Drives MSV, MLN and Common Rust each above the 15% reporting threshold.
    const names = solveSymptomChecklist('maize', 'Arusha', [
      'yellow_veins',
      'wilted_stunted',
      'powder_rust',
    ]).map((r) => r.diseaseNameEn);
    expect(names).toEqual(
      expect.arrayContaining([
        'Maize Streak Virus (MSV)',
        'Maize Lethal Necrosis (MLN)',
        'Common Rust',
      ])
    );
  });

  it('filters out diseases below the 15% confidence threshold', () => {
    // With no symptoms selected, low-scoring diseases are dropped.
    const results = solveSymptomChecklist('maize', 'Arusha', []);
    expect(results.every((r) => r.confidence >= 15)).toBe(true);
  });

  it('never reports a confidence above 98', () => {
    const allMaizeSymptoms = CROP_SYMPTOMS.maize.map((s) => s.id);
    const results = solveSymptomChecklist('maize', 'Arusha', allMaizeSymptoms);
    for (const r of results) {
      expect(r.confidence).toBeLessThanOrEqual(98);
    }
  });
});
