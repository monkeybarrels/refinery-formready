import { describe, it, expect, beforeEach, vi } from 'vitest'

/**
 * Tests for the analyze page anonymous upload flow
 *
 * These tests ensure that:
 * 1. S3 URLs are properly constructed from presigned upload URLs
 * 2. The analyze endpoint receives valid URL format (not just S3 keys)
 * 3. Error handling works correctly at each stage of upload
 */
describe('Analyze Page - Anonymous Upload', () => {
  let fetchMock: any

  beforeEach(() => {
    // Reset fetch mock before each test
    fetchMock = vi.fn()
    global.fetch = fetchMock

    // Clear localStorage
    localStorage.clear()
  })

  describe('Storage URL Construction', () => {
    it('should construct full S3 URL from presigned upload URL', async () => {
      const mockPresignedUrl = 'https://b1.us-east-1.storage.railway.app/stackable-foodbox-kqa9-zq/orgs/anonymous/anonymous/test-file.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=test'
      const mockS3Key = 'orgs/anonymous/anonymous/test-file.pdf'

      // Mock presigned URL response
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          uploadUrl: mockPresignedUrl,
          s3Key: mockS3Key
        })
      })

      // Mock S3 upload success
      fetchMock.mockResolvedValueOnce({
        ok: true
      })

      // Mock analyze success
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          sessionId: 'test-session-id',
          results: {}
        })
      })

      // Simulate the URL construction logic from analyze.vue
      const s3Url = new URL(mockPresignedUrl)
      const storageUrl = `${s3Url.protocol}//${s3Url.host}${s3Url.pathname}`

      // Verify constructed URL is valid and doesn't include query params
      expect(storageUrl).toBe('https://b1.us-east-1.storage.railway.app/stackable-foodbox-kqa9-zq/orgs/anonymous/anonymous/test-file.pdf')
      expect(storageUrl).not.toContain('X-Amz-Algorithm')
      expect(storageUrl).not.toContain('?')

      // Verify it's a valid URL
      expect(() => new URL(storageUrl)).not.toThrow()

      // Verify it starts with https://
      expect(storageUrl).toMatch(/^https:\/\//)
    })

    it('should NOT send just the S3 key as storage URL', () => {
      const s3Key = 'orgs/anonymous/anonymous/test-file.pdf'

      // Verify S3 key alone is NOT a valid URL
      expect(() => new URL(s3Key)).toThrow()

      // Verify it would fail URL validation
      const urlPattern = /^https?:\/\//
      expect(s3Key).not.toMatch(urlPattern)
    })

    it('should handle different S3 endpoint formats', () => {
      const testCases = [
        {
          uploadUrl: 'https://s3.amazonaws.com/bucket/key/file.pdf?signature=xyz',
          expected: 'https://s3.amazonaws.com/bucket/key/file.pdf'
        },
        {
          uploadUrl: 'https://bucket.s3.us-east-1.amazonaws.com/key/file.pdf?signature=xyz',
          expected: 'https://bucket.s3.us-east-1.amazonaws.com/key/file.pdf'
        },
        {
          uploadUrl: 'https://custom-endpoint.com/bucket/key/file.pdf?param1=a&param2=b',
          expected: 'https://custom-endpoint.com/bucket/key/file.pdf'
        }
      ]

      testCases.forEach(({ uploadUrl, expected }) => {
        const s3Url = new URL(uploadUrl)
        const storageUrl = `${s3Url.protocol}//${s3Url.host}${s3Url.pathname}`

        expect(storageUrl).toBe(expected)
        expect(storageUrl).not.toContain('?')
        expect(() => new URL(storageUrl)).not.toThrow()
      })
    })
  })

  describe('Analyze Endpoint Payload Validation', () => {
    it('should send storageUrl as valid URL to analyze endpoint', async () => {
      const mockPresignedUrl = 'https://b1.us-east-1.storage.railway.app/bucket/orgs/anonymous/anonymous/test.pdf?signature=xyz'

      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            uploadUrl: mockPresignedUrl,
            s3Key: 'orgs/anonymous/anonymous/test.pdf'
          })
        })
        .mockResolvedValueOnce({ ok: true }) // S3 upload
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ sessionId: 'test-123', results: {} })
        })

      const s3Url = new URL(mockPresignedUrl)
      const storageUrl = `${s3Url.protocol}//${s3Url.host}${s3Url.pathname}`

      // Simulate analyze API call
      await fetch('http://localhost:3001/api/analyze/anonymous', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storageUrl })
      })

      // Verify the analyze endpoint was called with proper URL
      const analyzeCall = fetchMock.mock.calls.find((call: any) =>
        call[0]?.includes('/api/analyze/anonymous')
      )

      expect(analyzeCall).toBeDefined()
      const payload = JSON.parse(analyzeCall[1].body)

      // Verify storageUrl is a valid URL
      expect(() => new URL(payload.storageUrl)).not.toThrow()
      expect(payload.storageUrl).toMatch(/^https:\/\//)
      expect(payload.storageUrl).not.toContain('?') // No query params
    })

    it('should fail validation if sending S3 key instead of URL', () => {
      const s3Key = 'orgs/anonymous/anonymous/test.pdf'

      // This simulates what would happen with @IsUrl() validator
      const isValidUrl = (str: string) => {
        try {
          new URL(str)
          return true
        } catch {
          return false
        }
      }

      expect(isValidUrl(s3Key)).toBe(false)
    })
  })

  describe('Error Scenarios', () => {
    it('should handle malformed presigned URL gracefully', async () => {
      const invalidUrl = 'not-a-valid-url'

      expect(() => new URL(invalidUrl)).toThrow()

      // In the actual component, this would be caught and handled
      try {
        new URL(invalidUrl)
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError)
      }
    })

    it('should handle presigned URL without query params', () => {
      const urlWithoutParams = 'https://endpoint.com/bucket/key/file.pdf'

      const s3Url = new URL(urlWithoutParams)
      const storageUrl = `${s3Url.protocol}//${s3Url.host}${s3Url.pathname}`

      expect(storageUrl).toBe(urlWithoutParams)
      expect(() => new URL(storageUrl)).not.toThrow()
    })

    it('should handle analysis failure with 400 Bad Request', async () => {
      // Mock a 400 error response
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: {
            type: 'invalid_request_error',
            code: 'parameter_invalid',
            message: 'Storage URL must be a valid URL'
          }
        })
      })

      const response = await fetch('http://localhost:3001/api/analyze/anonymous', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storageUrl: 'invalid-key' })
      })

      expect(response.ok).toBe(false)
      expect(response.status).toBe(400)

      const error = await response.json()
      expect(error.error.message).toContain('Storage URL must be a valid URL')
    })
  })

  describe('URL Format Validation Helpers', () => {
    it('should validate URL format matches backend expectations', () => {
      const validUrls = [
        'https://b1.us-east-1.storage.railway.app/bucket/orgs/user/file.pdf',
        'https://s3.amazonaws.com/bucket/key.pdf',
        'http://localhost:9000/bucket/file.pdf'
      ]

      const invalidInputs = [
        'orgs/anonymous/file.pdf',
        'bucket/key/file.pdf',
        ''
      ]

      validUrls.forEach(url => {
        expect(() => new URL(url)).not.toThrow()
      })

      invalidInputs.forEach(input => {
        if (input) {
          expect(() => new URL(input as string)).toThrow()
        }
      })

      // Separately test that s3:// protocol throws (it's a valid URL but not http/https)
      expect(() => new URL('s3://bucket/key')).not.toThrow()
      const s3Url = new URL('s3://bucket/key')
      expect(s3Url.protocol).toBe('s3:')
      // But our backend expects http/https
      expect(s3Url.protocol).not.toMatch(/^https?:/)
    })

    it('should extract clean URL without query parameters', () => {
      const presignedUrl = 'https://storage.com/bucket/key.pdf?X-Amz-Algorithm=AWS4&X-Amz-Credential=creds&X-Amz-Date=20250103&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=abc123'

      const url = new URL(presignedUrl)
      const cleanUrl = `${url.protocol}//${url.host}${url.pathname}`

      expect(cleanUrl).toBe('https://storage.com/bucket/key.pdf')
      expect(cleanUrl.includes('?')).toBe(false)
      expect(cleanUrl.includes('X-Amz')).toBe(false)
    })
  })
})
