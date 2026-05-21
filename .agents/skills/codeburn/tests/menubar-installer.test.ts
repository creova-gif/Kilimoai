import { describe, expect, it } from 'vitest'
import {
  resolveLatestMenubarReleaseAssets,
  resolveMenubarReleaseAssets,
  type ReleaseResponse,
} from '../src/menubar-installer.js'

function asset(name: string) {
  return { name, browser_download_url: `https://example.test/${name}` }
}

describe('resolveMenubarReleaseAssets', () => {
  it('ignores dev zips and pairs the checksum with the versioned zip', () => {
    const release: ReleaseResponse = {
      tag_name: 'mac-v0.9.8',
      assets: [
        asset('CodeBurnMenubar-dev.zip'),
        asset('CodeBurnMenubar-dev.zip.sha256'),
        asset('CodeBurnMenubar-v0.9.8.zip'),
        asset('CodeBurnMenubar-v0.9.8.zip.sha256'),
      ],
    }

    const resolved = resolveMenubarReleaseAssets(release)

    expect(resolved.zip.name).toBe('CodeBurnMenubar-v0.9.8.zip')
    expect(resolved.checksum?.name).toBe('CodeBurnMenubar-v0.9.8.zip.sha256')
  })

  it('fails when a release only contains dev assets', () => {
    const release: ReleaseResponse = {
      tag_name: 'mac-v0.9.8',
      assets: [
        asset('CodeBurnMenubar-dev.zip'),
        asset('CodeBurnMenubar-dev.zip.sha256'),
      ],
    }

    expect(() => resolveMenubarReleaseAssets(release)).toThrow(/versioned zip/)
  })

  it('fails when the versioned checksum is missing', () => {
    const release: ReleaseResponse = {
      tag_name: 'mac-v0.9.8',
      assets: [
        asset('CodeBurnMenubar-v0.9.8.zip'),
      ],
    }

    expect(() => resolveMenubarReleaseAssets(release)).toThrow(/Missing checksum/)
  })

  it('selects the newest mac release instead of the newest repo release', () => {
    const releases: ReleaseResponse[] = [
      {
        tag_name: 'v0.9.9',
        assets: [
          asset('codeburn-0.9.9.tgz'),
        ],
      },
      {
        tag_name: 'mac-v0.9.8',
        assets: [
          asset('CodeBurnMenubar-v0.9.8.zip'),
          asset('CodeBurnMenubar-v0.9.8.zip.sha256'),
        ],
      },
    ]

    const resolved = resolveLatestMenubarReleaseAssets(releases)

    expect(resolved.release.tag_name).toBe('mac-v0.9.8')
    expect(resolved.zip.name).toBe('CodeBurnMenubar-v0.9.8.zip')
  })
})
